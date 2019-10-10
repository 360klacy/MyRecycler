var express = require('express');
var router = express.Router();
const db = require('../db');

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/create-ticket', async (req,res)=>{
    const userID = req.body.userid
    const userToken = req.body.token
    var msg = '';
    console.log(req.body)
    const checkUserTokenQuery = `
    SELECT token 
    FROM users
    WHERE id = $1`;

    const userDBToken = await db.query(checkUserTokenQuery, [userID])
    console.log(userDBToken , userToken)
    if(userDBToken[0].token == userToken){
        const { payload, progress, pickupDate, address1, address2, time } = req.body
        console.log(payload)
        const invalidData = !payload ? 'payload' : false || !progress ? 'progress' : false || !pickupDate ? 'userDate': false || !address1 ? 'address' : false || !time ? 'time':false || false;
        if(invalidData){
            msg = `invalid ${invalidData}`
            res.json({msg})
            return
        }
        const customerPreferTime = JSON.stringify({date: pickupDate, time})
        console.log(invalidData)
        const ticketString = payload
        const insertTicketQuery = `
        INSERT INTO order_tickets (user_id, order_items, progress, customer_prefer_timeframe, pickup_address, pickup_address2)
        VALUES ($1, $2, $3, $4)`
        const insertTicket = await db.query(insertTicketQuery, [userID, ticketString, progress, customerPreferTime, address1, address2 ])
        msg = 'success'
        res.json({msg})
    }else{
        msg = 'invalidLogin'
        res.json({msg})
        return
    }
})
router.put('/edit-ticket', async (req, res)=>{
    
})
router.put('/update-ticket', async (req,res)=>{
    const {progress, ticketId, companyId, details, order} = req.body

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