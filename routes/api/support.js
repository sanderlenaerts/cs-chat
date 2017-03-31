var router = require('express').Router();
var directTransport = require('nodemailer-direct-transport');
var nodemailer = require('nodemailer');
var options = {};
var transporter = nodemailer.createTransport(directTransport(options))

var mail = function(req, res, next){

  var data = req.body;

  console.log(data);

  var steps = getChecked(data.support.proceed);
  var fixes = getChecked(data.support.quickfix);
  var content =
  "Support ticket through chat: \nName: " + data.support.name
  + "\nEmail: " + data.support.email
  + "\nType: " + data.support.type
  + "\nQuickfix: " + fixes
  + "\nLocation: " + data.support.location
  + "\nRoom Site/Number: " + data.support.room
  + "\nProblem: " + data.support.problem
  + "\nSolution: " + data.support.solution
  + "\nNext step: " + steps;

  transporter.sendMail({
    from: data.support.email,
    to: 'sander.lenaerts@gmail.com',
    subject: '[TICKET] - Chat support',
    text: content
  });

  res.status(200).json(data);
}

var getChecked = function(json){
  var array = [];
  for (var key in json) {
    if (json.hasOwnProperty(key)) {
      if (json[key] == true){
        array.push(key);
      }
    }
  }
  return array;
}


var support = {
  mail: mail
}


module.exports = support;
