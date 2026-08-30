const Brand = require('./brand.model');
const asyncHandler = require('../../middlewares/asyncHandler');

// @desc    Get all brands for the tenant
// @route   GET /api/brands
// @access  Private
exports.getBrands = asyncHandler(async (req, res) => {
    const tenantId = req.user.tenantId || req.user._id;
    const brands = await Brand.find({ tenantId }).lean();
    
    // Map _id to id for frontend
    const mapped = brands.map(b => ({
        ...b,
        id: b._id,
        hasImage: !!b.image
    }));
    
    res.status(200).json(mapped);
});

// @desc    Create a new brand
// @route   POST /api/brands
// @access  Private (Admin/Manager)
exports.createBrand = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const tenantId = req.user.tenantId || req.user._id;

    const existing = await Brand.findOne({ name, tenantId });
    if (existing) {
        return res.status(400).json({ message: 'Brand already exists' });
    }

    const brandData = { name, tenantId };
    if (req.file) {
        brandData.image = req.file.filename;
    }

    const brand = await Brand.create(brandData);
    res.status(201).json(brand);
});

// @desc    Update a brand
// @route   PUT /api/brands/:id
// @access  Private (Admin/Manager)
exports.updateBrand = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const tenantId = req.user.tenantId || req.user._id;

    let brand = await Brand.findOne({ _id: req.params.id, tenantId });
    if (!brand) {
        return res.status(404).json({ message: 'Brand not found' });
    }

    if (name && name !== brand.name) {
        const existing = await Brand.findOne({ name, tenantId });
        if (existing) {
            return res.status(400).json({ message: 'Brand already exists' });
        }
        brand.name = name;
    }

    if (req.file) {
        brand.image = req.file.filename;
    }

    await brand.save();
    res.status(200).json(brand);
});

// @desc    Delete a brand
// @route   DELETE /api/brands/:id
// @access  Private (Admin/Manager)
exports.deleteBrand = asyncHandler(async (req, res) => {
    const tenantId = req.user.tenantId || req.user._id;

    const brand = await Brand.findOne({ _id: req.params.id, tenantId });
    if (!brand) {
        return res.status(404).json({ message: 'Brand not found' });
    }

    await Brand.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Brand removed' });
});
