var express = require('express');
var router = express.Router();
var registerController = require('../controllers/register')


/* GET register page */
router.get('/', registerController.register_get);

/* POST register page */
router.post('/', registerController.register_post)

module.exports = router;
