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

module.exports.deleteUser = function(req, res, next) {
  User.remove({username: req.body.username}, function(err) {
    if (err){
      next(err);
    }
    else {
      res.status(200).json({message: 'Removed ' + req.body.username + 'from the users'});
    }
 })
};
