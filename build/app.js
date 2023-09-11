"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./config/db");
const users = require('./routes/users');
const auth = require('./routes/auth');
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/users', users);
app.use('/api/auth', auth);
const PORT = process.env.PORT || 5000;
(0, db_1.connectDB)();
app.use('/', (req, res) => {
    res.send('Hello world!');
});
app.listen(PORT, () => {
    console.log('SERVER IS UP ON PORT:', PORT);
});
