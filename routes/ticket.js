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
        VALUES ($1, $2, $3, $4, $5, $6)`
        const insertTicket = await db.query(insertTicketQuery, [userID, ticketString, progress, customerPreferTime, address1, address2 ])
        msg = 'success'
        res.json({msg})
    }else{
        msg = 'invalidLogin'
        res.json({msg})
        return
    }
})

router.put('/add-ticket-quote', async (req,res)=>{
    const { progress, userId, token } = req.body
    console.log(req.body)
    let msg = ""

    const isCompanyQuery = `
    SELECT token, is_company
    FROM users
    WHERE id = $1
    `
    const dbToken = await db.query(isCompanyQuery, [userId]);

    if(dbToken[0].token === token && dbToken[0].is_company){
        if( progress === 1 ){
            const { time, date, address, address2, price, ticketId } = req.body;
            const newProgress = 2
            const updateTicketQuery = `
            UPDATE order_tickets
            SET
            progress = $1,
            pickup_time = $2, 
            pickup_date = $3,
            pickup_address = $4, 
            pickup_address2 = $5,
            price = $6
            WHERE id = $7
            `

            db.query(updateTicketQuery, [newProgress,time,date,address,address2,price,ticketId])
            msg = 'ticket updated';
            res.json({msg})
        }else{
            msg = "wrong work flow"
            res.json({msg})
        }
    }else{
        msg = 'not authorized'
        res.json({msg})
    }
    
})
router.put('/confirm-ticket-quote', async (req,res)=>{
    const { progress, userId, token, ticketId } = req.body;
    let msg = ""

    const isUserQuery = `
    SELECT users.token, users.is_company, users.id, order_tickets.progress
    FROM users RIGHT JOIN order_tickets
    ON users.id = order_tickets.user_id
    WHERE order_tickets.id = $1
    `
    const dbToken = await db.query(isUserQuery, [ticketId]);
    console.log(dbToken,dbToken[0].token === token && !dbToken[0].is_company, req.body)
    if(dbToken[0].token === token && !dbToken[0].is_company){
        if( dbToken[0].progress === 2 ){
            const { userValue } = req.body;
            
            let newProgress= userValue ? 3 : -1 ;
            
            const updateTicketQuery = `
            UPDATE order_tickets
            SET
            progress = $1
            WHERE id = $2
            `

            db.query(updateTicketQuery, [newProgress,ticketId])
            msg = 'ticket updated';
            res.json({msg})
        }else{
            msg = "wrong work flow"
            res.json({msg})
        }
    }else{
        msg = 'not authorized'
        res.json({msg})
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