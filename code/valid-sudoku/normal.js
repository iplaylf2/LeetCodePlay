/**
 * @param {character[][]} board
 * @return {boolean}
 */
var isValidSudoku = function(board) {
  const xSetMap = nineNull.concat().map(() => tenFalse.concat()),
    ySetMap = nineNull.concat().map(() => tenFalse.concat()),
    areaSetMap = nineNull.concat().map(() => tenFalse.concat());

  for (var y = 0; y !== 9; y++) {
    for (var x = 0; x !== 9; x++) {
      const value = board[y][x];
      if (value !== ".") {
        const xSet = xSetMap[x];
        if (xSet[value]) {
          return false;
        }
        const ySet = ySetMap[y];
        if (ySet[value]) {
          return false;
        }
        const areaSet = areaSetMap[indexMap[y][x]];
        if (areaSet[value]) {
          return false;
        }
        xSet[value] = true;
        ySet[value] = true;
        areaSet[value] = true;
      }
    }
  }

  return true;
};

const nineNull = new Array(9).fill(null);
const nineZero = new Array(9).fill(0);
const indexMap = nineNull.map((_, y) =>
  nineZero.concat().map((_, x) => Math.floor(y / 3) * 3 + Math.floor(x / 3))
);

const tenFalse = new Array(10).fill(false);
