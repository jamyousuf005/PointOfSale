const express = require('express')
const {
     addPurchase,
     showPurchase,
     deletePurchase,
     editPuchase,
     showOnePurchase
} = require('./purchase.controller');
const ensureAuthenticated = require('../../middlewares/auth');

const router = express.Router();

router.route('/')
.all(ensureAuthenticated)
.post(addPurchase)
.get(showPurchase)

router.route('/:id').all(ensureAuthenticated).delete(deletePurchase).put(editPuchase).get(showOnePurchase)

module.exports = router