const mongoose = require('mongoose');

const moneyTransferSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    referenceNo: {
        type: String,
        required: true
    },
    fromAccount: {
        type: String,
        required: true
    },
    toAccount: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    action: {
        type: String,
        default: 'Completed'
    }
}, { timestamps: true });

const MoneyTransfer = mongoose.model('MoneyTransfer', moneyTransferSchema);

module.exports = MoneyTransfer;
