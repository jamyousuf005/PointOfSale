const express = require('express');
const { getWarehouses, createWarehouse, updateWarehouse, deleteWarehouse } = require('./warehouse.controller');
const ensureAuthenticated = require('../../middlewares/auth');
const authorizeRoles = require('../../middlewares/authorizeRoles');

const router = express.Router();

router.route('/')
  .all(ensureAuthenticated, authorizeRoles('Admin', 'Manager'))
  .get(getWarehouses)
  .post(createWarehouse);

router.route('/:id')
  .all(ensureAuthenticated, authorizeRoles('Admin', 'Manager'))
  .put(updateWarehouse)
  .delete(deleteWarehouse);

module.exports = router;
