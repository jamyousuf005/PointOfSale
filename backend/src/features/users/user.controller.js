const bcrypt = require('bcrypt')
const User = require('./user.model')
const jwt = require('jsonwebtoken')

async function handleUserSignUp(req, res) {
    try {
        const { name, email, password } = req.body
        const user = await User.findOne({ email })
        if (user) {
            return res.status(409)
            .json({ message: 'User already exists', success: false })
        }
        const newPassword= await bcrypt.hash(password, 10)
        const userModel = new User({ name, email, password:newPassword })
        
        await userModel.save()
        res.status(201).json({ message: 'Signup successful', success: true })
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', success: false })
    }
}
async function handleUserLogin(req, res) {
    try {
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
            {email:user.email,_id:user._id},
            process.env.JWT_SECRET,
            {expiresIn:'24h'}
        )

        return res.status(201)
        .json({
            message: 'Login successful',
            success: true,
            jwtToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal server error', success: false });
    }
}




module.exports = {
    handleUserSignUp,
    handleUserLogin
}

