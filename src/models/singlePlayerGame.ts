import { Socket } from "socket.io";

const { winnigMove} = require('./board')
const Game = require('../models/gameModel')
 io = require('../models/socketcommunication').get();
 boardTicTacToe = require('./board')
 const games = require('../routes/game')

const playerMoves = []

const WinEnum = {
    DRAW: 'DRAW',
    X_WINNER: 'X_WINNER',
    O_WINNER: 'O_WINNER',
  };

io.on("make.move",async (data:any,socket:Socket)=>{

    
    if (calculateTie(boardTicTacToe)){
        console.log('ss')
        io.emit("tie",games[data.gameId].dashboard)
        io.to(data.gameId).emit("tie",games[data.gameId].dashboard)
        
    }
    else if (winnigMove(boardTicTacToe)!= ' '){
        if( winnigMove(boardTicTacToe)==='X'){
            io.emit(data.gameId).emit("x_win",games[data.gameId].dashboard)
             
        }
        else{
            io.emit(data.gameId).emit("o_win",games[data.gameId].dashboard)
           
        }
    }
    var game  = await Game.findOne({_id:data.gameId})
    
    getPlayerMove(data.type,data.row,data.column,game)

})
function getPlayerMove(type:string, row:number, column:number,game:any){
    if (type == "SINGLE_PLAYER"){
        
        if(game.turn){
            console.log(games[game._id])
            makeMove(row,column,"X",game)
            
        }
        else{
            move(game)
           
            
        }
    }
    else{
        if (game.turn){
            makeMove(row,column,"X",game)
        }
        else{
            makeMove(row,column, "O",game)
        }
    }
}
async function move(game:any){
    const emptyPositions = []
    for (let row = 0; row < boardTicTacToe.length; row++) {
        for (let col = 0; col < boardTicTacToe[row].length; col++) {
            if (boardTicTacToe[row][col] === ' ') {
            emptyPositions.push({ row, col });
            }
        }
    }
    const randomIndex = Math.floor(Math.random() * emptyPositions.length);
    const randomPosition = emptyPositions[randomIndex];
    boardTicTacToe[randomPosition.row][randomPosition.col]= "O"
    io.to(game._id).emit("move.made",{
        dashboard: games[game._id].dashboard,
        gameId: game._id
    })
    game.turn  = !game.turn
    await game.save()
}


async function makeMove(row:number, col:number,symbol:string,game:any){
    
    if(boardTicTacToe[row][col]==' '){
        boardTicTacToe[row][col] = symbol
        playerMoves.push({row,col})
    }
    io.to(game._id).emit("move.made",{
        dashboard: games[game._id].dashboard,
        gameId: game._id
    })
    game.turn  = !game.turn
    await game.save()
    

}
function calculateTie(board:any){
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            if (boardTicTacToe[row][col] === ' ') {
                return false
            }
        }
    return  true
  }
}

function resetBoardTicTacToe() {
    for (let row=0; row<= boardTicTacToe.length; row++) {
      for (let col = 0; col < boardTicTacToe[row].length; col++){
        boardTicTacToe[row][col] = ' '
      }
    }
  }

io.on("disconnect", function () {
    // Remove the lobby and emit 'quit'
    if (io.lobby != null) {
        io.emit("quit");
        io.in(io.lobby.toString()).emit("quit");
        delete games[io.lobby];
    }
});
