const mongoose = require('mongoose');

const saleReturnSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    originalSaleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sale',
        required: true
    },
    customer: {
        type: String,
    },
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        productName: String,
        productCode: String,
        quantity: Number,
        productPrice: Number,
        subTotal: Number,
        _id: mongoose.Schema.Types.ObjectId
    }],
    totalRefundAmount: {
        type: Number,
        required: true
    },
    reason: {
        type: String
    },
    status: {
        type: String,
        default: 'Completed'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('SaleReturn', saleReturnSchema);
