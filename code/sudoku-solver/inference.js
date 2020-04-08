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
  var [branch, index, digit] = dilemma.tryCell();

  while (true) {
    switch (branch.inference(index, digit)) {
      case SudokuState.complete:
        branch.fill(board);
        return;
      case SudokuState.incomplete:
        snapshotList.push(dilemma);
        dilemma = branch;

        [branch, index, digit] = dilemma.tryCell();
        continue;
      case SudokuState.wrong:
        while (true) {
          [available, branch, index, digit] = dilemma.tryDigit();
          if (available) {
            break;
          }
          dilemma = snapshotList.pop();
        }
        break;
    }
  }
};

class SudokuState {
  static create(board) {
    const grid = $9x9Slot.slice();
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

    var _valueList = hiddenStrategy.hiddenReliably(valueList);
    this.fill(grid, _valueList);

    if (blankSet.size === 0) {
      return [true, new SudokuState(grid)];
    }

    valueList.push(..._valueList);

    var [complete, _valueList] = lockedCandidateStrategy.lockReliably(
      valueList
    );
    this.fill(grid, _valueList);

    if (complete) {
      return [true, new SudokuState(grid)];
    }

    var valueList$a = _valueList;
    while (true) {
      var valueList$b = hiddenStrategy.hiddenReliably(valueList$a);

      if (valueList$b.length === 0) {
        break;
      }

      this.fill(grid, valueList$b);
      if (blankSet.size === 0) {
        return [true, new SudokuState(grid)];
      }

      var [complete, valueList$a] = lockedCandidateStrategy.lockReliably(
        valueList$b
      );

      if (valueList$a.length === 0) {
        break;
      }

      this.fill(grid, valueList$a);
      if (complete) {
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
      grid[index] = String(digit);
    }
  }

  // static complete = 0;
  // static incomplete = 1;
  // static wrong = 2;

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

  inference(index, digit) {
    var valueList$a = [[index, digit]];

    do {
      var [correct, valueList$b] = this.hiddenStrategy.hidden(valueList$a);

      if (!correct) {
        return SudokuState.wrong;
      }

      if (valueList$b.length === 0) {
        break;
      }

      SudokuState.fill(this.grid, valueList$b);
      if (this.blankSet.size === 0) {
        return SudokuState.complete;
      }

      var [status, valueList$a] = this.lockedCandidateStrategy.lock(
        valueList$b
      );

      switch (status) {
        case SudokuState.complete:
          SudokuState.fill(this.grid, valueList$a);
          return status;
        case SudokuState.incomplete:
          SudokuState.fill(this.grid, valueList$a);
          break;
        case SudokuState.wrong:
          return status;
      }
    } while (valueList$a.length !== 0);

    return SudokuState.incomplete;
  }

  tryCell() {
    var min$ = 10,
      min$index = 0,
      min$bitmap = 0,
      min$digit = 0;

    for (const index of this.blankSet) {
      const bitmap = this.hiddenStrategy.getMarkBitmap(index);

      var count = 0,
        digit = 0;
      for (var bit = 0b10, d = 1; d !== 10; bit = bit << 1, d++) {
        if ((bitmap & bit) !== 0) {
          count++;
          digit = d;
        }
      }

      if (count === 2) {
        min$index = index;
        min$bitmap = bitmap;
        min$digit = digit;
        break;
      }

      if (count < min$) {
        min$ = count;
        min$index = index;
        min$bitmap = bitmap;
        min$digit = digit;
      }
    }

    /**
     * @type {number}
     */
    this.$tryIndex = min$index;
    /**
     * @type {number}
     */
    this.$tryBitmap = min$bitmap;
    /**
     * @type {number}
     */
    this.$tryDigit = min$digit;

    const newState = this.clone();
    newState.blankSet.delete(min$index);
    newState.grid[min$index] = String(min$digit);

    return [newState, min$index, min$digit];
  }

  tryDigit() {
    const index = this.$tryIndex,
      bitmap = this.$tryBitmap,
      testDigit = this.$tryDigit - 1;

    for (
      var bit = 0b1 << testDigit, digit = testDigit;
      digit !== 0;
      bit = bit >> 1, digit--
    ) {
      if ((bitmap & bit) !== 0) {
        break;
      }
    }

    if (digit === 0) {
      return [false];
    }

    this.$tryDigit = digit;

    const newState = this.clone();
    newState.blankSet.delete(index);
    newState.grid[index] = String(digit);

    return [true, newState, index, digit];
  }

  fill(board) {
    for (var r = 0; r !== 9; r++) {
      for (var c = 0; c !== 9; c++) {
        board[r][c] = this.grid[r * 9 + c];
      }
    }
  }

  clone() {
    const newBlankSet = new Set(this.blankSet);
    return new SudokuState(
      this.grid.slice(),
      newBlankSet,
      this.hiddenStrategy.clone(newBlankSet),
      this.lockedCandidateStrategy.clone(newBlankSet)
    );
  }
}

SudokuState.complete = 0;
SudokuState.incomplete = 1;
SudokuState.wrong = 2;

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
    const valueList = [];

