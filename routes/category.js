var express = require('express');
var router = express.Router();
var categoryModel = require('../models/category');
var categoriesController = require('../controllers/categories')

/* GET home page */
router.get('/', categoriesController.index_get);

/* GET specific category */
router.get('/:id', categoriesController.index_get_id);

module.exports = router;
