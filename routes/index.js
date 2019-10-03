var express = require('express');
var router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
