var express = require('express');
var router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const expressSession = require("express-session");

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
