var express = require('express');
var router = express.Router();
var loginController = require('../controllers/login')
var userModel = require('../models/user')

/* GET users listing. */
router.get('/', loginController.login_get);

router.post('/', userController.login_id_get)

module.exports = router;
