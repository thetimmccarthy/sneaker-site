var express = require('express');
var router = express.Router();
var categoryModel = require('../models/category');
var categoriesController = require('../controllers/categories')

/* GET home page */
router.get('/', categoriesController.index_get);
/*
// router.get('/new', categoriesController.index_new_get)
// router.post('/new', categoriesController.index_new_post)
*/

router.get('/:id', categoriesController.index_get_id);

module.exports = router;
