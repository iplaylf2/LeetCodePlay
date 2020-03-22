/**
 * @param {character[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 */
var solveSudoku = function(board) {
  const sudokuState = SudokuState.create(board);
  const complete = sudokuState.reasoningReliably();
  if (complete) {
    sudokuState.fill(board);
    return;
  }

  const snapshotList = [];
  var dilemma = sudokuState;

  while (true) {
    const [available, explore] = dilemma.guess();

    if (!available) {
      dilemma = snapshotList.pop();
      continue;
    }

    switch (explore.reasoning()) {
      case "complete":
        explore.fill(board);
        return;
      case "incomplete":
        snapshotList.push(dilemma);
        dilemma = explore;
        break;
      case "wrong":
        break;
    }
  }
};

class SudokuState {
  static create(board) {
    const flatBoard = $9X9Zero.slice();
    const blankSet = new Set();
    const validator = Validator.create();

    for (var y = 0; y !== 9; y++) {
      for (var x = 0; x !== 9; x++) {
        const digit = board[y][x];
        const index = y * 9 + x;

        if (digit === ".") {
          blankSet.add(index);
          continue;
        }

        flatBoard[index] = digit;
        const r = roomMap[index];
        const bit = 1 << digit;

        validator.record(x, y, r, bit);
      }
    }

    const exclusiveDigit = ExclusiveDigit.create();
    const exclusiveCell = ExclusiveCell.create();

    return new SudokuState(
      flatBoard,
      blankSet,
      validator,
      exclusiveDigit,
      exclusiveCell
    );
  }

  constructor(board, blankSet, validator, exclusiveDigit, exclusiveCell) {
    /**
     * @type {number[]}
     */
    this.board = board;
    /**
     * @type {number[]}
     */
    this.blankSet = blankSet;
    /**
     * @type {Validator}
     */
    this.validator = validator;
    /**
     * @type {ExclusiveDigit}
     */
    this.exclusiveDigit = exclusiveDigit;
    /**
     * @type {ExclusiveCell}
     */
    this.exclusiveCell = exclusiveCell;
  }

  reasoningReliably() {
    /**
     * @type {[number,number][]}
     */
    const determineList = [];

    for (const index of this.blankSet) {
      const bitmap = this.validator.getBitmap(index);
      const [determine, bit] = this.exclusiveDigit.recordBlank(index, bitmap);
      if (determine) {
        determineList.push([index, bit]);
      }
    }
  }

  reasoning() {}

  guess() {}

  fill(board) {
    for (var y = 0; y !== 9; y++) {
      for (var x = 0; x !== 9; x++) {
        board[y][x] = this.board[y * 9 + x];
      }
    }
  }
}

class Validator {
  static create() {
    return new Validator($9Zero.slice(), $9Zero.slice(), $9Zero.slice());
  }

  constructor(rowRecord, columnRecord, roomRecord) {
    /**
     * @type {number[]}
     */
    this.rowRecord = rowRecord;
    /**
     * @type {number[]}
     */
    this.columnRecord = columnRecord;
    /**
     * @type {number[]}
     */
    this.roomRecord = roomRecord;
  }

  record(x, y, r, bit) {
    this.columnRecord[x] |= bit;
    this.rowRecord[y] |= bit;
    this.roomRecord[r] |= bit;
  }

  getBitmap(index) {
    const x = columnMap[index];
    const y = rowMap[index];
    const r = roomMap[index];
    return this.rowRecord[y] | this.columnRecord[x] | this.roomRecord[r];
  }

  validate(index, bit) {
    const x = columnMap[index];
    const y = rowMap[index];
    const r = roomMap[index];
    const bitmap =
      this.rowRecord[y] | this.columnRecord[x] | this.roomRecord[r];
    if (bitmap & bit) {
      return false;
    } else {
      this, this.record(x, y, r, bit);
      return true;
    }
  }

  clone() {
    return new Validator(
      this.rowRecord.slice(),
      this.columnRecord.slice(),
      this.roomRecord.slice()
    );
  }
}

class ExclusiveDigit {
  static create() {
    const board = $9X9Item.slice().fill(null);
    return new ExclusiveDigit(board);
  }

  constructor(board) {
    /**
     * @type {{bitmap:number,count:number}[]}
     */
    this.board = board;
  }

  recordBlank(index, bitmap) {
    bitmap ^= 0b111_111_111_0;

    var count = 0;
    for (var i = 0; i !== 9; i++) {
      if ((bitmap & (0b10 << i)) !== 0) {
        count++;
      }
    }

    if (count === 1) {
      return [true, bitmap];
    }

    this.board[index] = {
      bitmap,
      count
    };

    return [false, 0];
  }

  exclusive(index, bit) {
    const cell = this.board[index];

    if (cell && cell.bitmap & bit) {
      const bitmap = cell.bitmap ^ bit;
      const count = cell.count - 1;

      if (count === 1) {
        this.board[index] = null;
        return Math.log2(bitmap);
      }

      cell.bitmap = bitmap;
      cell.count = count;
    }

    return 0;
  }

  clone() {
    return new ExclusiveDigit(this.board.map(cell => cell && { ...cell }));
  }
}

class ExclusiveCell {
  static create() {
    return new ExclusiveCell();
  }

  constructor() {}

  clone() {}
}

// {
//   bitmap: 0b111_111_111_0,
//   length: 9
// }

const exclusive = function(item, digit) {
  const digitBit = 1 << digit;
  if (item.bitmap & digitBit) {
    item.bitmap ^= digitBit;
    item.length--;
    return item.length === 1 ? Math.log2(item.bitmap) : NaN;
  } else {
    return NaN;
  }
};

const $9Zero = new Array(9).fill(0);
const $9X9Zero = new Array(9 * 9).fill(0);
const $9X9Item = new Array(9 * 9).fill();

const bitmap = new Array(9).fill(0b111_111_111_0);

var rowMap = $9X9Zero.slice(),
  columnMap = $9X9Zero.slice(),
  roomMap = $9X9Zero.slice();

for (var y = 0; y !== 9; y++) {
  for (var x = 0; x !== 9; x++) {
    const index = y * 9 + x;
    rowMap[index] = y;
    columnMap[index] = x;
    roomMap[index] = Math.floor(y / 3) * 3 + Math.floor(x / 3);
  }
}
