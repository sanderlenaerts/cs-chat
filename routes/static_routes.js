var express = require('express');
var router = express.Router();
var path = require('path');


router.use(express.static(path.join(__dirname, '../client')));

router.get('/*', function(req, res){
  if (process.env.NODE_ENV == "production"){
    res.sendFile(path.join(__dirname, '../production.html'));
  }
  else {
    res.sendFile(path.join(__dirname, '../index.html'));
  }
  
});


module.exports = router;
