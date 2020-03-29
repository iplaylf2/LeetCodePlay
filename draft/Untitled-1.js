/**
 * @param {character[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 */
var solveSudoku = function(board) {
  const sudokuState = SudokuState.create(board);
  const complete = sudokuState.inferenceReliably();
  if (complete) {
    sudokuState.fill(board);
    return;
  }

  const snapshotList = [];
  var dilemma = sudokuState;
  var [available, branch] = dilemma.tryCell();

  while (true) {
    switch (branch.inference()) {
      case "complete":
        branch.fill(board);
        return;
      case "incomplete":
        snapshotList.push(dilemma);
        dilemma = branch;

        [available, branch] = dilemma.tryCell();
        if (available) {
          continue;
        }

        break;
      case "wrong":
        break;
    }

    do {
      dilemma = snapshotList.pop();
      [available, branch] = dilemma.tryDigit();
    } while (!available);
  }
};

class SudokuState {
  static create(board) {
    const grid = $9X9Zero.slice();
    const blankList = [];
    const validator = Validator.create();

    for (var r = 0; r !== 9; r++) {
      for (var c = 0; c !== 9; c++) {
        const digit = board[r][c];
        const index = r * 9 + c;

        if (digit === ".") {
          blankList.push(index);
          continue;
        }

        grid[index] = digit;
        const b = blockMap[index];
        const bit = 1 << digit;

        validator.record(r, c, b, bit);
      }
    }

    const hiddenStrategy = HiddenStrategy.create();
    const lockedCandidateStrategy = LockedCandidateStrategy.create();

    return new SudokuState(
      grid,
      blankList,
      validator,
      hiddenStrategy,
      lockedCandidateStrategy
    );
  }

  constructor(
    grid,
    blankList,
    validator,
    hiddenStrategy,
    lockedCandidateStrategy
  ) {
    /**
     * @type {number[]}
     */
    this.grid = grid;
    /**
     * @type {number[]}
     */
    this.blankList = blankList;
    /**
     * @type {Validator}
     */
    this.validator = validator;
    /**
     * @type {HiddenStrategy}
     */
    this.hiddenStrategy = hiddenStrategy;
    /**
     * @type {LockedCandidateStrategy}
     */
    this.lockedCandidateStrategy = lockedCandidateStrategy;
  }

  inferenceReliably() {
    /**
     * @type {[number,number][]}
     */
    const determineList = [];

    for (const index of this.blankList) {
      const bitmap = this.validator.getBitmap(index);
      const [determine, bit] = this.hiddenStrategy.recordCandidate(
        index,
        bitmap
      );
      if (determine) {
        determineList.push([index, bit]);
      }
    }
  }

  inference() {}

  tryCell() {}

  tryDigit() {}

  fill(board) {
    for (var r = 0; r !== 9; r++) {
      for (var c = 0; c !== 9; c++) {
        board[r][c] = this.grid[r * 9 + c];
      }
    }
  }
}

class Validator {
  static create() {
    return new Validator($9Zero.slice(), $9Zero.slice(), $9Zero.slice());
  }

  constructor(rowRecord, columnRecord, blockRecord) {
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
    this.blockRecord = blockRecord;
  }

  record(r, c, b, bit) {
    this.rowRecord[r] |= bit;
    this.columnRecord[c] |= bit;
    this.blockRecord[b] |= bit;
  }

  getBitmap(index) {
    const r = rowMap[index],
      c = columnMap[index],
      b = blockMap[index];

    return this.rowRecord[r] | this.columnRecord[c] | this.blockRecord[b];
  }

  validate(index, bit) {
    const r = rowMap[index],
      c = columnMap[index],
      b = blockMap[index];

    const bitmap =
      this.rowRecord[r] | this.columnRecord[c] | this.blockRecord[b];

    if (bitmap & bit) {
      return false;
    } else {
      this.record(r, c, b, bit);
      return true;
    }
  }

  clone() {
    return new Validator(
      this.rowRecord.slice(),
      this.columnRecord.slice(),
      this.blockRecord.slice()
    );
  }
}

class HiddenStrategy {
  static create() {
    const PMGrid = $9X9Item.slice().fill(null);
    return new HiddenStrategy(PMGrid);
  }

  constructor(PMGrid, minIndex) {
    /**
     * @type {{bitmap:number,count:number}[]}
     */
    this.PMGrid = PMGrid;
  }

  recordCandidate(index, bitmap) {
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

    this.PMGrid[index] = {
      bitmap,
      count
    };

    return [false, 0];
  }

  hidden(index, bit) {
    const cell = this.PMGrid[index];

    if (cell && cell.bitmap & bit) {
      const bitmap = cell.bitmap ^ bit;
      const count = cell.count - 1;

      if (count === 1) {
        this.PMGrid[index] = null;
        return Math.log2(bitmap);
      }

      cell.bitmap = bitmap;
      cell.count = count;
    }

    return 0;
  }

  clone() {
    return new HiddenStrategy(this.PMGrid.map(cell => cell && { ...cell }));
  }
}

class LockedCandidateStrategy {
  static create() {
    return new LockedCandidateStrategy();
  }

  constructor(rowLockedMap, columnLockedMap, blockLockedMap) {
    this.rowLockedMap = rowLockedMap;
    this.columnLockedMap = columnLockedMap;
    this.blockLockedMap = blockLockedMap;
  }

  lock(index, digit) {
    const r = rowMap[index],
      c = columnMap[index],
      b = blockMap[index];
  }

  clone() {}
}

const $9Zero = new Array(9).fill(0);
const $9X9Zero = new Array(9 * 9).fill(0);
const $9Item = new Array(9).fill();
const $9X9Item = new Array(9 * 9).fill();

const rowMap = $9X9Zero.slice(),
  columnMap = $9X9Zero.slice(),
  blockMap = $9X9Zero.slice();

for (var r = 0; r !== 9; r++) {
  for (var c = 0; c !== 9; c++) {
    const index = r * 9 + c;
    rowMap[index] = r;
    columnMap[index] = c;
    blockMap[index] = Math.floor(r / 3) * 3 + Math.floor(c / 3);
  }
}

const rowAddMap = $9Item.map(() => []),
  columnAddMap = $9Item.map(() => []),
  blockAddMap = $9Item.map(() => []);

for (var b = 0; b !== 9; b++) {
  const rowAdd = rowAddMap[b],
    columnAdd = columnAddMap[b],
    blockAdd = blockAddMap[b];

  const t = b % 3,
    f = (b - t) / 3;

  const rowMask = 0b111 << (f * 3),
    columnMask = 0b111 << (t * 3);

  for (var i = 0; i !== 9; i++) {
    const bit = 1 << i;
    if ((rowMask & bit) === 0) {
      rowAdd.push[i];
    }
    if ((columnMask & bit) === 0) {
      columnAdd.push[i];
    }
  }

  const towerAdd = t,
    floorAdd = f * 3;
  for (var i = 0; i !== 3; i++) {
    const onTower = i + floorAdd;
    if (b !== onTower) {
      blockAdd.push[onTower];
    }
    const onFloor = i * 3 + towerAdd;
    if (b !== onFloor) {
      blockAdd.push[onFloor];
    }
  }
}

// 每个确认cell，可以使受影响的20个cell 进行digit排除
// 每个确认cell，可以使其他24个 region 进行cell排除
