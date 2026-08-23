const bcrypt = require('bcrypt');
const User = require('./user.model');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../../middlewares/asyncHandler');

const handleUserSignUp = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        return res.status(409).json({ message: 'User already exists', success: false });
    }
    const newPassword = await bcrypt.hash(password, 10);
    const userModel = new User({ name, email, password: newPassword });

    await userModel.save();
    return res.status(201).json({ message: 'Signup successful', success: true });
});

const handleUserLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(403).json({ message: 'Invalid email or password', success: false });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(403).json({ message: 'Invalid email or password', success: false });
    }
    const jwtToken = jwt.sign(
        { email: user.email, _id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    return res.status(200).json({
        message: 'Login successful',
        success: true,
        jwtToken,
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    });
});

module.exports = {
    handleUserSignUp,
    handleUserLogin
};
