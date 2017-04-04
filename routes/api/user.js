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

module.exports.getUser = function(req, res, next) {
  User.findOne({username: req.query.username}, function(err, user) {
    if (err){
      next(err);
    }
    else {
      res.status(200).json(user);
    }
 })
};

module.exports.updateUser = function(req, res, next) {
  var username = req.params.username;
  console.log("req body: ", req.body);
  console.log("req query: ", req.query);
  console.log("req params: ", req.params);

  User.findOneAndUpdate({ "username": username }, { "$set": { "name": req.body.name, "role": req.body.role}}).exec(function(err, user){
     if(err) {
         console.log(err);
         next(err);
     }
     else {
        res.status(200).json(user);
     }
  });

};
