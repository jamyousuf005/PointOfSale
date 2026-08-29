const express = require('express');
const { getWarehouses, createWarehouse } = require('./warehouse.controller');

const router = express.Router();

router.route('/').get(getWarehouses).post(createWarehouse);

module.exports = router;
