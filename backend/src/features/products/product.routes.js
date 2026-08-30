const express = require('express')
const{
    addProducts,
     showProducts,
    deleteProduct,
     editProduct,
     showOneProduct
    } = require('./product.controller')
const ensureAuthenticated = require('../../middlewares/auth')
const authorizeRoles = require('../../middlewares/authorizeRoles')
const upload = require('../../middlewares/upload')

const router = express.Router()

router.route("/")
  .all(ensureAuthenticated) 
  .get(showProducts)
  .post(authorizeRoles('Admin', 'Manager'), upload.single('image'), addProducts);
  
router.route('/:id')
  .all(ensureAuthenticated)
  .delete(authorizeRoles('Admin', 'Manager'), deleteProduct)
  .put(authorizeRoles('Admin', 'Manager'), upload.single('image'), editProduct)
  .get(showOneProduct)

module.exports=router