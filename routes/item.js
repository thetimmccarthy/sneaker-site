var express = require('express');
var router = express.Router();
var itemModel = require('../models/item');
var itemsController = require('../controllers/items')
var {resizeImage, upload } = require('../controllers/images');

/* GET home page. */
router.get('/', itemsController.index_get);

router.get('/new', itemsController.index_new_get)
router.post('/new', upload, resizeImage, itemsController.index_new_post);

router.get('/:id', itemsController.index_get_id);

router.get('/edit/:id', itemsController.index_get_id_edit);
router.post('/edit/:id', upload, resizeImage, itemsController.index_post_id_edit);

router.post('/delete/:id', itemsController.index_delete_id);

router.get('/image/:id', itemsController.image_get)

module.exports = router;
