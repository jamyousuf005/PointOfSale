const express = require('express');
const { addMoneyTransfer, showAllTransfers } = require('./moneyTransfer.controller');
const auth = require('../../middlewares/auth');

const moneyTransferRouter = express.Router();

moneyTransferRouter.post('/', auth, addMoneyTransfer);
moneyTransferRouter.get('/', auth, showAllTransfers);

module.exports = moneyTransferRouter;
