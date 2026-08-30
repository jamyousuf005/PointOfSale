const Tax = require('./tax.model');
const asyncHandler = require('../../middlewares/asyncHandler');

// @desc    Get all taxes for the tenant
// @route   GET /api/taxes
// @access  Private
exports.getTaxes = asyncHandler(async (req, res) => {
    const tenantId = req.user.tenantId || req.user._id;
    const taxes = await Tax.find({ tenantId }).lean();
    
    const mapped = taxes.map(t => ({
        ...t,
        id: t._id
    }));

    res.status(200).json(mapped);
});

// @desc    Create a new tax
// @route   POST /api/taxes
// @access  Private (Admin/Manager)
exports.createTax = asyncHandler(async (req, res) => {
    const { name, rate } = req.body;
    const tenantId = req.user.tenantId || req.user._id;

    const existing = await Tax.findOne({ name, tenantId });
    if (existing) {
        return res.status(400).json({ message: 'Tax with this name already exists' });
    }

    const tax = await Tax.create({ name, rate, tenantId });
    res.status(201).json(tax);
});

// @desc    Update a tax
// @route   PUT /api/taxes/:id
// @access  Private (Admin/Manager)
exports.updateTax = asyncHandler(async (req, res) => {
    const { name, rate } = req.body;
    const tenantId = req.user.tenantId || req.user._id;

    let tax = await Tax.findOne({ _id: req.params.id, tenantId });
    if (!tax) {
        return res.status(404).json({ message: 'Tax not found' });
    }

    if (name && name !== tax.name) {
        const existing = await Tax.findOne({ name, tenantId });
        if (existing) {
            return res.status(400).json({ message: 'Tax with this name already exists' });
        }
    }

    tax.name = name || tax.name;
    tax.rate = rate !== undefined ? rate : tax.rate;

    await tax.save();
    res.status(200).json(tax);
});

// @desc    Delete a tax
// @route   DELETE /api/taxes/:id
// @access  Private (Admin/Manager)
exports.deleteTax = asyncHandler(async (req, res) => {
    const tenantId = req.user.tenantId || req.user._id;

    const tax = await Tax.findOne({ _id: req.params.id, tenantId });
    if (!tax) {
        return res.status(404).json({ message: 'Tax not found' });
    }

    await Tax.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Tax removed' });
});
