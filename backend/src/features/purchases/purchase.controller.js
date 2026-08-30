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
        const newPurchase = await Purchase.create([{ ...body, userId: (req.user.tenantId || req.user._id) }], { session });

        // Update Inventory for each product if received
        if (body.purchaseStatus === 'Received' && body.products && Array.isArray(body.products)) {
            for (const item of body.products) {
                const productId = item.productId || item._id; // fallback to _id if productId isn't passed
                if (productId) {
                    await Product.findOneAndUpdate(
                        { _id: productId, userId: (req.user.tenantId || req.user._id) },
                        { $inc: { currentStock: Number(item.quantity) || 0 } },
                        { session }
                    );
                }
            }
        }

        // Update Account Balance if paid (money leaving)
        if (body.paymentStatus === 'Paid' && body.accountId) {
            await Account.findOneAndUpdate(
                { _id: body.accountId, userId: (req.user.tenantId || req.user._id) },
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
    const showAllPurchases = await Purchase.find({ userId: (req.user.tenantId || req.user._id) });
    return res.json({ msg: 'here is response', showAllPurchases });
});

const deletePurchase = asyncHandler(async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const deleteById = req.params.id;
        const purchase = await Purchase.findOne({ _id: deleteById, userId: (req.user.tenantId || req.user._id) }).session(session);

        if (!purchase) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ msg: "Purchase not found" });
        }

        // Reverse stock if it was received
        if (purchase.purchaseStatus === 'Received' && purchase.products && Array.isArray(purchase.products)) {
            for (const item of purchase.products) {
                const productId = item.productId || item._id;
                if (productId) {
                    await Product.findOneAndUpdate(
                        { _id: productId, userId: (req.user.tenantId || req.user._id) },
                        { $inc: { currentStock: -(Number(item.quantity) || 0) } },
                        { session }
                    );
                }
            }
        }

        // Reverse account balance if it was paid
        if (purchase.paymentStatus === 'Paid' && purchase.accountId) {
            await Account.findOneAndUpdate(
                { _id: purchase.accountId, userId: (req.user.tenantId || req.user._id) },
                { $inc: { currentBalance: (Number(purchase.total) || 0) } },
                { session }
            );
        }

        await Purchase.findOneAndDelete({ _id: deleteById, userId: (req.user.tenantId || req.user._id) }).session(session);

        await session.commitTransaction();
        session.endSession();
        return res.json({ msg: "purchase deleted" });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Purchase delete failed: ", error);
        return res.status(500).json({ msg: 'Failed to process purchase deletion', error: error.message });
    }
});

const editPuchase = asyncHandler(async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const id = req.params.id;
        const newBody = req.body;
        
        const oldPurchase = await Purchase.findOne({ _id: id, userId: (req.user.tenantId || req.user._id) }).session(session);
        if (!oldPurchase) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ msg: "Purchase not found" });
        }

        // Handle Inventory changes
        // Step 1: Revert old inventory if it was Received
        if (oldPurchase.purchaseStatus === 'Received' && oldPurchase.products) {
            for (const item of oldPurchase.products) {
                const productId = item.productId || item._id;
                if (productId) {
                    await Product.findOneAndUpdate(
                        { _id: productId, userId: (req.user.tenantId || req.user._id) },
                        { $inc: { currentStock: -(Number(item.quantity) || 0) } },
                        { session }
                    );
                }
            }
        }

        // Step 2: Apply new inventory if it is Received
        if (newBody.purchaseStatus === 'Received' && newBody.products) {
            for (const item of newBody.products) {
                const productId = item.productId || item._id;
                if (productId) {
                    await Product.findByIdAndUpdate(
                        productId,
                        { $inc: { currentStock: Number(item.quantity) || 0 } },
                        { session }
                    );
                }
            }
        }

        // Handle Financial changes (Account balance)
        // Step 1: Revert old balance if it was Paid
        if (oldPurchase.paymentStatus === 'Paid' && oldPurchase.accountId) {
            await Account.findOneAndUpdate(
                { _id: oldPurchase.accountId, userId: (req.user.tenantId || req.user._id) },
                { $inc: { currentBalance: (Number(oldPurchase.total) || 0) } },
                { session }
            );
        }

        // Step 2: Apply new balance if it is Paid
        if (newBody.paymentStatus === 'Paid' && newBody.accountId) {
            await Account.findByIdAndUpdate(
                newBody.accountId,
                { $inc: { currentBalance: -(Number(newBody.total) || 0) } },
                { session }
            );
        }

        // Finally, update the document
        const updatedPurchase = await Purchase.findOneAndUpdate({ _id: id, userId: (req.user.tenantId || req.user._id) }, newBody, { new: true, session });

        await session.commitTransaction();
        session.endSession();
        return res.json({ msg: 'updated the purchase', updatedPurchase });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Purchase edit failed: ", error);
        return res.status(500).json({ msg: 'Failed to edit purchase', error: error.message });
    }
});

const showOnePurchase = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const purchase = await Purchase.findOne({ _id: id, userId: (req.user.tenantId || req.user._id) });
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