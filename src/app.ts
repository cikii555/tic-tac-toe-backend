import { createServer } from "http";
import { Server, Socket } from "socket.io";
const { v4: uuidv4 } = require('uuid');
import { connectDB } from './config/db'
const users = require('./routes/users')
const auth = require('./routes/auth')
const game = require('./routes/game')
const players:{[key:string]:any} ={}
const games: { [key: string]: any } = {};



const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');
app.use(express.json())
app.use('/api/users', users)
app.use('/api/auth', auth)



connectDB()

app.get("/", (req:any, res:any) => {
    res.sendFile(path.join(__dirname, "index.html"));
});


io.on('connection', (socket:Socket) => {

    socket.on('joinGame', (gameId) => {
        
        if (games[gameId] && games[gameId].state === 'waiting') {
            
            games[gameId].players.push(socket.id);
            socket.join(gameId); 
            io.to(gameId).emit('playerJoined', socket.id);
            
         
        } else {
          socket.emit('gameNotFound');
        }
      });
      socket.on('createGame', msg => {
        const gameId = uuidv4(); 
        games[gameId] = { players: [socket.id], state: 'waiting' };
        socket.emit('gameCreated', gameId);
      });
    
});

server.listen(80);


