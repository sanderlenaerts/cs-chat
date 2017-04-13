var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  },
  function(username, password, done) {
    console.log('test');
    User.findOne({ username: username.toLowerCase() }, function (err, user) {
      console.log(username);
      console.log(user);
      if (err) {
        console.log(err);
        return done(err);
      }
      // Return if user not found in database
      if (!user) {
        return done(null, false, [{
          msg: 'The username/password combination is incorrect'
        }]);
      }
      // Return if password is wrong
      if (!user.validPassword(password)) {
        return done(null, false, [{
          msg: 'The username/password combination is incorrect'
        }]);
      }
      // If credentials are correct, return the user object
      return done(null, user);
    });
  }
));
