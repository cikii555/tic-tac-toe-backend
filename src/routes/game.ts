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
    try {
        const game = new Game({
            started: false
        });
        await game.save();

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        res.write(`data: ${JSON.stringify({ gameId: game._id, started: false })}\n\n`);

        const intervalId = setInterval(async () => {
            const updatedGame = await Game.findById(game._id);
            if (updatedGame.started) {
                clearInterval(intervalId);
                res.write(`data: ${JSON.stringify({ started: true })}\n\n`);
            }
        }, 1000);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating the game');
    }
});
router.get('/check-start',async (req:any,res:Response)=>{
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
    game.started = true
    game.save()
    res.send("pocea igra")
    res.send(game)
   



})


module.exports = router

