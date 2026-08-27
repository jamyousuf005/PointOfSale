const mongoose = require('mongoose');

const saleReturnSchema = new mongoose.Schema({
    originalSaleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sale',
        required: true
    },
    customer: {
        type: String,
    },
    products: [{
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
