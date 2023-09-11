import express, { Application, Request, Response } from 'express';

import mongoose from 'mongoose';
import { ConnectOptions } from 'mongoose';
import {connectDB} from './config/db'
const users = require('./routes/users')
const auth = require('./routes/auth')
const app: Application = express();

app.use(express.json())
app.use('/api/users',users)
app.use('/api/auth',auth)
const PORT= process.env.PORT || 5000;

connectDB()

app.use('/', (req: Request, res: Response): void => {
    res.send('Hello world!');
});


app.listen(PORT, (): void => {
    console.log('SERVER IS UP ON PORT:', PORT);
    
});