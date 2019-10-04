var express = require('express');
var router = express.Router();
const db = require('../db')
const bcrypt = require('bcryptjs');
const randToken = require('rand-token')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', async (req, res, next)=>{
  const { name, email, password} = req.body;
  let msg = "undefined";
  console.log(req.body)
  if((!name)||(!email)||(!password)){
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
      (name, email, password, token)
      VALUES
      ($1,$2,$3,$4)`

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      const token = randToken.uid(50);
      var insertedUser = await db.none(insertUserQuery, [name,email,hash,token]);
      
      msg = "userAdded"
        console.log(msg)
        res.json({
          msg,
          token,
          email,
          name
        })
    }
  })


router.post('/login', async (req, res)=>{
  const { email, password } = req.body;
  var msg = ""
  
  const getUserQuery = `
  SELECT * FROM users 
  WHERE email = $1`;

  var getUser = await db.query(getUserQuery, [email])
    if(getUser.length > 0){
      const thisRow = getUser[0];
      const isValidPass = bcrypt.compareSync(password, thisRow.password);
      if(isValidPass){
        const token = randToken.uid(50);
        const updateUserTokenQuery = `
        UPDATE users
        SET token = $1
        WHERE email = $2`
        
        db.none(updateUserTokenQuery, [token,email]);

        msg = "loggedIn"
        console.log(msg)
        res.json({
          msg,
          name: thisRow.name,
          email: thisRow.email,
          token
        })
      }else{
        msg = "badPass"
        console.log(msg)
        res.json({
          msg
        })
      }
    }else{
      msg = "noEmail"
      console.log(msg)
      res.json({
        msg
      })
    }
})
module.exports = router;
