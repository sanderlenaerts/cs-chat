var mongoose = require('mongoose');

var dbUri = 'mongodb://localhost/livechat';

if(process.env.NODE_ENV === "production"){
  dbUri = "mongodb://localhost/livechat";
}

mongoose.connect(dbUri, function(){
  console.log('mongodb connected');
});
