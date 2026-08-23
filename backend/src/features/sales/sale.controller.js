const Sale = require('./sale.model');
const asyncHandler = require('../../middlewares/asyncHandler');

const addSale = asyncHandler(async (req, res) => {
    const body = req.body;
    const newSale = await Sale.create(body);
    return res.status(201).json({ msg: 'added', newSale });
});

const showSales = asyncHandler(async (req, res) => {
    const ShowAllSales = await Sale.find({});
    return res.status(200).json(ShowAllSales);
});

const deleteSale = asyncHandler(async (req, res) => {
    const id = req.params.id;
    await Sale.findByIdAndDelete(id);
    return res.json({ msg: 'deleted' });
});

const showOne = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const productWithId = await Sale.findById(id);
    if (!productWithId) {
        res.status(404);
        throw new Error('Sale not found');
    }
    return res.json(productWithId);
});

const editSale = asyncHandler(async (req, res) => {
    const id = req.params.id;
    await Sale.findByIdAndUpdate(id, req.body, { new: true });
    return res.json({ msg: "updated the sale" });
});

module.exports = {
    addSale,
    showSales,
    deleteSale,
    showOne,
    editSale
};