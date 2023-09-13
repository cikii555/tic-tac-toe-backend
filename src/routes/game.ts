import {Request, Response} from "express"
import {Socket} from "socket.io"
const express = require('express')
const router = express.Router()
const Game = require('../models/gameModel')
const { v4: uuidv4 } = require('uuid');
const socketIO = require('socket.io')
const io = require('../app')

const players:{[key:string]:any} ={}
const games: { [key: string]: any } = {};

router.get('/single-player', async(req:Request,res:Response)=>{
    let game = new Game({
        started:true
    })
    game.save()

    res.send(game)
    
})




