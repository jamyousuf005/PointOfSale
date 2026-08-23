const express = require('express')

const {addSale, showSales, deleteSale, editSale, showOne} = require('./sale.controller')
const ensureAuthenticated = require('../../middlewares/auth')

const router = express.Router()

router.route('/')
.all(ensureAuthenticated)
.post(addSale)
.get(showSales)
router.route('/:id').all(ensureAuthenticated).delete(deleteSale).put(editSale).get(showOne)
module.exports=router