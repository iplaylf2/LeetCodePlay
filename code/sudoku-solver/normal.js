/**
 * @param {character[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 */
var solveSudoku = function (board) {
  const rowMarkMap = $9Zero.slice(),
    columnMarkMap = $9Zero.slice(),
    blockMarkMap = $9Zero.slice();

  const blankList = [];

  for (var r = 0; r !== 9; r++) {
    for (var c = 0; c !== 9; c++) {
      const index = r * 9 + c;

      const digit = board[r][c];
      if (digit === ".") {
        blankList.push(index);
      } else {
        const b = index$block[index];

        const bit = 1 << digit;

        rowMarkMap[r] |= bit;
        columnMarkMap[c] |= bit;
        blockMarkMap[b] |= bit;
      }
    }
  }

  const $length = blankList.length;
  
  const digitList = new Array($length).fill(0);

  for (var i = 0; i !== $length; ) {
    const index = blankList[i];

    const r = index$row[index],
      c = index$column[index],
      b = index$block[index];

    const bitmap = rowMarkMap[r] | columnMarkMap[c] | blockMarkMap[b];

    for (
      var digit = digitList[i] + 1, bit = 0b1 << digit;
      digit !== 10;
      digit++, bit = bit << 1
    ) {
      if ((bitmap & bit) === 0) {
        break;
      }
    }

    if (digit === 10) {
      digitList[i] = 0;
      i--;

      const index = blankList[i];
      const digit = digitList[i];
      const bit = 0b1 << digit;

      const r = index$row[index],
        c = index$column[index],
        b = index$block[index];

      rowMarkMap[r] ^= bit;
      columnMarkMap[c] ^= bit;
      blockMarkMap[b] ^= bit;
    } else {
      digitList[i] = digit;
      i++;

      rowMarkMap[r] |= bit;
      columnMarkMap[c] |= bit;
      blockMarkMap[b] |= bit;
    }
  }

  for (var i = 0; i !== $length; i++) {
    const index = blankList[i];
    const digit = digitList[i];

    const r = index$row[index],
      c = index$column[index];

    board[r][c] = String(digit);
  }
};

const $9Zero = new Array(9).fill(0);
const $9X9Zero = new Array(9 * 9).fill(0);

const index$row = $9X9Zero.slice(),
  index$column = $9X9Zero.slice(),
  index$block = $9X9Zero.slice();

for (var r = 0; r !== 9; r++) {
  for (var c = 0; c !== 9; c++) {
    const b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
    const index = r * 9 + c;
    index$row[index] = r;
    index$column[index] = c;
    index$block[index] = b;
  }
}
