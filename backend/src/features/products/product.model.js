const mongoose = require('mongoose')

const addProduct = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productType: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true,
    },
    productCode: {
        type: String,
        required: true,
        unique: true
    },
    barcode: {
        type: String,
        required: true
    },
    brand: {
        type: String,
    },
    category: {
        type: String,
        required: true,
    },
    productUnit: {
        type: String,
        required: true
    },
    saleUnit: {
        type: String,
    },
    purchaseUnit: {
        type: String,
        required: true
    },
    productCost: {
        type: Number,
        required: true
    },
    productPrice: {
        type: Number,
        required: true
    },
    alertQuantity: {
        type: Number,
    },
    currentStock: {
        type: Number,
        default: 0
    },
    productTax: {
        type: String,
        required: true,
    },
    taxMethod: {
        type: String,
    },
    description: {
        type: String
    },
    image: {
        type: String,
        default: ""
    },
    featured: { type: Boolean, default: false },
    hasWarehousePrice: { type: Boolean, default: false },
    warehousePrices: { type: Map, of: Number },
    hasVariant: { type: Boolean, default: false },
    variantList: { type: [String], default: [] },
    hasPromotion: { type: Boolean, default: false },
    promotionPrice: { type: Number },
    promotionStart: { type: Date },
    promotionEnd: { type: Date }
})



const Product = mongoose.model("Product", addProduct)

module.exports=Product;