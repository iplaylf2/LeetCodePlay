/**
 * @param {character[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 */
var solveSudoku = function (board) {
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

    if (blankSet.size === 0) {
      return [true, new SudokuState(grid)];
    }

    const hiddenStrategy = HiddenStrategy.create(blankSet);
    const lockedCandidateStrategy = LockedCandidateStrategy.create(blankSet);

    var [complete, _valueList] = hiddenStrategy.hiddenReliably(valueList);
    if (complete) {
      this.fill(grid, _valueList);
      return [true, new SudokuState(grid)];
    }

    valueList.push(..._valueList);
    
    var [complete, _valueList] = lockedCandidateStrategy.lockReliably(
      valueList
    );
    if (complete) {
      this.fill(grid, _valueList);
      return [true, new SudokuState(grid)];
    }

    var valueList$a = _valueList;
    while (valueList$a.length !== 0) {
      var [complete, valueList$b] = hiddenStrategy.hiddenReliably(valueList$a);

      if (complete) {
        this.fill(grid, valueList$b);
        return [true, new SudokuState(grid)];
      }

      if (valueList$b.length === 0) {
        break;
      }

      var [complete, valueList$a] = lockedCandidateStrategy.lockReliably(
        valueList$b
      );

      if (complete) {
        this.fill(grid, valueList$a);
        return [true, new SudokuState(grid)];
      }
    }

    return [
      false,
      new SudokuState(grid, blankSet, hiddenStrategy, lockedCandidateStrategy),
    ];
  }

  static fill(grid, valueList) {
    for (const [index, digit] of valueList) {
      grid[index] = digit;
    }
  }

  constructor(grid, blankSet, hiddenStrategy, lockedCandidateStrategy) {
    /**
     * @type {number[]}
     */
    this.grid = grid;
    /**
     * @type {Set<number>}
     */
    this.blankSet = blankSet;
    /**
     * @type {HiddenStrategy}
     */
    this.hiddenStrategy = hiddenStrategy;
    /**
     * @type {LockedCandidateStrategy}
     */
    this.lockedCandidateStrategy = lockedCandidateStrategy;
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

class HiddenStrategy {
  static create(blankSet) {
    return new HiddenStrategy(
      blankSet,
      $9Zero.slice(),
      $9Zero.slice(),
      $9Zero.slice()
    );
  }

  constructor(blankSet, rowMark, columnMark, blockMark) {
    /**
     * @type {Set<number>}
     */
    this.blankSet = blankSet;
    /**
     * @type {number[]}
     */
    this.rowMark = rowMark;
    /**
     * @type {number[]}
     */
    this.columnMark = columnMark;
    /**
     * @type {number[]}
     */
    this.blockMark = blockMark;
  }

  hiddenReliably(valueSource) {
    const fullValueList = [];

    while (true) {
      this.markAll(valueSource);

      const valueList = [];

      for (const index of this.blankSet) {
        const digit = this.single(index);
        if (digit !== notSingle) {
          valueList.push([index, digit]);
          fullValueList.push(pair);

          blankSet.delete(pair[0]);
          if (this.blankSet.size === 0) {
            return [true, fullValueList];
          }
        }
      }

      if (valueList.length === 0) {
        break;
      }

      valueSource = valueList;
    }

    return [false, fullValueList];
  }

  markAll(valueList) {
    for (const [index, digit] of valueList) {
      const r = index$row[index],
        c = index$column[index],
        b = index$block[index];
      const bit = 1 << digit;

      this.rowMark[r] |= bit;
      this.columnMark[c] |= bit;
      this.blockMark[b] |= bit;
    }
  }

  single(index) {
    const r = index$row[index],
      c = index$column[index],
      b = index$block[index];

    const bitmap = this.rowMark[r] | this.columnMark[c] | this.blockMark[b];
    const markBitmap = bitmap ^ 0b111_111_111_0;
    return singleBitmap(markBitmap);
  }

  clone(blankSet) {}
}

class LockedCandidateStrategy {
  static create(blankSet) {
    const rowLockedMap = this.$9x9Fix.slice(),
      columnLockedMap = this.$9x9Fix.slice(),
      blockLockedMap = this.$9x9Fix.slice();

    return new LockedCandidateStrategy(
      blankSet,
      rowLockedMap,
      columnLockedMap,
      blockLockedMap
    );
  }

  static $index(region, digit) {
    return region * 9 + digit - 1;
  }

  static tryClaiming(bitmap) {
    switch (bitmap) {
      //row
      case 0b111:
      case 0b110:
      case 0b101:
      case 0b011:
        return [this.rowClaiming, 0];
      case 0b111 << 3:
      case 0b110 << 3:
      case 0b101 << 3:
      case 0b011 << 3:
        return [this.rowClaiming, 1];
      case 0b111 << 6:
      case 0b110 << 6:
      case 0b101 << 6:
      case 0b011 << 6:
        return [this.rowClaiming, 2];
      //column
      case 0b001_001_001:
      case 0b001_001_000:
      case 0b001_000_001:
      case 0b000_001_001:
        return [this.columnClaiming, 0];
      case 0b001_001_001 << 1:
      case 0b001_001_000 << 1:
      case 0b001_000_001 << 1:
      case 0b000_001_001 << 1:
        return [this.columnClaiming, 1];
      case 0b001_001_001 << 2:
      case 0b001_001_000 << 2:
      case 0b001_000_001 << 2:
      case 0b000_001_001 << 2:
        return [this.columnClaiming, 2];
      default:
        return [this.notClaiming];
    }
  }

  static $9x9Fix = new Array(9 * 9).fill(0b111_111_111);

  static notClaiming = 0;
  static rowClaiming = 1;
  static columnClaiming = 2;

  constructor(blankSet, rowLockedMap, columnLockedMap, blockLockedMap) {
    /**
     * @type {Set<number>}
     */
    this.blankSet = blankSet;
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

  lockReliably(valueSource) {
    var rowValueSource = [],
      columnValueSource = [];

    const fullValueList = [];

    while (true) {
      this.fixAll(valueSource);

      const valueList = [],
        rowValueList = [],
        columnValueList = [];

      for (const [index, digit] of valueSource) {
        const r = index$row[index],
          c = index$column[index];

        var [
          complete,
          _valueList,
          _rowValueList,
          _columnValueList,
        ] = this.lockByRowReliably(r, digit);

        if (complete) {
          fullValueList.push(...valueList, ..._valueList);
          return [true, fullValueList];
        }

        valueList.push(..._valueList);
        rowValueList.push(..._rowValueList);
        columnValueList.push(..._columnValueList);

        var [
          complete,
          _valueList,
          _rowValueList,
          _columnValueList,
        ] = this.lockByColumnReliably(c, digit);

        if (complete) {
          fullValueList.push(...valueList, ..._valueList);
          return [true, fullValueList];
        }

        valueList.push(..._valueList);
        rowValueList.push(..._rowValueList);
        columnValueList.push(..._columnValueList);
      }

      for (const [row, digit] of rowValueSource) {
        const [
          complete,
          _valueList,
          _rowValueList,
          _columnValueList,
        ] = this.lockByRowReliably(row, digit);

        if (complete) {
          fullValueList.push(...valueList, ..._valueList);
          return [true, fullValueList];
        }

        valueList.push(..._valueList);
        rowValueList.push(..._rowValueList);
        columnValueList.push(..._columnValueList);
      }

      for (const [column, digit] of columnValueSource) {
        const [
          complete,
          _valueList,
          _rowValueList,
          _columnValueList,
        ] = this.lockByColumnReliably(column, digit);

        if (complete) {
          fullValueList.push(...valueList, ..._valueList);
          return [true, fullValueList];
        }

        valueList.push(..._valueList);
        rowValueList.push(..._rowValueList);
        columnValueList.push(..._columnValueList);
      }

      if (
        valueList.length === 0 &&
        rowValueList.length === 0 &&
        columnValueList.length === 0
      ) {
        break;
      }

      fullValueList.push(...valueList);

      valueSource = valueList;
      rowValueSource = rowValueList;
      columnValueSource = columnValueList;
    }

    return [false, fullValueList];
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

  lockByRowReliably(row, digit) {
    const valueList = [],
      rowValueList = [],
      columnValueList = [];

    for (var i = 0; i !== 9; i++) {
      const columnLockedIndex = LockedCandidateStrategy.$index(i, digit);
      const rowIndexBitmap =
        this.columnLockedMap[columnLockedIndex] & ~(1 << row);

      const rowIndex = singleBitmap(rowIndexBitmap);

      if (rowIndex !== notSingle && rowIndex !== blankBit) {
        this.columnLockedMap[columnLockedIndex] = 0;

        const index = i + rowIndex * 9;
        valueList.push([index, digit]);

        this.blankSet.delete(index);
        if (this.blankSet.size === 0) {
          return [true, valueList];
        }
      } else {
        this.columnLockedMap[columnLockedIndex] = rowIndexBitmap;
      }
    }

    const floorOffset = Math.floor(row / 3) * 3;
    const boxRowOffset = (row % 3) * 3;

    for (var i = 0; i !== 3; i++) {
      const block = floorOffset + i;

      const blockLockedIndex = LockedCandidateStrategy.$index(block, digit);
      const inBlockIndexBitmap =
        this.blockLockedMap[blockLockedIndex] & ~(0b111 << boxRowOffset);

      const inBlockIndex = singleBitmap(inBlockIndexBitmap);

      if (inBlockIndex !== notSingle && inBlockIndex !== blankBit) {
        this.blockLockedMap[blockLockedIndex] = 0;

        const index = block$indexList[block][inBlockIndex];
        valueList.push([index, digit]);

        this.blankSet.delete(index);
        if (this.blankSet.size === 0) {
          return [true, valueList];
        }
      } else {
        const [alreadyClaiming] = LockedCandidateStrategy.tryClaiming(
          this.blockLockedMap[blockLockedIndex]
        );

        this.blockLockedMap[blockLockedIndex] = inBlockIndexBitmap;

        if (alreadyClaiming === LockedCandidateStrategy.notClaiming) {
          const [claiming, offset] = LockedCandidateStrategy.tryClaiming(
            inBlockIndexBitmap
          );
          switch (claiming) {
            case LockedCandidateStrategy.rowClaiming:
              {
                const row = Math.floor(block / 3) * 3 + offset;
                rowValueList.push([row, digit]);
              }
              break;
            case LockedCandidateStrategy.columnClaiming:
              {
                const column = (block % 3) * 3 + offset;
                columnValueList.push([column, digit]);
              }
              break;
          }
        }
      }
    }

    return [false, valueList, rowValueList, columnValueList];
  }

  lockByColumnReliably(column, digit) {
    const valueList = [],
      rowValueList = [],
      columnValueList = [];

    for (var i = 0; i !== 9; i++) {
      const rowLockedIndex = LockedCandidateStrategy.$index(i, digit);
      const columnIndexBitmap =
        this.rowLockedMap[rowLockedIndex] & ~(1 << column);

      const columnIndex = singleBitmap(columnIndexBitmap);

      if (columnIndex !== notSingle && columnIndex !== blankBit) {
        this.rowLockedMap[rowLockedIndex] = 0;

        const index = i * 9 + columnIndex;
        valueList.push([index, digit]);

        this.blankSet.delete(index);
        if (this.blankSet.size === 0) {
          return [true, valueList];
        }
      } else {
        this.rowLockedMap[rowLockedIndex] = columnIndexBitmap;
      }
    }

    const tower = Math.floor(column / 3);
    const boxColumn = column % 3;

    for (var i = 0; i !== 3; i++) {
      const block = tower + i * 3;

      const blockLockedIndex = LockedCandidateStrategy.$index(block, digit);
      const inBlockIndexBitmap =
        this.blockLockedMap[blockLockedIndex] & ~(0b001_001_001 << boxColumn);

      const inBlockIndex = singleBitmap(inBlockIndexBitmap);

      if (inBlockIndex !== notSingle && inBlockIndex !== blankBit) {
        this.blockLockedMap[blockLockedIndex] = 0;

        const index = block$indexList[block][inBlockIndex];
        valueList.push([index, digit]);

        this.blankSet.delete(index);
        if (this.blankSet.size === 0) {
          return [true, valueList];
        }
      } else {
        const [alreadyClaiming] = LockedCandidateStrategy.tryClaiming(
          this.blockLockedMap[blockLockedIndex]
        );

        this.blockLockedMap[blockLockedIndex] = inBlockIndexBitmap;

        if (alreadyClaiming === LockedCandidateStrategy.notClaiming) {
          const [claiming, offset] = LockedCandidateStrategy.tryClaiming(
            inBlockIndexBitmap
          );
          switch (claiming) {
            case LockedCandidateStrategy.rowClaiming:
              {
                const row = Math.floor(block / 3) * 3 + offset;
                rowValueList.push([row, digit]);
              }
              break;
            case LockedCandidateStrategy.columnClaiming:
              {
                const column = (block % 3) * 3 + offset;
                columnValueList.push([column, digit]);
              }
              break;
          }
        }
      }
    }

    return [false, valueList, rowValueList, columnValueList];
  }

  clone(blankSet) {}
}

const blankBit = 10;
const wrongBit = 10;
const notSingle = 11;
const singleBitmap = function (bitmap) {
  switch (bitmap) {
    case 0:
      return wrongBit;
    case 0b1:
      return 0;
    case 0b10:
      return 1;
    case 0b100:
      return 2;
    case 0b1_000:
      return 3;
    case 0b10_000:
      return 4;
    case 0b100_000:
      return 5;
    case 0b1_000_000:
      return 6;
    case 0b10_000_000:
      return 7;
    case 0b100_000_000:
      return 8;
    case 0b1_000_000_000:
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

//guess的时候再找最少选择的cell
