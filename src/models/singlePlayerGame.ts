const boardTicTacToe = require('./board')

const playerMoves = []
const isTie = false
/*socket.on("game.begin", function(data) {
    symbol = data.symbol; // The server is assigning the symbol
    myTurn = symbol === "X"; // 'X' starts first
    renderTurnMessage();
});*/

function startGame(){
    var playerOne = {symbol:"X", type:"human"}
    var AiPlayer = {symbol:"O",type:"ai"}
}
function gamePlaying(){

}
function getPlayerMove(type:string){
    if (type != "ai"){
       // makeMove(1,1)
    }
    else{
        //AIMove()
    }
}
module.exports = function AIMove(){
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
console.log(randomPosition)
board[randomPosition.row][randomPosition.col]= "O"
console.log(board)
}

function getPlayerPosition(){

}

module.exports = function makeMove(row:number, col:number){
    if(boardTicTacToe[row][col]==' '){
        boardTicTacToe[row][col] = "X"
        playerMoves.push({row,col})
    }
    console.log(board)

}
function calculateTie(){
    for (let row = 0; row < boardTicTacToe.length; row++) {
        for (let col = 0; col < boardTicTacToe[row].length; col++) {
            if (boardTicTacToe[row][col] === ' ') {
                return
            }
        }
    //this.isTie = true
  }
}

