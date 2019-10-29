/**
 * @param {number[]} nums
 * @return {number}
 */
var firstMissingPositive = function(nums) {
  const max = nums.length,
    bitmap = new Array(max + 1).fill(true);

  for (const num of nums) {
    if (num > 0) {
      if (num <= max) {
        bitmap[num] = false;
      }
    }
  }

  bitmap[0] = false;
  var i = 0;
  for (const white of bitmap) {
    if (white) {
      return i;
    }
    i++;
  }
  return i;
};
