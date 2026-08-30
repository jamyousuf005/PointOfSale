const SaleReturn = require('./saleReturn.model');
const Product = require('../products/product.model');
const Account = require('../accounts/account.model');
const Sale = require('../sales/sale.model');
const InventoryMovement = require('../inventory/inventoryMovement.model');
const mongoose = require('mongoose');
const asyncHandler = require('../../middlewares/asyncHandler');

const addSaleReturn = asyncHandler(async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const body = req.body;
        
        // Create Sale Return
        const newSaleReturn = await SaleReturn.create([{ ...body, userId: (req.user.tenantId || req.user._id) }], { session });

        // Retrieve original sale to validate
        let originalSale = null;
        if (body.saleId) {
            originalSale = await Sale.findById(body.saleId).session(session);
        }

        // Update Inventory for each product (increase stock)
        if (body.products && Array.isArray(body.products)) {
            for (const item of body.products) {
                const productId = item.productId || item._id;
                const returnQty = Number(item.quantity) || 1;

                if (originalSale) {
                    const soldItem = originalSale.products.find(p => p.productId.toString() === productId.toString());
                    if (!soldItem || soldItem.quantity < returnQty) {
                        throw new Error(`Cannot return quantity ${returnQty} for product ${productId}, exceeds originally sold quantity or product not in sale.`);
                    }
                }

                if (productId) {
                    await Product.findOneAndUpdate(
                        { _id: productId, userId: (req.user.tenantId || req.user._id) },
                        { $inc: { currentStock: returnQty } },
                        { session }
                    );

                    await InventoryMovement.create([{
                        userId: (req.user.tenantId || req.user._id),
                        productId: productId,
                        type: 'SALE_RETURN',
                        quantity: returnQty,
                        referenceId: newSaleReturn[0]._id,
                        notes: 'Sale return processed'
                    }], { session });
                }
            }
        }

        // Deduct money from Account (Refund)
        // Ensure you pass accountId from frontend when making a return
        if (body.accountId) {
            await Account.findOneAndUpdate(
                { _id: body.accountId, userId: (req.user.tenantId || req.user._id) },
                { $inc: { currentBalance: -(Number(body.totalRefundAmount) || 0) } },
                { session }
            );
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
    const showAllSaleReturns = await SaleReturn.find({ userId: (req.user.tenantId || req.user._id) });
    return res.status(200).json(showAllSaleReturns);
});

module.exports = {
    addSaleReturn,
    showSaleReturns,
};
