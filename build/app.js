"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./config/db");
const users = require('./routes/users');
const auth = require('./routes/auth');
const players = {};
const games = {};
const express = require('express');
const app = express();
app.set('port', '80');
const server = require('http').Server(app);
const io = require('./models/socketcommunication').init(server);
const path = require('path');
const game = require('./routes/game');
app.use(express.json());
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/game', game);
(0, db_1.connectDB)();
io.on('connect', function (socket) {
    console.log('Client connected...');
    socket.on('join', function (data) {
        console.log(data);
    });
});
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});
