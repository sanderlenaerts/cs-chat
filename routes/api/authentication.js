
var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var jwt = require('jwt-simple');
var passport = require('passport');
var config = require('../../config');
var expressValidator = require('express-validator');
var util = require('util');


var loginschema = {
 'username': {
    notEmpty: {
      value: true,
      errorMessage: "Username cannot be empty"
    },
    isLength: {
      options: [{min: 3, max: 10}],
      errorMessage: "Username must be between 3 and 10 characters" // pass options to the validator with the options property as an array
      // options: [/example/i] // matches also accepts the full expression in the first parameter
    }
  },
  'password': {
    notEmpty: {
      value: true,
      errorMessage: "Password cannot be empty"
    },
    isLength: {
      options: [{min: 5, max: 10}],
      errorMessage: "Password must be between 5 and 10 characters" // pass options to the validator with the options property as an array
      // options: [/example/i] // matches also accepts the full expression in the first parameter
    }
  }
};

var schema = {
 'username': {

    isLength: {
      options: [{min: 3, max: 10}],
      errorMessage: "Username must be between 3 and 10 characters" // pass options to the validator with the options property as an array
      // options: [/example/i] // matches also accepts the full expression in the first parameter
    },
    notEmpty: {
      value: true,
      errorMessage: "Username cannot be empty"
    }
  },
  'password': {
    notEmpty: {
      value: true,
      errorMessage: "Password cannot be empty"
    },
    isLength: {
      options: [{min: 5, max: 10}],
      errorMessage: "Password must be between 5 and 10 characters" // pass options to the validator with the options property as an array
      // options: [/example/i] // matches also accepts the full expression in the first parameter
    }
  },
  'name':{
    notEmpty: {
      value: true,
      errorMessage: "Name cannot be empty"
    },
    isLength: {
      options: [{min: 6, max: 20}],
      errorMessage: "Name must be between 6 and 20 characters"
    }
  },
  'role': {

  }
};


module.exports.register = function(req, res, next) {

  // if(!req.body.name || !req.body.email || !req.body.password) {
  //   sendJSONresponse(res, 400, {
  //     "message": "All fields required"
  //   });
  //   return;
  // }

  console.log(req.body);

  var user = new User();

  req.check(schema);

  var errors = req.validationErrors();

  if (errors){
    res.status(400).json(errors);
  }
  else {
    user.name = req.body.name;
    user.username = req.body.username.toLowerCase().replace(/ /g,'');

    user.setPassword(req.body.password);

    user.role = req.body.role.toUpperCase();

    //TODO: Before saving new user, check if user with username exists or not

    User.findOne({username: user.username}, function(err, found) {
      if (err){
        next(err);
      }
      else if (found){
         res.status(409).json([{msg: 'A user already exists with that username. Please use another.'}]);
      }
      else {
        user.save(function(err){
          if (err) {
            console.log(err);
            next(err);
          }
          else {
            console.log("Works");
            res.status(201).json({'message': 'User was added correctly', 'success': true});
          }
        });
      }
    })
  }
};


module.exports.login = function(req, res, next) {

  console.log('Login process');

  req.check(loginschema);

  console.log(req.body);

  var errors = req.validationErrors();

  console.log(errors);

  if (errors){
    res.status(400).json(errors);
  }
  else {
    passport.authenticate('local', function(err, user, info){
      var token;

      console.log("Passport: ", user);

      // If Passport throws/catches an error
      if (err) {
        console.log(err);
        res.status(404).json(err);
        console.log('Validation errors');
        return;

      }

      // If a user is found
      if(user){
        console.log('User was found');
        token = user.generateJwt();
        res.status(200).json({
          "token" : token,
          "username" : user.username,
          "role" : user.role,
          "name" : user.name
        });
      } else {
        // If user is not found
        console.log('User not found');
        res.status(401).json(info);
      }
    })(req, res, next);
  }
};