    this.markAll(valueSource);

    while (true) {
      var noChange = true;

      for (const index of this.blankSet) {
        const bitmap = this.getMarkBitmap(index);
        const digit = singleBitmap(bitmap);

        switch (digit) {
          case blankBit:
          case notSingle:
            break;
          default:
            this.mark(index, digit);
            this.blankSet.delete(index);
            valueList.push([index, digit]);

            noChange = false;
            break;
        }
      }

      if (noChange) {
        break;
      }
    }

    return valueList;
  }

  hidden(valueSource) {
    const valueList = [];

    this.markAll(valueSource);

    while (true) {
      var noChange = true;

      for (const index of this.blankSet) {
        const bitmap = this.getMarkBitmap(index);
        const digit = singleBitmap(bitmap);

        switch (digit) {
          case wrongBit:
            return [false];
          case notSingle:
            break;
          default:
            this.mark(index, digit);
            this.blankSet.delete(index);
            valueList.push([index, digit]);

            noChange = false;
            break;
        }
      }

      if (noChange) {
        break;
      }
    }

    return [true, valueList];
  }

  markAll(valueList) {
    for (const [index, digit] of valueList) {
      this.mark(index, digit);
    }
  }

  mark(index, digit) {
    const r = index$row[index],
      c = index$column[index],
      b = index$block[index];
    const bit = 1 << digit;

    this.rowMark[r] |= bit;
    this.columnMark[c] |= bit;
    this.blockMark[b] |= bit;
  }

  getMarkBitmap(index) {
    const r = index$row[index],
      c = index$column[index],
      b = index$block[index];

    const bitmap = this.rowMark[r] | this.columnMark[c] | this.blockMark[b];
    const markBitmap = bitmap ^ 0b111_111_111_0;

    return markBitmap;
  }

  clone(blankSet) {
    return new HiddenStrategy(
      blankSet,
      this.rowMark.slice(),
      this.columnMark.slice(),
      this.blockMark.slice()
    );
  }
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

  // static $9x9Fix = new Array(9 * 9).fill(0b111_111_111);
  // static notClaiming = 0;
  // static rowClaiming = 1;
  // static columnClaiming = 2;

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

    this.fixAll(valueSource);

    const fullValueList = [];

    while (true) {
      const valueList = [],
        rowValueList = [],
        columnValueList = [];

      for (const [index, digit] of valueSource) {
        const r = index$row[index],
          c = index$column[index];

        var [
          _valueList,
          _rowValueList,
          _columnValueList,
        ] = this.lockByRowReliably(r, outDigit, digit);

        if (this.blankSet.size === 0) {
          fullValueList.push(...valueList, ..._valueList);
          return [true, fullValueList];
        }

        valueList.push(..._valueList);
        rowValueList.push(..._rowValueList);
        columnValueList.push(..._columnValueList);

        var [
          _valueList,
          _rowValueList,
          _columnValueList,
        ] = this.lockByColumnReliably(c, outDigit, digit);

        if (this.blankSet.size === 0) {
          fullValueList.push(...valueList, ..._valueList);
          return [true, fullValueList];
        }

        valueList.push(..._valueList);
        rowValueList.push(..._rowValueList);
        columnValueList.push(..._columnValueList);
      }

      for (const [row, block, digit] of rowValueSource) {
        const [
          _valueList,
          _rowValueList,
          _columnValueList,
        ] = this.lockByRowReliably(row, block, digit);

        if (this.blankSet.size === 0) {
          fullValueList.push(...valueList, ..._valueList);
          return [true, fullValueList];
        }

        valueList.push(..._valueList);
        rowValueList.push(..._rowValueList);
        columnValueList.push(..._columnValueList);
      }

      for (const [column, block, digit] of columnValueSource) {
        const [
          _valueList,
          _rowValueList,
          _columnValueList,
        ] = this.lockByColumnReliably(column, block, digit);

        if (this.blankSet.size === 0) {
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

  lock(valueSource) {
    var rowValueSource = [],
      columnValueSource = [];

    this.fixAll(valueSource);

    const fullValueList = [];

    while (true) {
      const valueList = [],
        rowValueList = [],
        columnValueList = [];

      for (const [index, digit] of valueSource) {
        const r = index$row[index],
          c = index$column[index];

        var [
          correct,
          _valueList,
          _rowValueList,
          _columnValueList,
        ] = this.lockByRow(r, outDigit, digit);

        if (!correct) {
          return [SudokuState.wrong];
        }

        if (this.blankSet.size === 0) {
          fullValueList.push(...valueList, ..._valueList);
          return [SudokuState.complete, fullValueList];
        }

        valueList.push(..._valueList);
        rowValueList.push(..._rowValueList);
        columnValueList.push(..._columnValueList);

        var [
          correct,
          _valueList,
          _rowValueList,
          _columnValueList,
        ] = this.lockByColumn(c, outDigit, digit);

        if (!correct) {
          return [SudokuState.wrong];
        }

        if (this.blankSet.size === 0) {
          fullValueList.push(...valueList, ..._valueList);
          return [SudokuState.complete, fullValueList];
        }

        valueList.push(..._valueList);
        rowValueList.push(..._rowValueList);
        columnValueList.push(..._columnValueList);
      }

      for (const [row, block, digit] of rowValueSource) {
        const [
          correct,
          _valueList,
          _rowValueList,
          _columnValueList,
        ] = this.lockByRow(row, block, digit);

        if (!correct) {
          return [SudokuState.wrong];
        }

        if (this.blankSet.size === 0) {
          fullValueList.push(...valueList, ..._valueList);
          return [SudokuState.complete, fullValueList];
        }

        valueList.push(..._valueList);
        rowValueList.push(..._rowValueList);
        columnValueList.push(..._columnValueList);
      }

      for (const [column, block, digit] of columnValueSource) {
        const [
          correct,
          _valueList,
          _rowValueList,
          _columnValueList,
        ] = this.lockByColumn(column, block, digit);

        if (!correct) {
          return [SudokuState.wrong];
        }

        if (this.blankSet.size === 0) {
          fullValueList.push(...valueList, ..._valueList);
          return [SudokuState.complete, fullValueList];
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

    return [SudokuState.incomplete, fullValueList];
  }

  fixAll(valueList) {
    for (const [index, digit] of valueList) {
      this.fix(index, digit);
    }
  }

  fix(index, digit) {
    const r = index$row[index],
      c = index$column[index],
      b = index$block[index];

    this.rowLockedMap[LockedCandidateStrategy.$index(r, digit)] = 0;
    this.columnLockedMap[LockedCandidateStrategy.$index(c, digit)] = 0;
    this.blockLockedMap[LockedCandidateStrategy.$index(b, digit)] = 0;
  }

  lockByRowReliably(row, block, digit) {
    const valueList = [],
      rowValueList = [],
      columnValueList = [];

    for (var c = 0; c !== 9; c++) {
      const columnLockedIndex = LockedCandidateStrategy.$index(c, digit);
      const rowIndexBitmap =
        this.columnLockedMap[columnLockedIndex] & ~(1 << row);

      const rowIndex = singleBitmap(rowIndexBitmap);

      switch (rowIndex) {
        case blankBit:
        case notSingle:
          if (block === index$block[row * 9 + c]) {
            continue;
          }

          this.columnLockedMap[columnLockedIndex] = rowIndexBitmap;
          break;
        default:
          const index = rowIndex * 9 + c;

          this.fix(index, digit);
          this.blankSet.delete(index);
          valueList.push([index, digit]);
          break;
      }
    }

    const floorOffset = Math.floor(row / 3) * 3;
    const boxRowOffset = (row % 3) * 3;

    for (var t = 0; t !== 3; t++) {
      const b = floorOffset + t;

      const blockLockedIndex = LockedCandidateStrategy.$index(b, digit);
      const inBlockIndexBitmap =
        this.blockLockedMap[blockLockedIndex] & ~(0b111 << boxRowOffset);

      const inBlockIndex = singleBitmap(inBlockIndexBitmap);

      switch (inBlockIndex) {
        case blankBit:
        case notSingle:
          if (block === b) {
            continue;
          }

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
                  const row = Math.floor(b / 3) * 3 + offset;
                  rowValueList.push([row, b, digit]);
                }
                break;
              case LockedCandidateStrategy.columnClaiming:
                {
                  const column = (b % 3) * 3 + offset;
                  columnValueList.push([column, b, digit]);
                }
                break;
            }
          }
          break;
        default:
          const index = block$indexList[b][inBlockIndex];

          this.fix(index, digit);
          this.blankSet.delete(index);
          valueList.push([index, digit]);
          break;
      }
    }

    return [valueList, rowValueList, columnValueList];
  }

  lockByRow(row, block, digit) {
    const valueList = [],
      rowValueList = [],
      columnValueList = [];

    for (var c = 0; c !== 9; c++) {
      const columnLockedIndex = LockedCandidateStrategy.$index(c, digit);
      if (this.columnLockedMap[columnLockedIndex] === 0) {
        continue;
      }

      const rowIndexBitmap =
        this.columnLockedMap[columnLockedIndex] & ~(1 << row);

      const rowIndex = singleBitmap(rowIndexBitmap);

      switch (rowIndex) {
        case wrongBit:
          if (block === index$block[row * 9 + c]) {
            continue;
          }

          return [false];
        case notSingle:
          this.columnLockedMap[columnLockedIndex] = rowIndexBitmap;
          break;
        default:
          const index = rowIndex * 9 + c;

          this.fix(index, digit);
          this.blankSet.delete(index);
          valueList.push([index, digit]);
          break;
      }
    }

    const floorOffset = Math.floor(row / 3) * 3;
    const boxRowOffset = (row % 3) * 3;

    for (var t = 0; t !== 3; t++) {
      const b = floorOffset + t;

      const blockLockedIndex = LockedCandidateStrategy.$index(b, digit);
      if (this.blockLockedMap[blockLockedIndex] === 0) {
        continue;
      }

      const inBlockIndexBitmap =
        this.blockLockedMap[blockLockedIndex] & ~(0b111 << boxRowOffset);

      const inBlockIndex = singleBitmap(inBlockIndexBitmap);

      switch (inBlockIndex) {
        case wrongBit:
          if (block === b) {
            continue;
          }

          return [false];
        case notSingle:
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
                  const row = Math.floor(b / 3) * 3 + offset;
                  rowValueList.push([row, b, digit]);
                }
                break;
              case LockedCandidateStrategy.columnClaiming:
                {
                  const column = (b % 3) * 3 + offset;
                  columnValueList.push([column, b, digit]);
                }
                break;
            }
          }
          break;
        default:
          const index = block$indexList[b][inBlockIndex];

          this.fix(index, digit);
          this.blankSet.delete(index);
          valueList.push([index, digit]);
          break;
      }
    }

    return [true, valueList, rowValueList, columnValueList];
  }

  lockByColumnReliably(column, block, digit) {
    const valueList = [],
      rowValueList = [],
      columnValueList = [];

    for (var r = 0; r !== 9; r++) {
      const rowLockedIndex = LockedCandidateStrategy.$index(r, digit);
      const columnIndexBitmap =
        this.rowLockedMap[rowLockedIndex] & ~(1 << column);

      const columnIndex = singleBitmap(columnIndexBitmap);

      switch (columnIndex) {
        case blankBit:
        case notSingle:
          if (block === index$block[r * 9 + column]) {
            continue;
          }

          this.rowLockedMap[rowLockedIndex] = columnIndexBitmap;
          break;
        default:
          const index = r * 9 + columnIndex;

          this.fix(index, digit);
          this.blankSet.delete(index);
          valueList.push([index, digit]);
          break;
      }
    }

    const tower = Math.floor(column / 3);
    const boxColumn = column % 3;

    for (var f = 0; f !== 3; f++) {
      const b = f * 3 + tower;

      const blockLockedIndex = LockedCandidateStrategy.$index(b, digit);
      const inBlockIndexBitmap =
        this.blockLockedMap[blockLockedIndex] & ~(0b001_001_001 << boxColumn);

      const inBlockIndex = singleBitmap(inBlockIndexBitmap);

      switch (inBlockIndex) {
        case blankBit:
        case notSingle:
          if (block === b) {
            continue;
          }

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
                  const row = Math.floor(b / 3) * 3 + offset;
                  rowValueList.push([row, b, digit]);
                }
                break;
              case LockedCandidateStrategy.columnClaiming:
                {
                  const column = (b % 3) * 3 + offset;
                  columnValueList.push([column, b, digit]);
                }
                break;
            }
          }
          break;
        default:
          const index = block$indexList[b][inBlockIndex];

          this.fix(index, digit);
          this.blankSet.delete(index);
          valueList.push([index, digit]);
          break;
      }
    }

    return [valueList, rowValueList, columnValueList];
  }

  lockByColumn(column, block, digit) {
    const valueList = [],
      rowValueList = [],
      columnValueList = [];

    for (var r = 0; r !== 9; r++) {
      const rowLockedIndex = LockedCandidateStrategy.$index(r, digit);
      if (this.rowLockedMap[rowLockedIndex] === 0) {
        continue;
      }

      const columnIndexBitmap =
        this.rowLockedMap[rowLockedIndex] & ~(1 << column);

      const columnIndex = singleBitmap(columnIndexBitmap);

      switch (columnIndex) {
        case wrongBit:
          if (block === index$block[r * 9 + column]) {
            continue;
          }

          return [false];
        case notSingle:
          this.rowLockedMap[rowLockedIndex] = columnIndexBitmap;
          break;
        default:
          const index = r * 9 + columnIndex;

          this.fix(index, digit);
          this.blankSet.delete(index);
          valueList.push([index, digit]);
          break;
      }
    }

    const tower = Math.floor(column / 3);
    const boxColumn = column % 3;

    for (var f = 0; f !== 3; f++) {
      const b = f * 3 + tower;

      const blockLockedIndex = LockedCandidateStrategy.$index(b, digit);
      if (this.blockLockedMap[blockLockedIndex] === 0) {
        continue;
      }

      const inBlockIndexBitmap =
        this.blockLockedMap[blockLockedIndex] & ~(0b001_001_001 << boxColumn);

      const inBlockIndex = singleBitmap(inBlockIndexBitmap);

      switch (inBlockIndex) {
        case wrongBit:
          if (block === b) {
            continue;
          }

          return [false];
        case notSingle:
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
                  const row = Math.floor(b / 3) * 3 + offset;
                  rowValueList.push([row, b, digit]);
                }
                break;
              case LockedCandidateStrategy.columnClaiming:
                {
                  const column = (b % 3) * 3 + offset;
                  columnValueList.push([column, b, digit]);
                }
                break;
            }
          }
          break;
        default:
          const index = block$indexList[b][inBlockIndex];

          this.fix(index, digit);
          this.blankSet.delete(index);
          valueList.push([index, digit]);
          break;
      }
    }

    return [true, valueList, rowValueList, columnValueList];
  }

  clone(blankSet) {
    return new LockedCandidateStrategy(
      blankSet,
      this.rowLockedMap.slice(),
      this.columnLockedMap.slice(),
      this.blockLockedMap.slice()
    );
  }
}

LockedCandidateStrategy.$9x9Fix = new Array(9 * 9).fill(0b111_111_111);
LockedCandidateStrategy.notClaiming = 0;
LockedCandidateStrategy.rowClaiming = 1;
LockedCandidateStrategy.columnClaiming = 2;

const outDigit = 10;

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
const $9x9Slot = new Array(9 * 9).fill(".");

const index$row = $9X9Zero.slice(),
  index$column = $9X9Zero.slice(),
  index$block = $9X9Zero.slice();

const block$indexList = new Array(9).fill().map(() => []);

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
