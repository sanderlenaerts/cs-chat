var express = require('express');
var router = express.Router();

var ctrlAuth = require('./authentication');
var ctrlUser = require('./user');

//authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

//users
router.get('/users', ctrlUser.getUsers);

module.exports = router;
