const express = require('express');
const { getSuppliers, createSupplier, updateSupplier, deleteSupplier } = require('./supplier.controller');
const ensureAuthenticated = require('../../middlewares/auth');
const authorizeRoles = require('../../middlewares/authorizeRoles');

const router = express.Router();

router.route('/')
  .all(ensureAuthenticated)
  .get(getSuppliers)
  .post(authorizeRoles('Admin', 'Manager'), createSupplier);

router.route('/:id')
  .all(ensureAuthenticated, authorizeRoles('Admin', 'Manager'))
  .put(updateSupplier)
  .delete(deleteSupplier);

module.exports = router;
