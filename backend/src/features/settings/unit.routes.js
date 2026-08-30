const express = require('express');
const { getUnits, createUnit, updateUnit, deleteUnit } = require('./unit.controller');
const authorizeRoles = require('../../middlewares/authorizeRoles');
const ensureAuthenticated = require('../../middlewares/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(ensureAuthenticated);

// All these routes require Admin or Manager role
router.use(authorizeRoles('Admin', 'Manager'));

router.route('/')
    .get(getUnits)
    .post(createUnit);

router.route('/:id')
    .put(updateUnit)
    .delete(deleteUnit);

module.exports = router;
