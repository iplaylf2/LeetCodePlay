/**
 * @param {character[][]} board
 * @return {boolean}
 */
var isValidSudoku = function(board) {
  const columnValueMap = nineZero.slice(),
    rowValueMap = nineZero.slice(),
    blockValueMap = nineZero.slice();

  for (var r = 0; r !== 9; r++) {
    for (var c = 0; c !== 9; c++) {
      const digit = board[r][c];
      if (digit !== ".") {
        const b = roomMap[r * 9 + c];
        const bit = 1 << digit;
        const bitmap = columnValueMap[c] | rowValueMap[r] | blockValueMap[b];

        if ((bitmap & bit) !== 0) {
          return false;
        }

        columnValueMap[c] |= bit;
        rowValueMap[r] |= bit;
        blockValueMap[b] |= bit;
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
