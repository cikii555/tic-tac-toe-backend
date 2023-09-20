import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { connectDB } from './config/db'
const users = require('./routes/users')
const auth = require('./routes/auth')

const players:{[key:string]:any} ={}
const games: { [key: string]: any } = {};
const express = require('express');
const app = express();
app.set('port', '80');
const server = require('http').Server(app);

const io = require('./models/socketcommunication').init(server);
const path = require('path');

const game = require('./routes/game')

app.use(express.json())
app.use('/api/users', users)
app.use('/api/auth', auth)
app.use('/api/game',game)

connectDB()

/*io.on('connect', function (socket:Socket) {
  console.log('Client connected...');

  socket.on('join', function (data:any) {
      console.log(data);
  });
});*/
app.get("/", (req:any, res:any) => {
    res.sendFile(path.join(__dirname, "index.html"));
});








