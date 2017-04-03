var express = require('express');
var router = express.Router();

var ctrlAuth = require('./authentication');
var ctrlUser = require('./user');

var ctrlSupport = require('./support');

//authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

//users
router.get('/users', ctrlUser.getUsers);
router.delete('/users', ctrlUser.deleteUser);

//support form

router.post('/mail', ctrlSupport.mail);

module.exports = router;
