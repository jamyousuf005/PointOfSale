const MoneyTransfer = require('./moneyTransfer.model');
const asyncHandler = require('../../middlewares/asyncHandler');

const addMoneyTransfer = asyncHandler(async (req, res) => {
    const { fromAccount, toAccount, amount } = req.body;
    
    // Generate a simple reference no
    const referenceNo = 'mt-' + Date.now();

    const newTransfer = await MoneyTransfer.create({
        fromAccount,
        toAccount,
        amount,
        referenceNo
    });

    return res.status(201).json({ msg: 'Money transfer recorded successfully', newTransfer });
});

const showAllTransfers = asyncHandler(async (req, res) => {
    const transfers = await MoneyTransfer.find({}).sort({ createdAt: -1 });
    return res.json(transfers);
});

module.exports = {
    addMoneyTransfer,
    showAllTransfers
};
