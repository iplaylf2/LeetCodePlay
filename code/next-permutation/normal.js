/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var nextPermutation = function(nums) {
  const last = nums.length - 1;

  var i = last,
    hasLow = false;
  for (; i !== 0; i--) {
    if (nums[i - 1] < nums[i]) {
      hasLow = true;
      break;
    }
  }

  if (hasLow) {
    const low = nums[i - 1];
    var j = i + 1;
    for (; j !== nums.length; j++) {
      if (nums[j] <= low) {
        break;
      }
    }
    nums[i - 1] = nums[j - 1];
    nums[j - 1] = low;
  }

  for (var j = last; j > i; i++, j--) {
    const forSwap = nums[i];
    nums[i] = nums[j];
    nums[j] = forSwap;
  }
};
