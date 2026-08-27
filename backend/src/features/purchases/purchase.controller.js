const Purchase = require('./purchase.model');
const Product = require('../products/product.model');
const Account = require('../accounts/account.model');
const mongoose = require('mongoose');
const asyncHandler = require('../../middlewares/asyncHandler');

const addPurchase = asyncHandler(async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const body = req.body;
        
        // Create Purchase
        const newPurchase = await Purchase.create([body], { session });

        // Update Inventory for each product
        if (body.products && Array.isArray(body.products)) {
            for (const item of body.products) {
                if (item._id) {
                    await Product.findByIdAndUpdate(
                        item._id,
                        { $inc: { currentStock: Number(item.quantity) || 1 } },
                        { session }
                    );
                }
            }
        }

        // Update Account Balance if paid (money leaving)
        if (body.paymentStatus === 'Paid' && body.accountId) {
            await Account.findByIdAndUpdate(
                body.accountId,
                { $inc: { currentBalance: -(Number(body.total) || 0) } },
                { session }
            );
        }

        await session.commitTransaction();
        session.endSession();
        return res.status(201).json({ msg: 'Purchase made successfully', newPurchase: newPurchase[0] });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Purchase transaction failed: ", error);
        return res.status(500).json({ msg: 'Failed to process purchase', error: error.message });
    }
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