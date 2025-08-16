const mongoose = require('mongoose')

const addProduct = new mongoose.Schema({
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
        required: true
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
    excelCommunication: { type: Number },
    hasVariant: { type: String },
    promotionalPrice: { type: Number }
})



const Product = mongoose.model("Product", addProduct)

module.exports=Product;