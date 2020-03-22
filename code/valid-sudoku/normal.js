/**
 * @param {character[][]} board
 * @return {boolean}
 */
var isValidSudoku = function(board) {
  const columnRecord = nineZero.slice(),
    rowRecord = nineZero.slice(),
    roomRecord = nineZero.slice();

  for (var y = 0; y !== 9; y++) {
    for (var x = 0; x !== 9; x++) {
      const value = board[y][x];
      if (value !== ".") {
        const r = roomMap[y * 9 + x];
        const bit = 1 << value;
        const bitmap = columnRecord[x] | rowRecord[y] | roomRecord[r];

        if ((bitmap & bit) !== 0) {
          return false;
        }

        columnRecord[x] |= bit;
        rowRecord[y] |= bit;
        roomRecord[r] |= bit;
      }
    }
  }

  return true;
};

const nineZero = new Array(9).fill(0);
const roomMap = new Array(9 * 9).fill().map((_, i) => {
  const x = i % 9;
  const y = (i - x) / 9;
  return Math.floor(y / 3) * 3 + Math.floor(x / 3);
});
