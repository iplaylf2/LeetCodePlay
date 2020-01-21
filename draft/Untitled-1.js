/**
 * @param {character[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 */
var solveSudoku = function(board) {
  var cellArray = cloneCellArray(cellArraySource);
  var { xBlockArray, yBlockArray, areaBlockArray } = cloneBlock(blockSource);

  for (var y = 0; y !== 9; y++) {
    for (var x = 0; x !== 9; x++) {
      const value = board[y][x];
      xBlock = xBlockArray[x];
      yBlock = yBlockArray[y];
      const index = y * 9 + x;
      areaBlock = areaBlockArray[index];

      if (value === ".") {
        const position = { x, y };
        xBlock.whiteCell.push(position);
        yBlock.whiteCell.push(position);
        areaBlock.whiteCell.push(position);
      } else {
        cellArray[index] = null;
        xBlock.waitingValue[value] = null;
        yBlock.waitingValue[value] = null;
        areaBlock.waitingValue[value] = null;
        xBlock.waitingLength--;
        yBlock.waitingLength--;
        areaBlock.waitingLength--;
        if (xBlock.waitingLength === 0) {
          xBlockArray[x] = null;
        }
        if (yBlock.waitingLength === 0) {
          yBlockArray[y] = null;
        }
        if (areaBlock.waitingLength === 0) {
          areaBlockArray[index] = null;
        }
      }
    }
  }
};

const $9item = new Array(9).fill(null);
const $81item = new Array(81).fill(null);
const indexMap = $81item.map((_, i) => {
  const x = i % 9;
  const y = (i - x) / 9;
  return Math.floor(y / 3) * 3 + Math.floor(x / 3);
});

const createCell = function() {
  return {
    bitmap: 0b111_111_111_0,
    length: 9
  };
};
const cellArraySource = $81item.map(createCell);

const createWaiting = function() {
  return {
    bitmap: 0b111_111_111,
    length: 9
  };
};
const createBlock = function() {
  return {
    whiteCell: [],
    waitingValue: $9item.map(createWaiting),
    waitingLength: 9
  };
};
const blockSource = {
  xBlockArray: $9item.map(createBlock),
  yBlockArray: $9item.map(createBlock),
  areaBlockArray: $9item.map(createBlock)
};

const cloneCellArray = function(cellArray) {
  return cellArray.map(item => ({ ...item }));
};

const cloneBlockItem = function(blockItem) {
  return {
    whiteCell: blockItem.whiteCell.map(item => ({ ...item })),
    waitingValue: blockItem.waitingValue.map(item => ({ ...item })),
    waitingLength: blockItem.waitingLength
  };
};
const cloneBlock = function(block) {
  return {
    xBlockArray: block.xBlockArray.map(cloneBlockItem),
    yBlockArray: block.xBlockArray.map(cloneBlockItem),
    areaBlockArray: block.xBlockArray.map(cloneBlockItem)
  };
};

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
