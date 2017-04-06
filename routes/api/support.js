var router = require('express').Router();
var directTransport = require('nodemailer-direct-transport');
var nodemailer = require('nodemailer');
var options = {};
var transporter = nodemailer.createTransport(directTransport(options));
var juice = require('juice');

var mapping = {
  name: 'Name',
  type: 'Type',
  quickfix: 'Quickfix',
  location: 'Location',
  room: 'Room/Site number',
  problem: 'Problem',
  solution: 'Solution',
  username: 'Username',
  proceed: 'Next step',
  email: 'Email',
  offandon: 'Off and On again',
  pebkkac: 'PEBKKAC',
  password: 'Password',
  multidevice: 'Multi Device Logoff',
  resolve: 'Resolved',
  ticket: 'Create Ticket',
  credit: 'Credit',
  call: 'Call back',
  visit: 'Visit Site',
  fix: 'Break Fix',
  wifi: 'WiFi',
  support: 'Support',
  voip: 'VOIP',
  operations: 'Operations/Accounts'
}

var mail = function(req, res, next){

  var data = req.body;

  console.log(data);

  console.log(data.support.otherFix);
  console.log(data.support.otherProceed);

  var content = "";
  var contentHtml = "<style> .container { font-family: Tahoma; margin: 5vh auto; padding: 5vh 5%; background-color: #ecf0f1; border-radius: 15px; color: #333; max-width: 560px; } h1, h2 { font-weight: 100; margin: 0; } h1 { display: inline-block; float: right; color: #bdc3c7; } .company { color: #333; float: none; display: inline-block; font-weight: 600; font-family: Verdana; } h2 { clear: both; margin-top: 20px; background-color: #e74c3c; padding: 5px 15px; border-radius: 15px; display: inline-block; color: white; font-size: 1rem; } span { padding-right: 20px; display: inline-block; min-width: 165px; text-decoration: underline; } p { margin: 8px 0; } .chat p { vertical-align: middle; font-size: 0.8rem; margin: 2px 0 } .chat p:first-child { width: 20%; min-width: 50px; max-width: 150px; margin: 5px 5px 0 0 ; color: white; padding: 5px 12px; display: inline-block; color: #2ecc71; } .chat p:nth-child(2n){ display: inline-block; width: 70%; } .chat p.support { color: #3498db; } .big { width: 25%; min-width: 165px; display: inline-block; padding-right: 20px; } .big-content { display: inline-block; width: calc(100% - 220px); vertical-align: text-top; }</style><div class='container'><h1 class='company'>HQ N.D.C.</h1><h1>Chat Ticket</h1><section class='customer'><h2>Customer information</h2>";

  contentHtml += "<p><span>Name:</span>" + data.support.name + "</p>";
  contentHtml += "<p><span>Email:</span>" + data.support.email + "</p>";

  if (data.support.username != null){
    contentHtml += "<p><span>Username:</span>" + data.support.username + "</p>";
  }

  // close the section, open the new section
  contentHtml += "</section><section class='handle'><h2>Ticket information</h2>";

  if (data.support.type != null){
    contentHtml += "<p><span>Support Type:</span>" + mapping[data.support.type] + "</p>";
  }

  var temp = [];
  for (var field in data.support.quickfix){
    if (data.support.quickfix[field]){
      if (field != 'other'){
        temp.push(field);
      }
      
    }
  }

  if (temp.length > 0 || (data.support.quickfix['other'] == true && data.support.otherFix != null && data.support.otherFix != '')){
    contentHtml += "<p><span>Quickfix:</span>";

    for (var i = 0; i < temp.length; i++){
      if (i == temp.length-1){
        contentHtml += mapping[temp[i]];
      }
      else {
        contentHtml += mapping[temp[i]] + ", ";
      }
    }

    if (data.support.quickfix['other'] == true && data.support.otherFix != null && data.support.otherFix != ''){
      if (temp.length > 0){
        contentHtml += ", " + data.support.otherFix + "";
      }
      else {
        contentHtml += "" + data.support.otherFix + "";
      }
    }

    contentHtml += "</p>";
  }

  if (data.support.location != null){
    contentHtml += "<p><span>Location:</span>" + data.support.location + "</p>";
  }

  if (data.support.room != null){
    contentHtml += "<p><span>Room/Site number:</span>" + data.support.room + "</p>";
  }

  if (data.support.problem != null){
    contentHtml += "<p><div class='big'><span>Problem:</span></div><div class='big-content'>" + data.support.problem + "</div></p>";
  }

  if (data.support.solution != null){
    contentHtml += "<p><div class='big'><span>Solution:</span></div><div class='big-content'>" + data.support.solution + "</div></p>";
  }


  var temporary = [];
  for (var field in data.support.proceed){
    if (data.support.proceed[field]){
      if (field != 'other'){
         temporary.push(field);
      }
    }
  }

  if (temporary.length > 0 || (data.support.proceed['other'] == true && data.support.otherProceed != null && data.support.otherProceed != '')){
    contentHtml += "<p><span>Proceed:</span>";

    for (var i = 0; i < temporary.length; i++){
      if (i == temporary.length-1){
        contentHtml += mapping[temporary[i]];
      }
      else {
        contentHtml += mapping[temporary[i]] + ", ";
      }
    }


    if (data.support.proceed['other'] == true && data.support.otherProceed != null && data.support.otherProceed != ''){
      if (temporary.length > 0){
        contentHtml += ", " + data.support.otherProceed + "";
      }
      else {
        contentHtml += "" + data.support.otherProceed + "";
      }
    }
    contentHtml += "</p>";
  }

  // close the section and open chat section
  contentHtml += "</section><section class='chat'><h2>Chat log</h2><div>";

  //loop over the chat Messages
  for (var i = 0; i < data.chat.length; i++){
    contentHtml += "<div><p class='support'>" + data.chat[i].from + "</p><p>";

    console.log(data.chat[i].text);

    for (var j = 0; j < data.chat[i].text.length; j++){
      contentHtml += "" + data.chat[i].text[j] + "";


    }
    contentHtml += "</p></div>"
  }

  // close the section
  contentHtml += "</div></section>"


  // close the container
  contentHtml += "</div>"


  var result = juice(contentHtml);


  transporter.sendMail({
    from: "noreply@hq.co.nz",
    to: 'sander.lenaerts@gmail.com',
    subject: '[TICKET] - Chat support',
    html: result
  });

  res.status(200).json(data);
}


var support = {
  mail: mail
}


module.exports = support;
