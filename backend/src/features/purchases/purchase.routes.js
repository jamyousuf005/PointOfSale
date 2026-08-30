const express = require('express')
const {
     addPurchase,
     showPurchase,
     deletePurchase,
     editPuchase,
     showOnePurchase
} = require('./purchase.controller');
const ensureAuthenticated = require('../../middlewares/auth');

const authorizeRoles = require('../../middlewares/authorizeRoles');

const router = express.Router();

router.route('/')
.all(ensureAuthenticated, authorizeRoles('Admin', 'Manager'))
.post(addPurchase)
.get(showPurchase)

router.route('/:id').all(ensureAuthenticated, authorizeRoles('Admin', 'Manager')).delete(deletePurchase).put(editPuchase).get(showOnePurchase)

module.exports = router