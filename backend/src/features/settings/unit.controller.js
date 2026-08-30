const Unit = require('./unit.model');
const asyncHandler = require('../../middlewares/asyncHandler');

// @desc    Get all units for the tenant
// @route   GET /api/units
// @access  Private (Admin/Manager)
exports.getUnits = asyncHandler(async (req, res) => {
    const tenantId = req.user.tenantId || req.user._id;
    const units = await Unit.find({ tenantId });
    res.status(200).json(units);
});

// @desc    Create a new unit
// @route   POST /api/units
// @access  Private (Admin/Manager)
exports.createUnit = asyncHandler(async (req, res) => {
    const { code, name, baseUnit, operator, operationValue } = req.body;
    const tenantId = req.user.tenantId || req.user._id;

    const existing = await Unit.findOne({ code, tenantId });
    if (existing) {
        return res.status(400).json({ message: 'Unit with this code already exists' });
    }

    const unit = await Unit.create({
        code,
        name,
        baseUnit,
        operator,
        operationValue,
        tenantId
    });

    res.status(201).json(unit);
});

// @desc    Update a unit
// @route   PUT /api/units/:id
// @access  Private (Admin/Manager)
exports.updateUnit = asyncHandler(async (req, res) => {
    const { code, name, baseUnit, operator, operationValue } = req.body;
    const tenantId = req.user.tenantId || req.user._id;

    let unit = await Unit.findOne({ _id: req.params.id, tenantId });
    if (!unit) {
        return res.status(404).json({ message: 'Unit not found' });
    }

    if (code && code !== unit.code) {
        const existing = await Unit.findOne({ code, tenantId });
        if (existing) {
            return res.status(400).json({ message: 'Unit with this code already exists' });
        }
    }

    unit.code = code || unit.code;
    unit.name = name || unit.name;
    unit.baseUnit = baseUnit || unit.baseUnit;
    unit.operator = operator || unit.operator;
    unit.operationValue = operationValue || unit.operationValue;

    await unit.save();
    res.status(200).json(unit);
});

// @desc    Delete a unit
// @route   DELETE /api/units/:id
// @access  Private (Admin/Manager)
exports.deleteUnit = asyncHandler(async (req, res) => {
    const tenantId = req.user.tenantId || req.user._id;

    const unit = await Unit.findOne({ _id: req.params.id, tenantId });
    if (!unit) {
        return res.status(404).json({ message: 'Unit not found' });
    }

    await Unit.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Unit removed' });
});
