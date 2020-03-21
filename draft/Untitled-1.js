/**
 * @param {character[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 */
var solveSudoku = function (board) {
  const sudokuState = new SudokuState(board);
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
  static copyBoard() {

  }

  constructor(board) {
  }

  reasoningReliably() { }

  reasoning() {
  }

  guess() {

  }

  fill(board) {

  }
}

// {
//   bitmap: 0b111_111_111_0,
//   length: 9
// }

const exclusive = function (item, digit) {
  const digitBit = 1 << digit;
  if (item.bitmap & digitBit) {
    item.bitmap ^= digitBit;
    item.length--;
    return item.length === 1 ? Math.log2(item.bitmap) : NaN;
  } else {
    return NaN;
  }
};
