const express = require('express');
const { getDashboardKPIs } = require('./report.controller');
const auth = require('../../middlewares/auth');

const reportRouter = express.Router();

reportRouter.get('/dashboard-kpis', auth, getDashboardKPIs);

module.exports = reportRouter;
