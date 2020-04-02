/**
 * @param {character[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 */
var solveSudoku = function(board) {
  const [complete, sudokuState] = SudokuState.create(board);

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
    const blankSet = new Set();
    const validator = Validator.create();

    const valueList = [];

    for (var r = 0; r !== 9; r++) {
      for (var c = 0; c !== 9; c++) {
        const digit = board[r][c];
        const index = r * 9 + c;

        if (digit === ".") {
          blankSet.add(index);
          continue;
        }

        grid[index] = digit;
        valueList.push([index, digit]);
      }
    }

    const lockedCandidateStrategy = LockedCandidateStrategy.create();

    var whiteSource = [];
    var valueSource = valueList;

    while (true) {
      var newValueList;

      newValueList = byHidden();

      newValueList = byLockedCandidateStrategy(
        valueSource.concat(newValueList)
      );

      if (newValueList.length === 0) {
        break;
      }

      valueSource = whiteSource;
    }

    return [
      blankSet.size === 0,
      new SudokuState(grid, blankSet, validator, lockedCandidateStrategy)
    ];
  }

  static hiddenReliably(validator, blankSet, valueSource) {
    const fullValueList = [];

    while (true) {
      if (blankSet.size === 0) {
        break;
      }

      this.markAll(validator, valueSource);

      const partValueList = [];

      for (const index of blankSet) {
        const [single, digit] = this.hidden(validator, index);
        if (single) {
          partValueList.push([index, digit]);
        }
      }

      if (partValueList.length === 0) {
        break;
      }

      for (const pair of partValueList) {
        blankSet.delete(pair[0]);
        fullValueList.push(pair);
      }

      valueSource = partValueList;
    }

    return fullValueList;
  }

  static markAll(validator, valueList) {
    for (const [index, digit] of valueList) {
      validator.recordByIndex(index, digit);
    }
  }

  static hidden(validator, index) {
    const bitmap = validator.getBitmap(index);
    const markBitmap = bitmap ^ 0b1111_1111_10;
    const digit = singleBitmap(markBitmap);
    return [digit !== notSingle, digit];
  }

  constructor(grid, blankSet, validator, lockedCandidateStrategy) {
    /**
     * @type {number[]}
     */
    this.grid = grid;
    /**
     * @type {Set<number>}
     */
    this.blankSet = blankSet;
    /**
     * @type {Validator}
     */
    this.validator = validator;
    /**
     * @type {LockedCandidateStrategy}
     */
    this.lockedCandidateStrategy = lockedCandidateStrategy;
  }

  inferenceReliably() {}

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

  record(r, c, b, digit) {
    const bit = 1 << digit;

    this.rowRecord[r] |= bit;
    this.columnRecord[c] |= bit;
    this.blockRecord[b] |= bit;
  }

  recordByIndex(index) {
    const r = index$row[index],
      c = index$column[index],
      b = index$block[index];
    this.record(r, c, b, digit);
  }

  getBitmap(index) {
    const r = index$row[index],
      c = index$column[index],
      b = index$block[index];

    return this.rowRecord[r] | this.columnRecord[c] | this.blockRecord[b];
  }

  validateAndRecord(index, digit) {
    const bit = 1 << digit;

    const r = index$row[index],
      c = index$column[index],
      b = index$block[index];

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

class LockedCandidateStrategy {
  static create() {
    const rowLockedMap = this.$9x9Fix.slice(),
      columnLockedMap = this.$9x9Fix.slice(),
      blockLockedMap = this.$9x9Fix.slice();

    return new LockedCandidateStrategy(
      rowLockedMap,
      columnLockedMap,
      blockLockedMap
    );
  }

  static $9x9Fix = new Array(9 * 9).fill(0b111_111_111);
  static $index(region, digit) {
    return region * 9 + digit - 1;
  }

  constructor(rowLockedMap, columnLockedMap, blockLockedMap) {
    /**
     * @type {number[]}
     */
    this.rowLockedMap = rowLockedMap;
    /**
     * @type {number[]}
     */
    this.columnLockedMap = columnLockedMap;
    /**
     * @type {number[]}
     */
    this.blockLockedMap = blockLockedMap;
  }

  lockReliably(blankSet, valueSource) {
    const fullValueList = [];

    while (true) {
      if (blankSet.size === 0) {
        break;
      }

      this.fixAll(valueSource);

      const partValueList = [];

      for (const [index, digit] of valueSource) {
        const r = index$row[index],
          c = index$column[index],
          b = index$block[index];

        for (var i = 0; i !== 9; i++) {
          const rowLockedIndex = LockedCandidateStrategy.$index(i, digit);
          const columnIndexBitmap =
            this.rowLockedMap[rowLockedIndex] & ~(1 << c);

          const columnIndex = singleBitmap(columnIndexBitmap);

          if (columnIndex !== notSingle && columnIndex !== blankBit) {
            this.rowLockedMap[rowLockedIndex] = 0;

            const index = i * 9 + columnIndex;
            partValueList.push([index, digit]);
          } else {
            this.rowLockedMap[rowLockedIndex] = columnIndexBitmap;
          }

          const columnLockedIndex = LockedCandidateStrategy.$index(i, digit);
          const rowIndexBitmap =
            this.columnLockedMap[columnLockedIndex] & ~(1 << r);

          const rowIndex = singleBitmap(rowIndexBitmap);

          if (rowIndex !== notSingle && rowIndex !== blankBit) {
            this.columnLockedMap[columnLockedIndex] = 0;

            const index = i + rowIndex * 9;
            partValueList.push([index, digit]);
          } else {
            this.columnLockedMap[columnLockedIndex] = rowIndexBitmap;
          }
        }

        const t = b % 3,
          floorAdd = b - t,
          boxColumn = index % 3,
          boxRow = ((index - boxColumn) / 3) % 3,
          byBoxRow = boxRow * 3;

        for (var i = 0; i !== 3; i++) {
          const byFloor = i + floorAdd;

          const blockLockedIndexByFloor = LockedCandidateStrategy.$index(
            byFloor,
            digit
          );
          const indexByFloorBitMap =
            this.blockLockedMap[blockLockedIndexByFloor] & ~(0b111 << byBoxRow);

          const indexByFloor = singleBitmap(indexByFloorBitMap);

          if (indexByFloor !== notSingle && indexByFloor !== blankBit) {
            this.blockLockedMap[blockLockedIndexByFloor] = 0;

            const index = block$indexList[byFloor][indexByFloor];
            partValueList.push([index, digit]);
          } else {
            this.columnLockedMap[blockLockedIndexByFloor] = indexByFloorBitMap;
          }

          const byTower = t + i * 3;

          const blockLockedIndexByTower = LockedCandidateStrategy.$index(
            byTower,
            digit
          );
          const indexByTowerBitmap =
            this.blockLockedMap[blockLockedIndexByTower] &
            ~(0b001_001_001 << boxColumn);

          const indexByTower = singleBitmap(indexByTowerBitmap);

          if (indexByTower !== notSingle && indexByTower !== blankBit) {
            this.blockLockedMap[blockLockedIndexByTower] = 0;

            const index = block$indexList[byTower][indexByTower];
            partValueList.push([index, digit]);
          } else {
            this.columnLockedMap[blockLockedIndexByTower] = indexByTowerBitmap;
          }
        }
      }

      if (partValueList.length === 0) {
        break;
      }

      for (const pair of partValueList) {
        blankSet.delete(pair[0]);
        fullValueList.push(pair);
      }

      valueSource = partValueList;
    }

    return fullValueList;
  }

  fixAll(valueList) {
    for (const [index, digit] of valueList) {
      const r = index$row[index],
        c = index$column[index],
        b = index$block[index];

      this.rowLockedMap[LockedCandidateStrategy.$index(r, digit)] = 0;
      this.columnLockedMap[LockedCandidateStrategy.$index(c, digit)] = 0;
      this.blockLockedMap[LockedCandidateStrategy.$index(b, digit)] = 0;
    }
  }

  lock(index, digit) {
    const r = index$row[index],
      c = index$column[index],
      b = index$block[index];

    for (var i = 0; i !== 9; i++) {
      const bitmap = this.rowLockedMap[i * 9 + digit];
      const bit = 1 << c;
    }
  }

  clone() {}
}

const blankBit = 10;
const wrongBit = 10;
const notSingle = 11;
const singleBitmap = function(bitmap) {
  switch (bitmap) {
    case 0:
      return wrongBit;
    case 0b1:
      return 0;
    case 0b10:
      return 1;
    case 0b100:
      return 2;
    case 0b1000:
      return 3;
    case 0b1000_0:
      return 4;
    case 0b1000_00:
      return 5;
    case 0b1000_000:
      return 6;
    case 0b1000_0000:
      return 7;
    case 0b1000_0000_0:
      return 8;
    case 0b1000_0000_00:
      return 9;
    default:
      return notSingle;
  }
};

const $9Zero = new Array(9).fill(0);
const $9X9Zero = new Array(9 * 9).fill(0);
const $9Item = new Array(9).fill();
const $9X9Item = new Array(9 * 9).fill();

const index$row = $9X9Zero.slice(),
  index$column = $9X9Zero.slice(),
  index$block = $9X9Zero.slice();

const block$indexList = $9Item.map(() => []);

for (var r = 0; r !== 9; r++) {
  for (var c = 0; c !== 9; c++) {
    const b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
    const index = r * 9 + c;
    index$row[index] = r;
    index$column[index] = c;
    index$block[index] = b;

    block$indexList[b].push(index);
  }
}

// 每个确认cell，可以使受影响的20个cell 进行digit排除 摒除法
// 每个确认cell，可以使其他24个region 进行cell排除 区块法

// 优化点
// 摒除法可以根据新增的value mark若干个region,最后再根据被mark的region里的cell推理出新的value【

//guess的时候再找最少选择的cell
