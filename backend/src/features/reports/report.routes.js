const express = require('express');
const { getDashboardKPIs, getPaymentReport, getProductReport, getPurchaseReport, getSaleReport } = require('./report.controller');
const auth = require('../../middlewares/auth');
const authorizeRoles = require('../../middlewares/authorizeRoles');

const reportRouter = express.Router();

reportRouter.get('/dashboard-kpis', auth, authorizeRoles('Admin', 'Manager'), getDashboardKPIs);
reportRouter.get('/payments', auth, authorizeRoles('Admin', 'Manager'), getPaymentReport);
reportRouter.get('/products', auth, authorizeRoles('Admin', 'Manager'), getProductReport);
reportRouter.get('/purchases', auth, authorizeRoles('Admin', 'Manager'), getPurchaseReport);
reportRouter.get('/sales', auth, authorizeRoles('Admin', 'Manager'), getSaleReport);

module.exports = reportRouter;
