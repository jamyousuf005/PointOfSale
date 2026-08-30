const express = require('express');
const { addCustomer, getCustomers, deleteCustomer } = require('./customer.controller');
const ensureAuthenticated = require('../../middlewares/auth');
const authorizeRoles = require('../../middlewares/authorizeRoles');

const router = express.Router();

// Cashiers can read customers, but only Admin/Manager can Add or Delete
router.route('/')
    .all(ensureAuthenticated)
    .get(getCustomers)
    .post(authorizeRoles('Admin', 'Manager'), addCustomer);

router.route('/:id')
    .all(ensureAuthenticated)
    .delete(authorizeRoles('Admin', 'Manager'), deleteCustomer);

module.exports = router;
