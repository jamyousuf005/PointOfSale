const express = require('express')
const{
    addProducts,
     showProducts,
    deleteProduct,
     editProduct,
     showOneProduct
    } = require('./product.controller')
const ensureAuthenticated = require('../../middlewares/auth')
const upload = require('../../middlewares/upload')

const router = express.Router()

router.route("/")
  .all(ensureAuthenticated) 
  .get(showProducts)
  .post(upload.single('image'), addProducts);
  
router.route('/:id')
  .all(ensureAuthenticated)
  .delete(deleteProduct)
  .put(upload.single('image'), editProduct)
  .get(showOneProduct)

module.exports=router