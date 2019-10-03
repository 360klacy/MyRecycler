var express = require('express');
var router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");

const sessionOptions = {
  secret: "i3rlejofdiaug;lsad",
  resave: false,
  saveUninitialized: false
};
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
