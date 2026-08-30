const express = require('express');
const {
    addCategory,
    getCategories,
    updateCategory,
    deleteCategory
} = require('./category.controller');
const ensureAuthenticated = require('../../middlewares/auth');
const authorizeRoles = require('../../middlewares/authorizeRoles');
const upload = require('../../middlewares/upload');

const router = express.Router();

router.route("/")
  .all(ensureAuthenticated)
  .get(getCategories)
  .post(authorizeRoles('Admin', 'Manager'), upload.single('image'), addCategory);

router.route('/:id')
  .all(ensureAuthenticated)
  .put(authorizeRoles('Admin', 'Manager'), upload.single('image'), updateCategory)
  .delete(authorizeRoles('Admin', 'Manager'), deleteCategory);

module.exports = router;
