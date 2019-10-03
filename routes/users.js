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
  var msg = "";
  console.log(req.body)
  if((!name)||(!email)||(!password)){
    msg = "invalidData"
    res.json({
      msg
    });
    return;
  }
  const checkUserQuery = `
  SELECT * FROM users 
  WHERE = $1`
  db.query(checkUserQuery,[email],(err,results)=>{
    if(err){throw err};
    if (results > 0){
      msg = "userExists"
      res.json({
        msg
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
        msg = "userAdded"
        res.json({
          msg,
          token,
          email,
          name
        })
      })
    }
  })
  console.log(msg)
})

router.post('/login', (req, res)=>{
  const { email, password } = req.body;
  var msg = ""
  
  const getUserQuery = `
  SELECT * FROM users 
  WHERE email = $1`;

  db.query(getUserQuery, [email], (err, results)=>{
    if(err){throw err};
    if(results.length > 0){
      const thisRow = results[0];
      const isValidPass = bcrypt.compareSync(password, thisRow.password);
      if(isValidPass){
        const token = randToken.uid(50);
        const updateUserTokenQuery = `
        UPDATE users
        SET token = $1
        WHERE email = $2`
        db.query(updateUserTokenQuery, [token,email],(err)=>{
          if(err){throw err};
        })
        msg = "loggedIn"
        res.json({
          msg,
          name: thisRow.name,
          email: thisRow.email,
          token
        })
      }else{
        msg = "badPass"
        res.json({
          msg
        })
      }
    }else{
      msg = "noEmail"
      res.json({
        msg
      })
    }
  })
  console.log(msg)
})
module.exports = router;
