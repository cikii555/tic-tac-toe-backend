import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import { ConnectOptions } from 'mongoose';
import {connectDB} from './config/db'
var User = require('./models/users')
const app: Application = express();


const PORT= process.env.PORT || 5000;

connectDB()

app.use('/', (req: Request, res: Response): void => {
    res.send('Hello world!');
});


app.listen(PORT, (): void => {
    console.log('SERVER IS UP ON PORT:', PORT);
    
});