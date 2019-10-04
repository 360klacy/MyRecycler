var express = require('express');
var router = express.Router();
const db = require('../db');

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/create-ticket', async (req,res)=>{
    const userID = req.body.userID
    const userToken = req.body.token
    var msg = '';
    
    const checkUserTokenQuery = `
    SELECT token 
    FROM users
    WHERE userID = $1`;

    const userDBToken = await db.query(checkUserTokenQuery, [userID])

    if(userDBToken === userToken){
        const order = req.body.payload
        console.log(order)
        const categoryRay = Object.entries(order);
        const categoryQueryList = categoryRay.join(',')
        const checkTicketQuery = `
        IF COL_LENGTH('orderTickets.$1') IS NOT NULL
            ALTER TABLE orderTickets
                ADD $1 INTEGER
            RETURNING true
        ELSE
            RETURNING false`    

        const insertTicketQuery = `
        INSERT INTO orderTickets ($1)
        VALUES ($2,)`
            categoryRay.forEach(async(category)=>{
                var newTableStatus = await db.one(checkTicketQuery,[category]);
            })
        }else{
        msg = 'invalidLogin'
        res.json({msg})
        return
    }
})

module.exports = router;