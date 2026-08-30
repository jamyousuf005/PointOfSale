const Sale = require('./sale.model');
const Product = require('../products/product.model');
const Account = require('../accounts/account.model');
const Customer = require('../customers/customer.model');
const InventoryMovement = require('../inventory/inventoryMovement.model');
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
        const newSale = await Sale.create([{ ...body, userId: (req.user.tenantId || req.user._id) }], { session });

        // Update Inventory for each product (decrease stock)
        // Only if saleStatus is 'Completed'
        if (body.saleStatus === 'Completed' && body.products && Array.isArray(body.products)) {
            for (const item of body.products) {
                const productId = item.productId || item._id; // fallback to _id if productId isn't passed
                if (productId) {
                    const qty = Number(item.quantity) || 1;
                    await Product.findOneAndUpdate(
                        { _id: productId, userId: (req.user.tenantId || req.user._id) },
                        { $inc: { currentStock: -qty } },
                        { session }
                    );

                    await InventoryMovement.create([{
                        userId: (req.user.tenantId || req.user._id),
                        productId: productId,
                        type: 'SALE',
                        quantity: -qty,
                        referenceId: newSale[0]._id,
                        notes: 'Sale created'
                    }], { session });
                }
            }
        }

        // Update Account Balance if paid
        if (body.paymentStatus === 'Paid' && body.accountId) {
            await Account.findOneAndUpdate(
                { _id: body.accountId, userId: (req.user.tenantId || req.user._id) },
                { $inc: { currentBalance: (Number(body.totalAmount) || 0) } },
                { session }
            );
        } else if (body.paymentStatus !== 'Paid' && body.customer) {
            // Update Customer Balance if not paid
            await Customer.findOneAndUpdate(
                { name: body.customer, userId: (req.user.tenantId || req.user._id) },
                { $inc: { balance: (Number(body.totalAmount) || 0) } },
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
    const ShowAllSales = await Sale.find({ userId: (req.user.tenantId || req.user._id) });
    return res.status(200).json(ShowAllSales);
});

const deleteSale = asyncHandler(async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const id = req.params.id;
        const sale = await Sale.findOne({ _id: id, userId: (req.user.tenantId || req.user._id) }).session(session);

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
                    const qty = Number(item.quantity) || 1;
                    await Product.findOneAndUpdate(
                        { _id: productId, userId: (req.user.tenantId || req.user._id) },
                        { $inc: { currentStock: qty } },
                        { session }
                    );

                    await InventoryMovement.create([{
                        userId: (req.user.tenantId || req.user._id),
                        productId: productId,
                        type: 'ADJUSTMENT',
                        quantity: qty,
                        referenceId: sale._id,
                        notes: 'Sale deleted (reverted)'
                    }], { session });
                }
            }
        }

        // Reverse account balance if it was paid (deduct money)
        if (sale.paymentStatus === 'Paid' && sale.accountId) {
            await Account.findOneAndUpdate(
                { _id: sale.accountId, userId: (req.user.tenantId || req.user._id) },
                { $inc: { currentBalance: -(Number(sale.totalAmount) || 0) } },
                { session }
            );
        } else if (sale.paymentStatus !== 'Paid' && sale.customer) {
            // Reverse customer balance if it was not paid (deduct money)
            await Customer.findOneAndUpdate(
                { name: sale.customer, userId: (req.user.tenantId || req.user._id) },
                { $inc: { balance: -(Number(sale.totalAmount) || 0) } },
                { session }
            );
        }

        await Sale.findOneAndDelete({ _id: id, userId: (req.user.tenantId || req.user._id) }).session(session);

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
    const productWithId = await Sale.findOne({ _id: id, userId: (req.user.tenantId || req.user._id) });
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
        
        const oldSale = await Sale.findOne({ _id: id, userId: (req.user.tenantId || req.user._id) }).session(session);
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
                    const qty = Number(item.quantity) || 1;
                    await Product.findOneAndUpdate(
                        { _id: productId, userId: (req.user.tenantId || req.user._id) },
                        { $inc: { currentStock: qty } },
                        { session }
                    );
                    
                    await InventoryMovement.create([{
                        userId: (req.user.tenantId || req.user._id),
                        productId: productId,
                        type: 'ADJUSTMENT',
                        quantity: qty,
                        referenceId: oldSale._id,
                        notes: 'Sale edited (reverted old stock)'
                    }], { session });
                }
            }
        }

        // Step 2: Apply new inventory if it is Completed
        if (newBody.saleStatus === 'Completed' && newBody.products) {
            for (const item of newBody.products) {
                const productId = item.productId || item._id;
                if (productId) {
                    const qty = Number(item.quantity) || 1;
                    await Product.findOneAndUpdate(
                        { _id: productId, userId: (req.user.tenantId || req.user._id) },
                        { $inc: { currentStock: -qty } },
                        { session }
                    );

                    await InventoryMovement.create([{
                        userId: (req.user.tenantId || req.user._id),
                        productId: productId,
                        type: 'SALE',
                        quantity: -qty,
                        referenceId: id, // The sale ID
                        notes: 'Sale edited (applied new stock)'
                    }], { session });
                }
            }
        }

        // Step 1: Revert old balance if it was Paid
        if (oldSale.paymentStatus === 'Paid' && oldSale.accountId) {
            await Account.findOneAndUpdate(
                { _id: oldSale.accountId, userId: (req.user.tenantId || req.user._id) },
                { $inc: { currentBalance: -(Number(oldSale.totalAmount) || 0) } },
                { session }
            );
        } else if (oldSale.paymentStatus !== 'Paid' && oldSale.customer) {
            // Revert customer balance
            await Customer.findOneAndUpdate(
                { name: oldSale.customer, userId: (req.user.tenantId || req.user._id) },
                { $inc: { balance: -(Number(oldSale.totalAmount) || 0) } },
                { session }
            );
        }

        // Step 2: Apply new balance if it is Paid
        if (newBody.paymentStatus === 'Paid' && newBody.accountId) {
            await Account.findOneAndUpdate(
                { _id: newBody.accountId, userId: (req.user.tenantId || req.user._id) },
                { $inc: { currentBalance: (Number(newBody.totalAmount) || 0) } },
                { session }
            );
        } else if (newBody.paymentStatus !== 'Paid' && newBody.customer) {
            // Apply new customer balance
            await Customer.findOneAndUpdate(
                { name: newBody.customer, userId: (req.user.tenantId || req.user._id) },
                { $inc: { balance: (Number(newBody.totalAmount) || 0) } },
                { session }
            );
        }

        const updatedSale = await Sale.findOneAndUpdate({ _id: id, userId: (req.user.tenantId || req.user._id) }, newBody, { new: true, session });

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