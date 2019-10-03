var express = require('express');
var router = express.Router();
const db = require('../db')
const bcrypt = require('bcryptjs');
const randToken = require('rand-token')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next)=>{
  const { name, email, password} = req.body;
  if((!name)||(!email)||(!password)){
    res.json({
      msg: "invalidData"
    });
    return;
  }
  const checkUserQuery = `
  SELECT * FROM users 
  WHERE = $1`
  db.query(checkUserQuery,[email],(err,results)=>{
    if(err){throw err};
    if (results > 0){
      res.json({
        msg: "userExists"
      });
    }else{
      const insertUserQuery = `
      INSERT INTO users
      (name, email, password, token)
      VALUES
      ($1,$2,$3,$4)`

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      const token = randToken.uid(50);
      db.query(insertUserQuery, [name,email,hash,token],(err2)=>{
        if(err2){throw err2};
        res.json({
          msg: "userAdded",
          token,
          email,
          name
        })
      })
    }
  })
})
module.exports = router;
