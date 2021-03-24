/**
 * @param {number[]} height
 * @return {number}
 */
var trap = function (height) {
  var part = 0;
  var all = 0;

  var left = 0;

  for (const right of height) {
    if (right < left) {
      part += left - right;
    } else {
      left = right;
      all += part;
      part = 0;
    }
  }

  if (left === height[height.length - 1]) {
    return all;
  } else if (height.length <= 2) {
    return 0;
  }

  const top = left;
  part = 0;

  var right = 0;

  for (var i = height.length - 1; ; i--) {
    const left = height[i];

    if (left < right) {
      part += right - left;
    } else {
      right = left;
      all += part;
      part = 0;
    }

    if (left === top) {
      break;
    }
  }

  return all;
};
