
var boardTicTacToe = [
  [' ', ' ', ' '],
  [' ', ' ', ' '],
  [' ', ' ', ' '],
];

const boardTwo = Array.from({ length: 3 }, () => Array(3).fill(null));


function winningMove(board: any) {

  if (winningGameByRow(board) != ' ') {
    return winningGameByRow(board)
  }
  else if (winningGameByColumn(board) != ' ') {
    return  winningGameByColumn(board)
  }
  else if (winningGameByDiagonal(board) != ' ') {
    return  winningGameByDiagonal(board)
  }
  return ' '


}

function winningGameByRow(board: any) {
  //winning moves by rows 
  for (let row = 0; row < 3; row++) {
    let firstIndex = board[row][0]
    let secondIndex = board[row][1]
    let thirdIndex = board[row][2]
    if (firstIndex == secondIndex && thirdIndex == firstIndex && firstIndex != ' ') {
      return firstIndex;
    }
  }
  return ' ';
}
function winningGameByColumn(board: any) {
  //winning moves by columns
  for (let col = 0; col < 3; col++) {
    let firstIndex = board[0][col]
    let secondIndex = board[1][col]
    let thirdIndex = board[2][col]
    if (firstIndex == secondIndex && firstIndex == thirdIndex && firstIndex != ' ') {
      return firstIndex;
    }
  }
  return ' ';
}
function winningGameByDiagonal(board: any) {
  if (board[0][0] == board[1][1] && boardTicTacToe[0][0] == board[2][2] && board[0][0] != ' ') {
    return board[1][1]
  }
  else if (board[0][2] == board[1][1] && board[1][1] == board[2][0] && board[1][1] != ' ') {
    return board[1][1]
  }
  return ' '

}
module.exports = {
  boardTicTacToe,
  winningMove
}


