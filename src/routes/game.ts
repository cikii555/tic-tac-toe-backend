import { Request, Response } from "express"
const express = require('express')
const router = express.Router()
const Game = require('../models/gameModel')
const Events = require('events')
const { v4: uuidv4 } = require('uuid');
const io = require('../models/socketcommunication').get();

const players: { [key: string]: any } = {}
const gamesMultiPlayer: { [key: string]: any } = {};
const gamesSinglePlayer: {[key:string]:any} = {}
const games: {[key:string]:any} = {}


router.get('/single-player', async (req: Request, res: Response) => {
    let game = new Game({
        started: true,
        turn: true,
        playerOne:"123456789"
    })
    game.save()
    res.send(game)
    
    games[game._id] = { players: [game.playerOne], state: 'waiting' };
    io.join(game._id)
    io.to(game._id).emit("game.begin");
   


})


router.get('/multiplayer', async (req: Request, res: Response) => {
   
    const game = new Game({
        started: false,
        players: 1,
        turn: true,
        playerOne:"5555555"
    });
    await game.save()
    games[game._id] = {players :[game.playerOne],state:'waiting'}
    io.join(game._id)
    res.send(game._id)
    
})

router.post('/join-game', async (req: Request, res: Response) => {
    let game = await Game.findOne({ _id: req.body.id })
    if (game.players === 2) {
        res.send('You cant join game')
    }

    game.started = true
    game.players = 2
    await game.save()
   /* if (games[game._id] && games[game._id].state === 'waiting') {

            games[game._id].players.push(socket.id);
            socket.join(gameId); 
            io.to(gameId).emit('playerJoined', socket.id);
            
         
        } else {
          socket.emit('gameNotFound');
        }*/
    
    res.send(game)

});


module.exports = router

