const mongoose = require('mongoose')

const addPurchase = new mongoose.Schema({
    warehouse: {
        type: String,
        required: true
    },
    supplier: {
        type: String
    },
    purchaseStatus: {
        type: String,
    },
    paymentStatus: {
        type: String
    },
    paymentMethod: {
        type: String
    },
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    },
    orderTax: {
        type: Number
    },
    discount: {
        type: Number,
    },
    shippingCost: {
        type: Number
    },
    note: {
        type: String
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        productName: String,
        productCode: String,
        alertQuantity: Number,
        productCost: Number,
        quantity: Number,
        discount: Number,
        tax: Number,
        subTotal: Number,
    }],
    total: {
        type: Number
    },
}, {
    timestamps: true
});

const Purchase = mongoose.model('Purchase', addPurchase)

module.exports = Purchase