/**
 * @param {string} s
 * @param {number} numRows
 * @return {string}
 */
var convert = function(s, numRows) {
  if (numRows === 1) {
    return s;
  }

  const length = s.length,
    step = numRows * 2 - 2;

  var result = "";

  // var firstRow = "";
  for (var i = 0; i < length; i += step) {
    // firstRow += s.charAt(i);
    result += s.charAt(i);
  }

  // const middleRows = new Array(numRows - 2);
  const support = length + numRows;
  for (var i = 1; i !== numRows - 1; i++) {
    // var row = "";
    for (var j = 0; j < support; j += step) {
      // row += s.charAt(j - i);
      // row += s.charAt(j + i);
      result += s.charAt(j - i);
      result += s.charAt(j + i);
    }
    // middleRows[i] = row;
  }

  // var lastRow = "";
  for (var i = numRows - 1; i < length; i += step) {
    // lastRow += s.charAt(i);
    result += s.charAt(i);
  }

  // return [firstRow, ...middleRows, lastRow].join("");
  return result;
};
