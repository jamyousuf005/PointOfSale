const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    group: {
        type: String,
        default: 'Regular Customer'
    },
    name: {
        type: String,
        required: true
    },
    company: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String,
        required: true
    },
    tax: {
        type: String
    },
    address: {
        type: String
    },
    balance: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
