const bcrypt = require('bcrypt')
const User = require('../models/user')

async function handleUserSignUp(req, res) {
    try {
        const { name, email, password } = req.body
        const user = await User.findOne({ email })
        if (user) {
            return res.status(409)
            .json({ msg: 'user alreaday logged in', success: false })
        }
        const newPassword= await bcrypt.hash(password, 10)
        const userModel = new User({ name, email, password:newPassword })
        
        await userModel.save()
        res.status(201).json({ msg: 'signup successfull', success: true })
    } catch (err) {
        res.status(500).json({ msg: 'internal server error', success: true })
    }
}
async function handleUserLogin(req, res) {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ msg: 'Invalid email or password', success: false });
        }

        // Compare entered password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ msg: 'Invalid email or password', success: false });
        }

        // Success
        return res.status(200).json({
            msg: 'Login successful',
            success: true,
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

