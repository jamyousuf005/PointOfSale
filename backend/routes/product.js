const express = require('express')
const{
    addProducts,
     showProducts,
    deleteProduct,
     editProduct,
     showOneProduct
    } = require('../controllers/handleProducts')

const router = express.Router()

router.route("/").get(showProducts).post(addProducts)

router.route('/:id').delete(deleteProduct).put(editProduct).get(showOneProduct)

module.exports=router