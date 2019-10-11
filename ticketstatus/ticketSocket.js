const io = require('socket.io')()
const db = require("../db");

async function getTicketInfo(){
    const getTicketQuery = `
    SELECT order_tickets.id, order_tickets.pickup_address, users.name, order_tickets.order_items, order_tickets.progress, order_tickets.customer_prefer_timeframe
    FROM order_tickets FULL JOIN users
    ON order_tickets.user_id = users.id
    `
    const tickets = await db.query(getTicketQuery);
    return tickets
}
async function getUserTicketInfo(userId, userToken){
    const getUserIdQuery = `
    SELECT token
    FROM users
    WHERE id = $1
    `
    const userDBToken = await db.query(getUserIdQuery, [userId])
    
    if(userDBToken[0].token == userToken){
        const getTicketQuery = `
        SELECT users.id, users.name, order_tickets.order_items, order_tickets.progress
        FROM order_tickets FULL JOIN users
        ON order_tickets.user_id = users.id
        WHERE users.id = $1
    `
    const tickets = await db.query(getTicketQuery, [userId]);
    return tickets
    }
    
}

async function getOneTicket(id){
    const getTicketByIdQuery = `
    SELECT *
    FROM order_tickets FULL JOIN users
    on order_tickets.user_id = users.id
    WHERE order_tickets.id = $1
    `
    return await db.query(getTicketByIdQuery, [id])
}
// console.log('io',io)
const connectionSockets = {};
const connectionUserSockets = {};
io.on('connection', (client)=>{
    // console.log(client.handshake.address);
    let clientTimeoutName = `timeout.${client.handshake.address}`
    

    client.on('msg',(msg)=>{
        console.log(msg)
    })    
    connectionSockets[client.handshake.address] = {}
    connectionUserSockets[client.handshake.address] = {}
    client.on('sub-tickets',(token)=>{
        connectionSockets[client.handshake.address].timeInterval = setInterval(async ()=>{
            const tickets = await getTicketInfo()
            console.log(tickets)
            connectionSockets[client.handshake.address].tickets = tickets
            client.emit('ticket-info', tickets)
        },5000)
    })
    client.on(`sub-user-ticket`,([id,token])=>{
        connectionUserSockets[client.handshake.address].timeInterval = setInterval(async ()=>{
            console.log(id,token)
            const tickets = await getUserTicketInfo(id,token)
            connectionUserSockets[client.handshake.address].tickets = tickets
            client.emit('user-ticket-info', tickets)
        },5000)
    })
    
    client.on('need-ticket-info', async (id)=>{
        console.log('request recieved', id)
        const ticketData = await getOneTicket(id)
        client.emit('ticket-data', ticketData)
    })
    client.on('disconnect',()=>{
        console.log('unsubbing')
        if(connectionSockets[client.handshake.address] !== undefined){
            clearTimeout(connectionSockets[client.handshake.address].timeInterval)
            delete connectionSockets[client.handshake.address]
        }
        if(connectionUserSockets[client.handshake.address] !== undefined){
            clearTimeout(connectionUserSockets[client.handshake.address].timeInterval)
            delete connectionUserSockets[client.handshake.address]

        }
    })

})

module.exports = io 