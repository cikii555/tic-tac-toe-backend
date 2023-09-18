import {Request, Response} from "express"
import {Socket} from "socket.io"
const express = require('express')
const router = express.Router()
const Game = require('../models/gameModel')
const Events = require('events')
const myEmitter = new Events();
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
router.get('/multiplayer', async (req: Request, res: Response) => {

        const game = new Game({
            started: false,
            players: 1,
        });
        await game.save()
        res.send(game._id)
})
router.post('/check-start',async (req:any,res:Response)=>{
    const intervalId = setInterval(async () => {
        const updatedGame = await Game.findById(req.body.id);
        if (updatedGame.started) {
            clearInterval(intervalId);
            res.send(true)
        }
    }, 1000);
})
router.post('/join-game',async(req:Request,res:Response)=>{
    let game = await Game.findOne({_id:req.body.id})
    if (game.players === 2){
        res.send('You cant join game')
    }
    game.started = true
    game.players = 2
   await game.save()
    res.send(game)
   



})


module.exports = router

