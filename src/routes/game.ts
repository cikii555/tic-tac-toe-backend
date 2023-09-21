import { Request, Response } from "express"
import { Socket } from "socket.io"
const express = require('express')
const router = express.Router()
const Game = require('../models/gameModel')
const {winningMove} = require('../models/board')
const { v4: uuidv4 } = require('uuid');
const io = require('../models/socketcommunication').get();
const { boardTicTacToe } = require('../models/board')
const players: { [key: string]: any } = {}
const games: {[key:string]:any} = {}
const playerMoves = []

io.on('connect',function(socket:Socket){
    console.log('Client connected')
socket.on("make.move", async(data:any)=>{
    if (calculateTie(data.dashboard)){
        socket.emit("tie",games[data.gameId].dashboard)
        socket.to(data.gameId).emit("tie",games[data.gameId].dashboard)
        
    }
    else if (winningMove(data.dashboard)!= ' '){
        
        if( winningMove(data.dashboard)==='X'){
            socket.to(data.gameId).emit("x_win",games[data.gameId].dashboard)
             
        }
        else{
            socket.to(data.gameId).emit("o_win",games[data.gameId].dashboard)
           
        }
    }
    var game  = await Game.findOne({_id:data.gameId})
   
   getPlayerMove(data.type,data.row,data.column,game,data.dashboard,socket)

})
  
function getPlayerMove(type:string, row:number, column:number,game:any,dashboard:any,socket:any){
    if (type == "SINGLE_PLAYER"){
        
        if(game.turn){
            console.log(games[game._id])
            makeMove(row,column,"X",game,dashboard,socket)
            
        }
        else{
            move(game,dashboard)
           
            
        }
    }
    else{
        
        if (game.turn){
            
            makeMove(row,column,"X",game,dashboard,socket)
        }
        else{
           
            makeMove(row,column, "O",game,dashboard,socket)
        }
    }
}
async function move(game:any,dashboard:any){
    const emptyPositions = []
    for (let row = 0; row < dashboard.length; row++) {
        for (let col = 0; col < dashboard[row].length; col++) {
            if (dashboard[row][col] === ' ') {
            emptyPositions.push({ row, col });
            }
        }
    }
    const randomIndex = Math.floor(Math.random() * emptyPositions.length);
    const randomPosition = emptyPositions[randomIndex];
    dashboard[randomPosition.row][randomPosition.col]= "O"
    io.in(game._id).emit("move.made",{
        dashboard: games[game._id].dashboard,
        gameId: game._id
    })
    game.turn  = !game.turn
    await game.save()
}


async function makeMove(row:number, col:number,symbol:string,game:any, dashboard:any,socket:any){
    if(dashboard[row][col]==' '){
        dashboard[row][col] = symbol
        playerMoves.push({row,col})
    }
    socket.in(game._id).emit("move.made",{
        dashboard: games[game._id].dashboard,
        gameId: game._id
    })
    game.turn  = !game.turn
    await game.save()
    

}
function calculateTie(board:any){
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            if (board[row][col] === ' ') {
                return false
            }
        }
    return  true
  }
}

function resetBoardTicTacToe(board:any) {
    for (let row=0; row<= board.length; row++) {
      for (let col = 0; col < board[row].length; col++){
        boardTicTacToe[row][col] = ' '
      }
    }
  }

/*io.on("disconnect", function () {
    
    if (io.room != null) {
        io.emit("quit");
        io.in(io.room.toString()).emit("quit");
        delete games[io.room];
    }
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
        //io.on('connect',(socket:Socket)=>{
        games[game._id] = { gameId:game._id, players: [socket.id], state: 'waiting', dashboard:boardTicTacToe,type:"MULTI_PLAYER" };
       
        socket.join(game._id)
        console.log(games[game._id])
        io.to(game._id).emit("game.join");
          //})
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
   // io.on('connect',(socket:Socket)=>{
        if (games[game._id] && games[game._id].state === 'waiting') {
            games[game._id].players.push(socket.id);
            socket.join(game._id); 
            socket
            .to(game._id)
            .emit('game.start', {dashboard:games[game._id].dashboard, players:games[game._id].players,
            gameId: games[game._id].gameId, type:games[game._id].type});
            
         
        } else {
          socket.emit('gameNotFound');
        }
   // })
   
    
    res.send(game)

});
})

module.exports = router
module.exports.games = games
