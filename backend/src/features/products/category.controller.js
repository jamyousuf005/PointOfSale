const Category = require('./category.model');
const Product = require('./product.model');
const asyncHandler = require('../../middlewares/asyncHandler');

const parseCategoryData = (req) => {
    const data = { ...req.body };
    if (req.file) {
        data.image = req.file.filename;
    }
    if (typeof data.productCount === 'string' && data.productCount !== '') data.productCount = Number(data.productCount);
    if (typeof data.stockQty === 'string' && data.stockQty !== '') data.stockQty = Number(data.stockQty);
    if (typeof data.stockWorthPrice === 'string' && data.stockWorthPrice !== '') data.stockWorthPrice = Number(data.stockWorthPrice);
    if (typeof data.stockWorthCost === 'string' && data.stockWorthCost !== '') data.stockWorthCost = Number(data.stockWorthCost);
    return data;
};

const addCategory = asyncHandler(async (req, res) => {
    const categoryData = parseCategoryData(req);
    const newCategory = await Category.create({ ...categoryData, userId: (req.user.tenantId || req.user._id) });
    return res.status(201).json({ msg: "category added", newCategory });
});

const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({ userId: (req.user.tenantId || req.user._id) }).sort({ createdAt: -1 }).lean();
    
    const mappedCategories = categories.map(cat => ({
        ...cat,
        id: cat._id // For frontend compatibility
    }));

    return res.status(200).json(mappedCategories);
});

const updateCategory = asyncHandler(async (req, res) => {
    const editById = req.params.id;
    const categoryData = parseCategoryData(req);
    
    const category = await Category.findOne({ _id: editById, userId: (req.user.tenantId || req.user._id) });
    if (!category) {
        res.status(404);
        throw new Error('Category not found');
    }

    // If the category name is changing, we should probably update all products that use this category name
    if (categoryData.categoryName && categoryData.categoryName !== category.categoryName) {
        await Product.updateMany(
            { category: category.categoryName, userId: (req.user.tenantId || req.user._id) },
            { $set: { category: categoryData.categoryName } }
        );
    }

    const edited = await Category.findOneAndUpdate({ _id: editById, userId: (req.user.tenantId || req.user._id) }, categoryData, { new: true });
    return res.json({ msg: "category updated", edited });
});

const deleteCategory = asyncHandler(async (req, res) => {
    const deleteById = req.params.id;
    
    const category = await Category.findOne({ _id: deleteById, userId: (req.user.tenantId || req.user._id) });
    if (!category) {
        res.status(404);
        throw new Error('Category not found');
    }

    await Category.findOneAndDelete({ _id: deleteById, userId: (req.user.tenantId || req.user._id) });
    return res.json({ msg: "category deleted" });
});

module.exports = {
    addCategory,
    getCategories,
    updateCategory,
    deleteCategory
};
