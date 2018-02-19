var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('user',{name:name,firstname:firstname,lastname:lastname,gender:gender,fbid:fbid});       
});

module.exports = router;
