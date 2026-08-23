const Purchase = require('./purchase.model');
const asyncHandler = require('../../middlewares/asyncHandler');

const addPurchase = asyncHandler(async (req, res) => {
    const body = req.body;
    const newPurchase = await Purchase.create(body);
    return res.status(201).json({ msg: 'Purchase made successfully', newPurchase });
});

const showPurchase = asyncHandler(async (req, res) => {
    const showAllPurchases = await Purchase.find({});
    return res.json({ msg: 'here is response', showAllPurchases });
});

const deletePurchase = asyncHandler(async (req, res) => {
    const deleteById = req.params.id;
    await Purchase.findByIdAndDelete(deleteById);
    return res.json({ msg: "purchase deleted" });
});

const editPuchase = asyncHandler(async (req, res) => {
    const id = req.params.id;
    await Purchase.findByIdAndUpdate(id, req.body, { new: true });
    return res.json({ msg: 'updated the purchase' });
});

const showOnePurchase = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const purchase = await Purchase.findById(id);
    if (!purchase) {
        res.status(404);
        throw new Error('Purchase not found');
    }
    return res.json(purchase);
});

module.exports = {
    addPurchase,
    showPurchase,
    deletePurchase,
    editPuchase,
    showOnePurchase
};