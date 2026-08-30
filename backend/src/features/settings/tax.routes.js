const express = require('express');
const { getTaxes, createTax, updateTax, deleteTax } = require('./tax.controller');
const authorizeRoles = require('../../middlewares/authorizeRoles');
const ensureAuthenticated = require('../../middlewares/auth');

const router = express.Router();

router.route('/')
    .all(ensureAuthenticated)
    .get(getTaxes)
    .post(authorizeRoles('Admin', 'Manager'), createTax);

router.route('/:id')
    .all(ensureAuthenticated)
    .put(authorizeRoles('Admin', 'Manager'), updateTax)
    .delete(authorizeRoles('Admin', 'Manager'), deleteTax);

module.exports = router;
