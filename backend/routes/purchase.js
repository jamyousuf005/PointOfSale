const express = require('express')
const {
     addPurchase,
     showPurchase,
     deletePurchase,
     editPuchase,
     showOnePurchase
} = require('../controllers/handlePurchases');

const router = express.Router();

router.route('/').post(addPurchase).get(showPurchase)
router.route('/:id').delete(deletePurchase).put(editPuchase).get(showOnePurchase)

module.exports = router