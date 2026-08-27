const SaleReturn = require('./saleReturn.model');
const Product = require('../products/product.model');
const mongoose = require('mongoose');
const asyncHandler = require('../../middlewares/asyncHandler');

const addSaleReturn = asyncHandler(async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const body = req.body;
        
        // Create Sale Return
        const newSaleReturn = await SaleReturn.create([body], { session });

        // Update Inventory for each product (increase stock)
        if (body.products && Array.isArray(body.products)) {
            for (const item of body.products) {
                if (item._id) {
                    await Product.findByIdAndUpdate(
                        item._id,
                        { $inc: { currentStock: (Number(item.quantity) || 1) } },
                        { session }
                    );
                }
            }
        }

        await session.commitTransaction();
        session.endSession();
        return res.status(201).json({ msg: 'Sale return processed successfully', newSaleReturn: newSaleReturn[0] });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Sale return transaction failed: ", error);
        return res.status(500).json({ msg: 'Failed to process sale return', error: error.message });
    }
});

const showSaleReturns = asyncHandler(async (req, res) => {
    const showAllSaleReturns = await SaleReturn.find({});
    return res.status(200).json(showAllSaleReturns);
});

module.exports = {
    addSaleReturn,
    showSaleReturns,
};
