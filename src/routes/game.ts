import { Request, Response } from "express"
import { Socket } from "socket.io"
const express = require('express')
const router = express.Router()
const Game = require('../models/gameModel')
const Events = require('events')
const { v4: uuidv4 } = require('uuid');
const io = require('../models/socketcommunication').get();
const { boardTicTacToe } = require('../models/board')
const players: { [key: string]: any } = {}
const games: {[key:string]:any} = {}

/*io.on('connect', function (socket:Socket) {
    console.log('Client connected...');
  
    
  });*/
  /*io.on('connect', function (socket:Socket) {
    console.log('Client connected...');
    socket.join(game._id)
    //console.log(games[game._id])
    socket.to(game._id).emit('join')
    
  });*/
router.get('/single-player', async (req: Request, res: Response) => {
    let game = new Game({
        started: true,
        turn: true,
        type:"SINGLE_PLAYER"
        
    })
    game.save()
    res.send(game)
    io.on('connect',function(socket:Socket){

        games[game._id] = {gameId:game._id,
             players: [socket.id], state: 'waiting', dashboard:boardTicTacToe, type:"SINGLE_PLAYER" };
        console.log(games[game._id])
        socket.join(game._id)
        io.to(game._id).emit("game.start");
    })
   
   


})


router.get('/multiplayer', async (req: Request, res: Response) => {
   
    const game = new Game({
        started: false,
        players: 1,
        turn: true,
        type:"MULTI_PLAYER"
      
    });
    
    await game.save()
        io.on('connect',(socket:Socket)=>{
        games[game._id] = { gameId:game._id, players: [socket.id], state: 'waiting', dashboard:boardTicTacToe,type:"MULTI_PLAYER" };
       
        socket.join(game._id)
        console.log(games[game._id])
        io.to(game._id).emit("game.join");
          })
    res.send(game)
    
})

router.post('/join-game', async (req: Request, res: Response) => {
    let game = await Game.findOne({ _id: req.body.id })
    if (game.players === 2) {
        res.send('You cant join game')
    }

    game.started = true
    game.players = 2
    await game.save()
    io.on('connect',(socket:Socket)=>{
        if (games[game._id] && games[game._id].state === 'waiting') {
            console.log(games[game._id])
            games[game._id].players.push(socket.id);
            socket.join(game._id); 
            console.log(games[game._id])
            io.to(game._id).emit('game.start', {game:games[game._id]});
            
         
        } else {
          io.emit('gameNotFound');
        }
    })
   
    
    res.send(game)

});


module.exports = router
module.exports.games = games
