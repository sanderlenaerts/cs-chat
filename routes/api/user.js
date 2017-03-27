var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.getUsers = function(req, res, next) {
  console.log("test");
  User.find({}, function(err, users) {
    if (err){
      next(err);
    }
    else {
      console.log(users);
      res.status(200).json(users);
    }
 })
};
