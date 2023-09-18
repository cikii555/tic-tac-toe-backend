import { createServer } from "http";
import { Server, Socket } from "socket.io";
const { v4: uuidv4 } = require('uuid');
import { connectDB } from './config/db'
const users = require('./routes/users')
const auth = require('./routes/auth')
const game = require('./routes/game')
const players:{[key:string]:any} ={}
const games: { [key: string]: any } = {};

var getIOInstance = function(){
  return io;
};

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');
app.use(express.json())
app.use('/api/users', users)
app.use('/api/auth', auth)
app.use('/api/game',game)



connectDB()

app.get("/", (req:any, res:any) => {
    res.sendFile(path.join(__dirname, "index.html"));
});




server.listen(80);


