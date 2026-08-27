const express = require('express');
const { addSaleReturn, showSaleReturns } = require('./saleReturn.controller');
const { addPurchaseReturn, showPurchaseReturns } = require('./purchaseReturn.controller');
const auth = require('../../middlewares/auth');

const returnRouter = express.Router();

returnRouter.post('/sale-return', auth, addSaleReturn);
returnRouter.get('/sale-returns', auth, showSaleReturns);

returnRouter.post('/purchase-return', auth, addPurchaseReturn);
returnRouter.get('/purchase-returns', auth, showPurchaseReturns);

module.exports = returnRouter;
