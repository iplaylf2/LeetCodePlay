/**
 * @param {character[][]} board
 * @return {boolean}
 */
var isValidSudoku = function(board) {
  const xSetMap = nineZero.slice(0),
    ySetMap = nineZero.slice(0),
    areaSetMap = nineZero.slice(0);

  for (var y = 0; y !== 9; y++) {
    for (var x = 0; x !== 9; x++) {
      const value = board[y][x];
      if (value !== ".") {
        const bit = 1 << value;

        if ((xSetMap[x] & bit) !== 0) {
          return false;
        }
        if ((ySetMap[y] & bit) !== 0) {
          return false;
        }
        const area = indexMap[y * 9 + x];
        if ((areaSetMap[area] & bit) !== 0) {
          return false;
        }

        xSetMap[x] |= bit;
        ySetMap[y] |= bit;
        areaSetMap[area] |= bit;
      }
    }
  }

  return true;
};

const nineZero = new Array(9).fill(0);
const indexMap = new Array(9 * 9).fill().map((_, i) => {
  const x = i % 9;
  const y = (i - x) / 9;
  return Math.floor(y / 3) * 3 + Math.floor(x / 3);
});
