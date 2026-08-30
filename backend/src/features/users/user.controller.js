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
    // Set tenantId to their own ID since they are the root account (Admin)
    userModel.tenantId = userModel._id;

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
        { 
            email: user.email, 
            _id: user._id, 
            role: user.role, 
            tenantId: user.tenantId 
        },
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
            email: user.email,
            role: user.role,
            tenantId: user.tenantId
        }
    });
});

const getEmployees = asyncHandler(async (req, res) => {
    // Fetch employees that belong to this tenant, explicitly excluding the Admin (since Admins can never be billers)
    const employees = await User.find({ 
        tenantId: req.user.tenantId || req.user._id,
        role: { $ne: 'Admin' }
    }).select('-password');
    res.status(200).json(employees);
});

const addEmployee = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;
    
    // Only Admin can add employees, which is enforced by authorizeRoles middleware on the route
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(409).json({ message: 'User with this email already exists', success: false });
    }

    if (!['Manager', 'Cashier'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role assignment', success: false });
    }

    const newPassword = await bcrypt.hash(password, 10);
    const newEmployee = await User.create({
        name,
        email,
        password: newPassword,
        role,
        tenantId: req.user.tenantId || req.user._id
    });

    res.status(201).json({ message: 'Employee added successfully', success: true, employee: { id: newEmployee._id, name: newEmployee.name, role: newEmployee.role } });
});

const deleteEmployee = asyncHandler(async (req, res) => {
    const employeeId = req.params.id;
    
    if (employeeId === req.user._id.toString()) {
        return res.status(400).json({ message: 'Cannot delete yourself', success: false });
    }

    // Ensure the admin can only delete their own employees
    const employee = await User.findOne({ _id: employeeId, tenantId: req.user.tenantId || req.user._id });
    if (!employee) {
        return res.status(404).json({ message: 'Employee not found or unauthorized', success: false });
    }

    await User.findByIdAndDelete(employeeId);
    res.status(200).json({ message: 'Employee deleted successfully', success: true });
});

module.exports = {
    handleUserSignUp,
    handleUserLogin,
    getEmployees,
    addEmployee,
    deleteEmployee
};
