const io = require('socket.io')()
const db = require("../db");

async function getTicketInfo(){
    const getTicketQuery = `
    SELECT users.id, users.address, users.name, order_tickets.order_items
    FROM order_tickets RIGHT JOIN users
    ON order_tickets.user_id = users.id
    `
    const tickets = await db.query(getTicketQuery);
    return tickets
}
async function getUserTicketInfo(userToken){
    const getUserIdQuery = `
    SELECT id
    FROM users
    WHERE token = $1
    `
    const userId = await db.query(getUserIdQuery, [userToken])

    const getTicketQuery = `
    SELECT users.id, users.address, users.name, order_tickets.order_items
    FROM order_tickets RIGHT JOIN users
    ON order_tickets.user_id = users.id
    WHERE users.id = $1
    `
    const tickets = await db.query(getTicketQuery, [userId[0].id]);
    return tickets
}
// console.log('io',io)
const connectionSockets = {};
io.on('connection', (client)=>{
    // console.log(client.handshake.address);
    let clientTimeoutName = `timeout.${client.handshake.address}`
    

    client.on('msg',(msg)=>{
        console.log(msg)
    })    
    connectionSockets[client.handshake.address] = {}
    client.on('sub-tickets',(token)=>{
        connectionSockets[client.handshake.address].timeInterval = setInterval(async ()=>{
            const tickets = await getTicketInfo()
            console.log(tickets)
            connectionSockets[client.handshake.address].tickets = tickets
            client.emit('ticket-info', tickets)
        },5000)
    })
    client.on(`sub-user-tickets`,(token)=>{
        connectionSockets[client.handshake.address].timeInterval = setInterval(async ()=>{
            const tickets = await getUserTicketInfo(token)
            console.log(tickets)
            connectionSockets[client.handshake.address].tickets = tickets
            client.emit('ticket-info', tickets)
        },5000)
    })
    client.on('disconnect',()=>{
        console.log('unsubbing')
        connectionSockets[client.handshake.address] !== undefined ? clearTimeout(connectionSockets[client.handshake.address].timeInterval) : null
        delete connectionSockets[client.handshake.address]
    })

})

module.exports = io 