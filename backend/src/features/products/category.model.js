const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
        unique: true
    },
    parentCategory: {
        type: String,
        default: 'N/A'
    },
    image: {
        type: String,
        default: ""
    },
    productCount: {
        type: Number,
        default: 0
    },
    stockQty: {
        type: Number,
        default: 0
    },
    stockWorthPrice: {
        type: Number,
        default: 0
    },
    stockWorthCost: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
