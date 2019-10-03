const io = require('../bin/www');
const db = require("../db");

io.on('connection', (client)=>{
    console.log(client.handshake)
    const getTicket = 
})