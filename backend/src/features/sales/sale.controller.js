const Sale = require('./sale.model');
const Product = require('../products/product.model');
const Account = require('../accounts/account.model');
const mongoose = require('mongoose');
const asyncHandler = require('../../middlewares/asyncHandler');

const addSale = asyncHandler(async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const body = req.body;

        if (body.products && Array.isArray(body.products)) {
            const hasInvalidQuantity = body.products.some(p => Number(p.quantity) <= 0);
            if (hasInvalidQuantity) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ msg: 'Product quantities must be greater than zero' });
            }
        }
        
        // Create Sale
        const newSale = await Sale.create([body], { session });

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

        // Update Account Balance if paid
        if (body.paymentStatus === 'Paid' && body.accountId) {
            await Account.findByIdAndUpdate(
                body.accountId,
                { $inc: { currentBalance: (Number(body.totalAmount) || 0) } },
                { session }
            );
        }

        await session.commitTransaction();
        session.endSession();
        return res.status(201).json({ msg: 'added', newSale: newSale[0] });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Sale transaction failed: ", error);
        return res.status(500).json({ msg: 'Failed to process sale', error: error.message });
    }
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