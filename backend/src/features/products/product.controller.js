const Product = require('./product.model');
const asyncHandler = require('../../middlewares/asyncHandler');

const parseProductData = (req) => {
    const data = { ...req.body };
    if (req.file) {
        data.image = req.file.filename;
    }
    if (typeof data.productCost === 'string' && data.productCost !== '') data.productCost = Number(data.productCost);
    if (typeof data.productPrice === 'string' && data.productPrice !== '') data.productPrice = Number(data.productPrice);
    if (typeof data.alertQuantity === 'string' && data.alertQuantity !== '') data.alertQuantity = Number(data.alertQuantity);
    if (typeof data.featured === 'string') data.featured = data.featured === 'true';
    if (typeof data.hasWarehousePrice === 'string') data.hasWarehousePrice = data.hasWarehousePrice === 'true';
    if (typeof data.hasVariant === 'string') data.hasVariant = data.hasVariant === 'true';
    if (typeof data.hasPromotion === 'string') data.hasPromotion = data.hasPromotion === 'true';
    if (typeof data.promotionPrice === 'string' && data.promotionPrice !== '') data.promotionPrice = Number(data.promotionPrice);

    if (typeof data.warehousePrices === 'string') {
        try { data.warehousePrices = JSON.parse(data.warehousePrices); } catch(e){}
    }
    if (typeof data.variantList === 'string') {
        try { data.variantList = JSON.parse(data.variantList); } catch(e){}
    }
    return data;
};

const addProducts = asyncHandler(async (req, res) => {
    const productData = parseProductData(req);
    const newProduct = await Product.create(productData);
    return res.status(201).json({ msg: "product added", newProduct });
});

const deleteProduct = asyncHandler(async (req, res) => {
    const deleteById = req.params.id;
    await Product.findByIdAndDelete(deleteById);
    return res.json({ msg: "product deleted" });
});

const editProduct = asyncHandler(async (req, res) => {
    const editById = req.params.id;
    const productData = parseProductData(req);
    const edited = await Product.findByIdAndUpdate(editById, productData, { new: true });
    return res.json({ msg: "product being updated", edited });
});

const showProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({ createdAt: -1 });
    return res.status(200).json(products);
});

const showOneProduct = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }
    return res.json(product);
});

module.exports = {
    addProducts,
    showProducts,
    deleteProduct,
    editProduct,
    showOneProduct
};