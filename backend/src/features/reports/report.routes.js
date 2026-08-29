const express = require('express');
const { getDashboardKPIs, getPaymentReport, getProductReport, getPurchaseReport, getSaleReport } = require('./report.controller');
const auth = require('../../middlewares/auth');

const reportRouter = express.Router();

reportRouter.get('/dashboard-kpis', auth, getDashboardKPIs);
reportRouter.get('/payments', auth, getPaymentReport);
reportRouter.get('/products', auth, getProductReport);
reportRouter.get('/purchases', auth, getPurchaseReport);
reportRouter.get('/sales', auth, getSaleReport);

module.exports = reportRouter;
