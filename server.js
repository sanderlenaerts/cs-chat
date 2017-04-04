var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');
var expressValidator = require('express-validator');
var passport = require('passport');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var socket = require('./socket');

socket(io);

// require models
require('./models/user');

//require db and passport configuration
require('./db');
require('./config/passport');

// require db configuration

var port = process.env.PORT || 3000;


//view engine
app.set('views', path.join(__dirname, 'views'));

//body parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(expressValidator([]));

app.use(passport.initialize());
//app.use(passport.session());


app.use('/api', require('./routes/api/routes'));
app.use(require('./routes/static_routes'));

app.use(cors());

app.use(function(err, req, res, next) {
  // Only handles `next(err)` calls
  res.status(err.status || 500);
  res.send({message: err.message});
});

http.listen(port, function(){
    console.log('Server started on port ' + port);
});
