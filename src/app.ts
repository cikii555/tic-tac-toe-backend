import { createServer } from "http";
import { Server, Socket } from "socket.io";
const cors = require('cors'); 
import { connectDB } from './config/db'
import { NextFunction } from "express";
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
const corsOptions = {
    origin: '*', 
    methods: 'GET, POST, PUT, DELETE',
    exposedHeaders: 'X-Auth-Token', 
  };
  declare global {
    namespace Express {
        interface Request {
            admin: any;
            io: Server; // Server is coming from the import
        }
    }
}
app.use(cors(corsOptions));
app.use(express.json())
app.use(function (request:any, response:any, next:any) {
  request.io = io;
  next();
});
app.use('/api/users', users)
app.use('/api/auth', auth)
app.use('/api/game',game)
app.set('socketIO',io)

connectDB()


app.get("/", (req:any, res:any) => {
    res.sendFile(path.join(__dirname, "index.html"));
});








