var express = require('express');
var router = express.Router();
const db = require('../db');

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/create-ticket', async (req,res)=>{
    const userID = req.body.userid
    const userToken = req.body.token
    const ticketProgress = req.body.progress
    var msg = '';
    console.log(req.body)
    const checkUserTokenQuery = `
    SELECT token 
    FROM users
    WHERE id = $1`;

    const userDBToken = await db.query(checkUserTokenQuery, [userID])
    console.log(userDBToken , userToken)
    if(userDBToken[0].token == userToken){
        const order = req.body.payload
        console.log(order)
        const ticketString = JSON.stringify(order)
        const insertTicketQuery = `
        INSERT INTO order_tickets (user_id, details, progress)
        VALUES ($1, $2, $3)`
        const insertTicket = await db.query(insertTicketQuery, [userID, ticketString, ticketProgress])
        msg = 'success'
        res.json({msg})
        }else{
        msg = 'invalidLogin'
        res.json({msg})
        return
    }
})

module.exports = router;

// const checkTicketQuery = `
//         IF COL_LENGTH('orderTickets.$1') IS NOT NULL
//             ALTER TABLE orderTickets
//                 ADD $1 INTEGER
//             RETURNING true
//         ELSE
//             RETURNING false`    
// categoryRay.forEach(async(category)=>{
//     var newTableStatus = await db.one(checkTicketQuery,[category]);
// })