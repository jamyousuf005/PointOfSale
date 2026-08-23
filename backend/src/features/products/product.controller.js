const Product = require('./product.model');
const asyncHandler = require('../../middlewares/asyncHandler');

const addProducts = asyncHandler(async (req, res) => {
    const newProduct = await Product.create(req.body);
    return res.status(201).json({ msg: "product added", newProduct });
});

const deleteProduct = asyncHandler(async (req, res) => {
    const deleteById = req.params.id;
    await Product.findByIdAndDelete(deleteById);
    return res.json({ msg: "product deleted" });
});

const editProduct = asyncHandler(async (req, res) => {
    const editById = req.params.id;
    const edited = await Product.findByIdAndUpdate(editById, req.body, { new: true });
    return res.json({ msg: "product being updated", edited });
});

const showProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});
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