const PurchaseReturn = require('./purchaseReturn.model');
const Product = require('../products/product.model');
const mongoose = require('mongoose');
const asyncHandler = require('../../middlewares/asyncHandler');

const addPurchaseReturn = asyncHandler(async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const body = req.body;
        
        // Create Purchase Return
        const newPurchaseReturn = await PurchaseReturn.create([body], { session });

        // Update Inventory for each product (decrease stock)
        if (body.products && Array.isArray(body.products)) {
            for (const item of body.products) {
                if (item._id) {
                    await Product.findByIdAndUpdate(
                        item._id,
                        { $inc: { currentStock: -(Number(item.quantity) || 1) } },
                        { session }
                    );
                }
            }
        }

        await session.commitTransaction();
        session.endSession();
        return res.status(201).json({ msg: 'Purchase return processed successfully', newPurchaseReturn: newPurchaseReturn[0] });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Purchase return transaction failed: ", error);
        return res.status(500).json({ msg: 'Failed to process purchase return', error: error.message });
    }
});

const showPurchaseReturns = asyncHandler(async (req, res) => {
    const showAllPurchaseReturns = await PurchaseReturn.find({});
    return res.status(200).json(showAllPurchaseReturns);
});

module.exports = {
    addPurchaseReturn,
    showPurchaseReturns,
};
