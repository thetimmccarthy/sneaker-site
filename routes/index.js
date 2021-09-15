var express = require('express');
var router = express.Router();
var itemModel = require('../models/item.js');
var brandModel = require('../models/brand.js');
var categoryModel = require('../models/category.js');
var indexController = require('../controllers/index')

/* GET home page. */
router.get('/', indexController.index_get);

router.get('/logout', indexController.index_logout);

module.exports = router;
