const express = require('express');
const { addMoneyTransfer, showAllTransfers } = require('./moneyTransfer.controller');
const auth = require('../../middlewares/auth');
const authorizeRoles = require('../../middlewares/authorizeRoles');

const moneyTransferRouter = express.Router();

moneyTransferRouter.post('/', auth, authorizeRoles('Admin'), addMoneyTransfer);
moneyTransferRouter.get('/', auth, authorizeRoles('Admin'), showAllTransfers);

module.exports = moneyTransferRouter;
