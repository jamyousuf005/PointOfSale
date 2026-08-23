const express = require('express')
const{
    addProducts,
     showProducts,
    deleteProduct,
     editProduct,
     showOneProduct
    } = require('./product.controller')
const ensureAuthenticated = require('../../middlewares/auth')

const router = express.Router()

router.route("/")
  .all(ensureAuthenticated) 
  .get(showProducts)
  .post(addProducts);
  
router.route('/:id').all(ensureAuthenticated).delete(deleteProduct).put(editProduct).get(showOneProduct)

module.exports=router