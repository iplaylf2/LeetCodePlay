/**
 * @param {character[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 */
var solveSudoku = function(board) {};

const $9zero = new Array(9).fill(0);
const $9item = new Array(9).fill(null);
const indexMap = $9item.map((_, y) =>
  $9zero.map((_, x) => Math.floor(y / 3) * 3 + Math.floor(x / 3))
);

//cell排除，cell的可选项被一步步排除至最后一项，就是cell的值。
class UnitExclusive {
  constructor() {
    this.bitmap = 0b1111111110;
    this.length = 9;
  }

  push(digit) {
    const digitBit = 1 << digit;
    if (this.bitmap & digitBit) {
      this.bitmap ^= digitBit;
      this.length--;
      return length === 1 ? Math.log2(this.bitmap) : NaN;
    } else {
      return NaN;
    }
  }
}

class Cell extends UnitExclusive {
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
  }
}

//block排除，block有9个cell，如一个数在其他八个cell中被排除，另外一个cell的值就是该数。
class Block {
  constructor() {
    this.waitingValue = $9item.map(() => new UnitExclusive());
  }

  push(value, position) {
    const waiting = this.waitingValue[value];
    if (waiting === null) {
      return NaN;
    } else {
      return waiting.push(position);
    }
  }
}
