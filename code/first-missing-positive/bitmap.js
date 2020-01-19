/**
 * @param {number[]} nums
 * @return {number}
 */
var firstMissingPositive = function(nums) {
  const max = nums.length + 1,
    bitmap = new Array(max).fill(true);

  bitmap[0] = false;

  for (const num of nums) {
    if (num > 0 && num < max) {
      bitmap[num] = false;
    }
  }

  const miss = bitmap.indexOf(true);
  return miss === -1 ? max : miss;
};
