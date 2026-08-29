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
        // Only if saleStatus is 'Completed'
        if (body.saleStatus === 'Completed' && body.products && Array.isArray(body.products)) {
            for (const item of body.products) {
                const productId = item.productId || item._id; // fallback to _id if productId isn't passed
                if (productId) {
                    await Product.findByIdAndUpdate(
                        productId,
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
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const id = req.params.id;
        const sale = await Sale.findById(id).session(session);

        if (!sale) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ msg: "Sale not found" });
        }

        // Reverse stock if it was completed (add stock back)
        if (sale.saleStatus === 'Completed' && sale.products && Array.isArray(sale.products)) {
            for (const item of sale.products) {
                const productId = item.productId || item._id;
                if (productId) {
                    await Product.findByIdAndUpdate(
                        productId,
                        { $inc: { currentStock: (Number(item.quantity) || 1) } },
                        { session }
                    );
                }
            }
        }

        // Reverse account balance if it was paid (deduct money)
        if (sale.paymentStatus === 'Paid' && sale.accountId) {
            await Account.findByIdAndUpdate(
                sale.accountId,
                { $inc: { currentBalance: -(Number(sale.totalAmount) || 0) } },
                { session }
            );
        }

        await Sale.findByIdAndDelete(id).session(session);

        await session.commitTransaction();
        session.endSession();
        return res.json({ msg: 'deleted' });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Sale delete failed: ", error);
        return res.status(500).json({ msg: 'Failed to process sale deletion', error: error.message });
    }
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
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const id = req.params.id;
        const newBody = req.body;
        
        const oldSale = await Sale.findById(id).session(session);
        if (!oldSale) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ msg: "Sale not found" });
        }

        // Step 1: Revert old inventory if it was Completed
        if (oldSale.saleStatus === 'Completed' && oldSale.products) {
            for (const item of oldSale.products) {
                const productId = item.productId || item._id;
                if (productId) {
                    await Product.findByIdAndUpdate(
                        productId,
                        { $inc: { currentStock: (Number(item.quantity) || 1) } },
                        { session }
                    );
                }
            }
        }

        // Step 2: Apply new inventory if it is Completed
        if (newBody.saleStatus === 'Completed' && newBody.products) {
            for (const item of newBody.products) {
                const productId = item.productId || item._id;
                if (productId) {
                    await Product.findByIdAndUpdate(
                        productId,
                        { $inc: { currentStock: -(Number(item.quantity) || 1) } },
                        { session }
                    );
                }
            }
        }

        // Step 1: Revert old balance if it was Paid
        if (oldSale.paymentStatus === 'Paid' && oldSale.accountId) {
            await Account.findByIdAndUpdate(
                oldSale.accountId,
                { $inc: { currentBalance: -(Number(oldSale.totalAmount) || 0) } },
                { session }
            );
        }

        // Step 2: Apply new balance if it is Paid
        if (newBody.paymentStatus === 'Paid' && newBody.accountId) {
            await Account.findByIdAndUpdate(
                newBody.accountId,
                { $inc: { currentBalance: (Number(newBody.totalAmount) || 0) } },
                { session }
            );
        }

        const updatedSale = await Sale.findByIdAndUpdate(id, newBody, { new: true, session });

        await session.commitTransaction();
        session.endSession();
        return res.json({ msg: "updated the sale", updatedSale });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Sale edit failed: ", error);
        return res.status(500).json({ msg: 'Failed to edit sale', error: error.message });
    }
});

module.exports = {
    addSale,
    showSales,
    deleteSale,
    showOne,
    editSale
};