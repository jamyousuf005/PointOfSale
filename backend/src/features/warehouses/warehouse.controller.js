const Warehouse = require('./warehouse.model');
const asyncHandler = require('../../middlewares/asyncHandler');

const getWarehouses = asyncHandler(async (req, res) => {
    const warehouses = await Warehouse.find({}).sort({ createdAt: -1 });
    res.json(warehouses);
});

const createWarehouse = asyncHandler(async (req, res) => {
    const { name, email, phone, address } = req.body;
    const warehouseExists = await Warehouse.findOne({ name });
    
    if (warehouseExists) {
        res.status(400);
        throw new Error('Warehouse already exists');
    }

    const warehouse = await Warehouse.create({
        name,
        email,
        phone,
        address
    });

    res.status(201).json(warehouse);
});

module.exports = {
    getWarehouses,
    createWarehouse
};
