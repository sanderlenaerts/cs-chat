var mongoose = require('mongoose');
var config = require('./config');

var dbUri = 'mongodb://localhost/livechat';

if(process.env.NODE_ENV === "production"){
  dbUri = config.mongo;
}

mongoose.connect(dbUri, function(){
  console.log('mongodb connected');
});
