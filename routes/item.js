var express = require('express');
var router = express.Router();
var itemModel = require('../models/item');
var itemsController = require('../controllers/items')
var {resizeImage, upload } = require('../controllers/images');
var { require_login } = require('../controllers/require_login');

/* GET all items page */
router.get('/', itemsController.index_get);

/* GET new item page */
router.get('/new', require_login, itemsController.index_new_get)

/* POST new item page */
router.post('/new', require_login, upload, resizeImage, itemsController.index_new_post);

/* GET specific item page */
router.get('/:id', itemsController.index_get_id);

/* GET specific item page */
router.get('/edit/:id', require_login, itemsController.index_get_id_edit);

/* POST specific item page */
router.post('/edit/:id', require_login, upload, resizeImage, itemsController.index_post_id_edit);

/* POST delete specific item page */
router.post('/delete/:id', require_login, itemsController.index_delete_id);

/* GET specific item image in html/handlebars */
router.get('/image/:id', itemsController.image_get)

module.exports = router;
