const mongoose = require('mongoose');

const purchaseReturnSchema = new mongoose.Schema({
    originalPurchaseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Purchase',
        required: true
    },
    supplier: {
        type: String,
    },
    products: [{
        productName: String,
        productCode: String,
        quantity: Number,
        productCost: Number,
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

module.exports = mongoose.model('PurchaseReturn', purchaseReturnSchema);
