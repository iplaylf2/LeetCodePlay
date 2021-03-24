/**
 * @param {number[]} height
 * @return {number}
 */
var trap = function (height) {
  var left_left = 0;
  var right_right = 0;

  var all = 0;

  for (var i = 0, j = height.length - 1; i <= j; ) {
    if (left_left < right_right) {
      const left_right = height[i];

      if (left_left < left_right) {
        left_left = left_right;
      } else {
        all += left_left - left_right;
      }

      i++;
    } else {
      const right_left = height[j];

      if (right_right < right_left) {
        right_right = right_left;
      } else {
        all += right_right - right_left;
      }

      j--;
    }
  }

  return all;
};
