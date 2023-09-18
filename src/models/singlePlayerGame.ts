const { winnigMove} = require('./board')
const Game = require('../models/gameModel')
 boardTicTacToe = require('./board')

const playerMoves = []

const WinEnum = {
    DRAW: 'DRAW',
    X_WINNER: 'X_WINNER',
    O_WINNER: 'O_WINNER',
  };


async function gamePlaying(type:string,row:number,column:number,gameId:any){
    if (calculateTie(boardTicTacToe)){
        
         return  WinEnum.DRAW
    }
    else if (winnigMove(boardTicTacToe)!= ' '){
        if( winnigMove(boardTicTacToe)==='X'){
             return  WinEnum.X_WINNER
        }
        else{
           return  WinEnum.O_WINNER
        }
    }
    var game  = await Game.findOne({_id:gameId})
    getPlayerMove(type,row,column,game)
}
function getPlayerMove(type:string, row:number, column:number,game:any){
    if (type == "SINGLE_PLAYER"){
        
        if(game.turn){
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
    game.turn  = !game.turn
    await game.save()
}


async function makeMove(row:number, col:number,symbol:string,game:any){
    if(boardTicTacToe[row][col]==' '){
        boardTicTacToe[row][col] = symbol
        playerMoves.push({row,col})
    }
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

