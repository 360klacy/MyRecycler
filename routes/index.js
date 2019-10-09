var express = require('express');
var router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");
const randToken = require('rand-token')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  next();
});

router.get('/', (req,res)=>{
  console.log('hello')
})
router.post('/signup', async (req, res, next)=>{
  const { fullName, username ,email, password } = req.body;
  let msg = "undefined";
  console.log(req.body)
  if((!fullName)||(!email)||(!password)||(!username)){
    msg = "invalidData"
    console.log(msg)
    res.json({
      msg
    });
    return;
  }
  const checkUserQuery = `
  SELECT * FROM users 
  WHERE email = $1`;
  
  var checkUser = await db.query(checkUserQuery,[email])
    if (checkUser.length > 0){
      msg = "userExists"
      console.log(msg)
      res.json({
        msg
      });
    }else{
      const insertUserQuery = `
      INSERT INTO users
      (name, email, password, token, username)
      VALUES
      ($1,$2,$3,$4,$5)`

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      const token = randToken.uid(50);
      var insertedUser = await db.none(insertUserQuery, [fullName,email,hash,token, username]);
      
      msg = "userAdded"
        console.log(msg)
        res.json({
          msg,
          token,
          email,
          fullName
        })
    }
  })
// router.post("*",async (req,res, next)=>{
//   const token = req.body.token

//   const checkUserTokenQuery = `
//   SELECT id 
//   FROM users
//   WHERE token = $1`;

//   const users = await db.query(checkUserTokenQuery, [req.body.token])

//   if(users.length=== 0){
//     res.locals.loggedIn = false
//   }else if(users.length === 1){
//     res.locals.loggedIn = true
//     res.locals.uid = users[0].userID
//     res.locals.file = req.file
//   }else{
//     console.log('we found a hacker bois')
//   }
// })

module.exports = router;
