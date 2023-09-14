



const board = [
    [' ', ' ', ' '],
    [' ', ' ', ' '],
    [' ', ' ', ' '],
  ];

 const boardTwo = Array.from({ length: 3 }, () => Array(3).fill(null)); 


 function winningMove(player:any){
    const WIN_CONDITIONS = [
        // rows
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        // cols
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        //diagonals
        [0, 4, 8], [2, 4, 6]

];
for (let i = 0; i < WIN_CONDITIONS.length; i++) {
  let firstIndex = WIN_CONDITIONS[i][0];
  let secondIndex = WIN_CONDITIONS[i][1];
  let thirdIndex = WIN_CONDITIONS[i][2];
  if(player.content[firstIndex] == player.content[secondIndex] &&
    player.content[firstIndex] == player.content[thirdIndex] &&
     player.content[firstIndex] != "") {
        player.isOver = true;
        //this.winner = this.content[firstIndex];
  }
}
 }
 module.exports = board

