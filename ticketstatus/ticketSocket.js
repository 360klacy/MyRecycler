const io = require('socket.io')()
const db = require("../db");

async function getTicketInfo(userToken){
    const getUserIdQuery = `
    SELECT id
    FROM users
    WHERE token = $1
    `
    const userId = await db.query(getUserIdQuery, [userToken])

    const getTicketQuery = `
    SELECT id, progress
    FROM order_tickets
    WHERE user_id = $1
    `
    const tickets = await db.query(getTicketQuery, [userId]);
    return tickets
}
// console.log('io',io)
const connectionSockets = {};
io.on('connection', (client)=>{
    console.log(client.handshake.address);
    let clientTimeoutName = `timeout.${client.handshake.address}`
    

    client.on('msg',(msg)=>{
        console.log(msg)
    })    
    connectionSockets[client.handshake.address] = {}
    client.on('sub-tickets',(token)=>{
        connectionSockets[client.handshake.address].timeInterval = setInterval(async ()=>{
            var tickets = await getTicketInfo(token)
            console.log(tickets)
            connectionSockets[client.handshake.address].tickets = tickets
            client.emit('ticket-info', tickets)
        },10000)
    })

    client.on('disconnect',()=>{
        console.log('unsubbing')
        clearTimeout(connectionSockets[client.handshake.address].timeInterval)
        delete connectionSockets[client.handshake.address]
    })

})

module.exports = io 