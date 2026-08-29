const express = require('express');
const {
    addCategory,
    getCategories,
    updateCategory,
    deleteCategory
} = require('./category.controller');
const ensureAuthenticated = require('../../middlewares/auth');
const upload = require('../../middlewares/upload');

const router = express.Router();

router.route("/")
  .all(ensureAuthenticated)
  .get(getCategories)
  .post(upload.single('image'), addCategory);

router.route('/:id')
  .all(ensureAuthenticated)
  .put(upload.single('image'), updateCategory)
  .delete(deleteCategory);

module.exports = router;
