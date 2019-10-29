/**
 * @param {number[]} nums
 * @return {number}
 */
var firstMissingPositive = function(nums) {
  const max = nums.length;

  var i = 0,
    noOne = true;
  for (const num of nums) {
    if (num < 1) {
      nums[i] = 1;
    } else if (num === 1) {
      noOne = false;
    } else if (num > max) {
      nums[i] = 1;
    }
    i++;
  }

  if (noOne) {
    return 1;
  }

  for (const num of nums) {
    const index = Math.abs(num) - 1;
    nums[index] = -Math.abs(nums[index]);
  }

  var i = 1;
  for (const num of nums) {
    if (num > 0) {
      return i;
    }
    i++;
  }
  return i;
};
