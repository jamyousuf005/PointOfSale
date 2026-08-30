const Warehouse = require('./warehouse.model');
const asyncHandler = require('../../middlewares/asyncHandler');

const getWarehouses = asyncHandler(async (req, res) => {
    const warehouses = await Warehouse.find({ userId: (req.user.tenantId || req.user._id) }).sort({ createdAt: -1 });
    res.json(warehouses);
});

const createWarehouse = asyncHandler(async (req, res) => {
    const { name, email, phone, address } = req.body;
    const warehouseExists = await Warehouse.findOne({ name, userId: (req.user.tenantId || req.user._id) });
    
    if (warehouseExists) {
        res.status(400);
        throw new Error('Warehouse already exists');
    }

    const warehouse = await Warehouse.create({
        name,
        email,
        phone,
        address,
        userId: (req.user.tenantId || req.user._id)
    });

    res.status(201).json(warehouse);
});

const updateWarehouse = asyncHandler(async (req, res) => {
    const { name, email, phone, address } = req.body;
    let warehouse = await Warehouse.findOne({ _id: req.params.id, userId: (req.user.tenantId || req.user._id) });
    if (!warehouse) {
        res.status(404);
        throw new Error('Warehouse not found');
    }
    warehouse.name = name || warehouse.name;
    warehouse.email = email || warehouse.email;
    warehouse.phone = phone || warehouse.phone;
    warehouse.address = address || warehouse.address;
    await warehouse.save();
    res.json(warehouse);
});

const deleteWarehouse = asyncHandler(async (req, res) => {
    const warehouse = await Warehouse.findOne({ _id: req.params.id, userId: (req.user.tenantId || req.user._id) });
    if (!warehouse) {
        res.status(404);
        throw new Error('Warehouse not found');
    }
    await Warehouse.findByIdAndDelete(req.params.id);
    res.json({ message: 'Warehouse removed' });
});

module.exports = {
    getWarehouses,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse
};
