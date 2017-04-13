var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.getUsers = function(req, res, next) {
  User.find({}, function(err, users) {
    if (err){
      next(err);
    }
    else {
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

module.exports.getUser = function(req, res, next) {
  User.findOne({username: req.query.username}, function(err, user) {
    if (err){
      next(err);
    }
    else if (!user){
      res.status(404).json({
        msg: "The user with this username does not exist"
      })
    }
    else {
      res.status(200).json(user);
    }
 })
};

module.exports.updateUser = function(req, res, next) {
  var username = req.params.username;

  User.findOneAndUpdate({ "username": username }, { "$set": { "name": req.body.name, "role": req.body.role}}).exec(function(err, user){
     if(err) {
         next(err);
     }
     else {
        res.status(200).json(user);
     }
  });

};
