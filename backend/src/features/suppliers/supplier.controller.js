const Supplier = require('./supplier.model');
const asyncHandler = require('../../middlewares/asyncHandler');

const getSuppliers = asyncHandler(async (req, res) => {
    const suppliers = await Supplier.find({ userId: (req.user.tenantId || req.user._id) }).sort({ createdAt: -1 });
    res.json(suppliers);
});

const createSupplier = asyncHandler(async (req, res) => {
    const { name, email, phone, address, company } = req.body;
    
    // Check if supplier already exists for this tenant
    const supplierExists = await Supplier.findOne({ 
        name, 
        userId: (req.user.tenantId || req.user._id) 
    });
    
    if (supplierExists) {
        res.status(400);
        throw new Error('Supplier already exists');
    }

    const supplier = await Supplier.create({
        name,
        email,
        phone,
        address,
        company,
        userId: (req.user.tenantId || req.user._id)
    });

    res.status(201).json(supplier);
});

const updateSupplier = asyncHandler(async (req, res) => {
    const { name, email, phone, address, company } = req.body;
    let supplier = await Supplier.findOne({ _id: req.params.id, userId: (req.user.tenantId || req.user._id) });
    
    if (!supplier) {
        res.status(404);
        throw new Error('Supplier not found');
    }

    supplier.name = name || supplier.name;
    supplier.email = email !== undefined ? email : supplier.email;
    supplier.phone = phone !== undefined ? phone : supplier.phone;
    supplier.address = address !== undefined ? address : supplier.address;
    supplier.company = company !== undefined ? company : supplier.company;

    await supplier.save();
    res.json(supplier);
});

const deleteSupplier = asyncHandler(async (req, res) => {
    const supplier = await Supplier.findOne({ _id: req.params.id, userId: (req.user.tenantId || req.user._id) });
    
    if (!supplier) {
        res.status(404);
        throw new Error('Supplier not found');
    }

    await Supplier.findByIdAndDelete(req.params.id);
    res.json({ message: 'Supplier removed' });
});

module.exports = {
    getSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier
};
