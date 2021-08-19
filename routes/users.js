var express = require('express');
var router = express.Router();
var userController = require('../controllers/users')
var userModel = require('../models/user')

/* GET users listing. */
router.get('/', userController.users_get);

router.get('/:id', userController.user_id_get)

module.exports = router;
