var express = require('express');
var router = express.Router();
var registerController = require('../controllers/register')


/* GET users listing. */
router.get('/', registerController.register_get);

router.post('/', registerController.register_post)

module.exports = router;
