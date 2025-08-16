const express = require('express')

const {addSale, showSales, deleteSale, editSale, showOne} = require('../controllers/handleSales')

const router = express.Router()

router.route('/').post(addSale).get(showSales)
router.route('/:id').delete(deleteSale).put(editSale).get(showOne)
module.exports=router