const { winnigMove} = require('./board')
 boardTicTacToe = require('./board')
const playerMoves = []
var turn = true
const WinEnum = {
    DRAW: 'DRAW',
    X_WINNER: 'X_WINNER',
    O_WINNER: 'O_WINNER',
  };


function gamePlaying(type:string,row:number,column:number){
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
    getPlayerMove(type,row,column)
}
function getPlayerMove(type:string, row:number, column:number){
    if (type == "SINGLE_PLAYER"){
        if(turn){
            makeMove(row,column,"X")
        }
        else{
            move()
        }
    }
    else{
        if (turn){
            makeMove(row,column,"X")
        }
        else{
            makeMove(row,column, "O")
        }
    }
}
function move(){
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
    turn  = !turn
}


function makeMove(row:number, col:number,symbol:string){
    if(boardTicTacToe[row][col]==' '){
        boardTicTacToe[row][col] = symbol
        playerMoves.push({row,col})
    }
    turn = !turn
    

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

