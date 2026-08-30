const express = require('express');
const { getBrands, createBrand, updateBrand, deleteBrand } = require('./brand.controller');
const authorizeRoles = require('../../middlewares/authorizeRoles');
const ensureAuthenticated = require('../../middlewares/auth');
const upload = require('../../middlewares/upload');

const router = express.Router();

router.route('/')
    .all(ensureAuthenticated)
    .get(getBrands)
    .post(authorizeRoles('Admin', 'Manager'), upload.single('image'), createBrand);

router.route('/:id')
    .all(ensureAuthenticated)
    .put(authorizeRoles('Admin', 'Manager'), upload.single('image'), updateBrand)
    .delete(authorizeRoles('Admin', 'Manager'), deleteBrand);

module.exports = router;
