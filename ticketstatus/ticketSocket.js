const io = require('socket.io')()
const db = require("../db");

function getTicketInfo(ticketNumber){
    
}
// console.log('io',io)
io.on('connection', (client)=>{
    console.log(client.handshake)
    client.on('msg',(msg)=>{
        console.log(msg)
    })
})

module.exports = io 