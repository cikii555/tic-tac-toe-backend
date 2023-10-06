"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cors = require('cors');
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
const corsOptions = {
    origin: '*',
    methods: 'GET, POST, PUT, DELETE',
    exposedHeaders: 'X-Auth-Token',
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(function (request, response, next) {
    request.io = io;
    next();
});
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/game', game);
app.set('socketIO', io);
(0, db_1.connectDB)();
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});
