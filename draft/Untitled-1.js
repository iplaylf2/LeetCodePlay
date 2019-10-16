/**
 * @param {character[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 */
var solveSudoku = function(board) {
  const rowArray = nineNull.concat(0).map(() => new Bar()),
    columnArray = nineNull.concat().map(() => new Bar()),
    boxArray = nineNull.concat().map(() => new Box()),
    /**
     * @type {White[]}
     */
    whiteArray = [];
};

/**
 * @param {character[][]} board
 */
const firstScan = function(board) {
  for (var y = 0; y !== 9; y++) {
    for (var x = 0; x !== 9; x++) {
      const value = board[y][x];
      if (value === ".") {
      } else {
      }
    }
  }
};

class Option {
  constructor() {
    this.bit = 1;
    this.length = 9;
  }

  /**
   * @param {number} digit
   */
  reduce(digit) {
    this.bit |= 1 << digit;
    this.length--;
  }

  hasUniqueIndex() {
    return this.length === 1;
  }

  getUniqueIndex() {
    return Math.log2(this.bit ^ 0b11_1111_1111);
  }
}

class Existing {
  constructor() {
    this.bit = 0;
    /**
     * @type {number[]}
     */
    this.list = [];
  }

  /**
   * @param {number} digit
   */
  record(digit) {
    this.bit |= 1 << digit;
    this.list.push(digit);
  }

  /**
   * @param {number} digit
   */
  recordWithCheck(digit) {
    const digitBit = 1 << digit;
    if ((this.bit & digitBit) === 0) {
      this.bit |= digitBit;
      this.list.push(digit);
    }
  }

  get length() {
    return this.list.length;
  }
}

class Exclusion {
  constructor() {
    this.bit = 0;
    this.length = 0;
  }

  /**
   * @param {number} index
   */
  record(index) {
    this.bit |= 1 << index;
    this.length++;
  }

  /**
   * @param {number} index
   */
  recordWithCheck(index) {
    const indexBit = 1 << index;
    if ((this.bit & indexBit) === 0) {
      this.bit |= indexBit;
      this.length++;
    }
  }

  /**
   *
   * @param {number} a
   * @param {number} b
   * @param {number} c
   */
  checkBar(a, b, c) {
    const indexBit = ((1 << a) + (1 << b) + (1 << c)) ^ 0b1_1111_1111;
    if ((this.bit & indexBit) === indexBit) {
      return true;
    } else {
      return false;
    }
  }

  hasUniqueIndex() {
    return this.length === 8;
  }

  getUniqueIndex() {
    return Math.log2(this.bit ^ 0b1_1111_1111);
  }
}

class Bar {
  constructor() {
    this.existing = new Existing();
    /**
     * @type {Map<number,Exclusion>}
     */
    this.exclusionMap = new Map();
  }
}

class Box {
  constructor() {
    this.existing = new Existing();
    /**
     * @type {Map<number,Exclusion>}
     */
    this.exclusionMap = new Map();
  }
}

class White {
  /**
   *
   * @param {number} x
   * @param {number} y
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

const nineZero = new Array(9).fill(0);
const nineNull = new Array(9).fill(null);
const boxMap = nineNull
  .concat()
  .map((_, y) =>
    nineZero.concat().map((_, x) => Math.floor(y / 3) * 3 + Math.floor(x / 3))
  );
