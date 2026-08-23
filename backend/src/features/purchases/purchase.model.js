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
        productName: String,
        productCode: String,
        alertQuantity: Number,
        productCost: Number,
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