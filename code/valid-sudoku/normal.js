/**
 * @param {character[][]} board
 * @return {boolean}
 */
var isValidSudoku = function(board) {
  const xSetMap = nineZero.concat(),
    ySetMap = nineZero.concat(),
    areaSetMap = nineZero.concat();

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
        const area = indexMap[y][x];
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
const indexMap = new Array(9)
  .fill(null)
  .map((_, y) =>
    nineZero.concat().map((_, x) => Math.floor(y / 3) * 3 + Math.floor(x / 3))
  );
