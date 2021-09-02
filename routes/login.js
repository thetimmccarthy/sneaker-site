var express = require('express');
var router = express.Router();
var loginController = require('../controllers/login')
var userModel = require('../models/user')

/* GET login page */
router.get('/', loginController.login_get);

/* POST login page */
router.post('/', loginController.login_post)

module.exports = router;
