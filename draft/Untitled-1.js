/**
 * @param {character[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 */
var solveSudoku = function(board) {
  const cellArray = cloneCellArray(cellArraySource);
  const blockMap = cloneBlock(blockSource);
  init(board, cellArray, blockMap);
};

const init = function(board, cellArray, blockMap) {
  const { xBlockArray, yBlockArray, areaBlockArray } = blockMap;

  var count = 0;

  for (var y = 0; y !== 9; y++) {
    for (var x = 0; x !== 9; x++) {
      const value = board[y][x];
      const xBlock = xBlockArray[x];
      const yBlock = yBlockArray[y];
      const index = y * 9 + x;
      const areaIndex = areaIndexMap(index);
      const areaBlock = areaBlockArray[areaIndex];

      if (value === ".") {
        const position = { x, y };
        xBlock.whiteCell.push(position);
        yBlock.whiteCell.push(position);
        areaBlock.whiteCell.push(position);
      } else {
        count++;

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
          areaBlockArray[areaIndex] = null;
        }
      }
    }
  }

  if (count === 81) {
    return [count];
  }

  const confirmArray = [];

  for (var y = 0; y !== 9; y++) {
    for (var x = 0; x !== 9; x++) {
      const value = board[y][x];
      if (value !== ".") {
        count += foo(
          x,
          y,
          value,
          xBlockArray,
          yBlockArray,
          areaBlockArray,
          confirmArray
        );
      }
    }
  }

  return [count, confirmArray];
};

const foo = function(
  x,
  y,
  value,
  cellArray,
  xBlockArray,
  yBlockArray,
  areaBlockArray,
  confirmArray
) {
  var count = 0;

  const xBlock = xBlockArray[x];
  if (xBlock !== null) {
    for (const { x, y } of xBlock.whiteCell) {
      const index = y * 9 + x;
      board(index);
    }
  }

  const yBlock = yBlockArray[y];
  if (yBlock !== null) {
  }

  const index = y * 9 + x;
  const areaIndex = areaIndexMap(index);
  const areaBlock = areaBlockArray[areaIndex];
  if (areaBlock !== null) {
  }

  return 0;
};

const $9item = new Array(9).fill(null);
const $81item = new Array(81).fill(null);
const areaIndexMap = $81item.map((_, i) => {
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

const contextSource = {
  cellArray: cellArraySource,
  blockMap: blockSource,
  count: 0
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

const copyContext = function(context) {
  return {
    cellArray: cloneCellArray(context.cellArray),
    blockMap: cloneBlock(context.blockMap),
    count: context.count
  };
};

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
