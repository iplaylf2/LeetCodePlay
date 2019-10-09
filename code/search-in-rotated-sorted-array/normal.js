/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function(nums, target) {
  const last = nums.length - 1;

  var left = 0,
    right = last,
    mid = (left + right) >> 1;

  while (left < right) {
    const midValue = nums[mid];
    if (midValue < nums[right]) {
      right = mid - 1;
      if (midValue < nums[right]) {
        break;
      }
    } else {
      left = mid + 1;
    }
    mid = (left + right) >> 1;
  }

  const leftResult = searchSp(nums, 0, mid - 1, target);
  return leftResult === -1 ? searchSp(nums, mid, last, target) : leftResult;
};

const searchSp = function(nums, low, up, target) {
  while (low <= up) {
    const mid = (low + up) >> 1,
      midValue = nums[mid];
    if (midValue === target) {
      return mid;
    } else if (midValue < target) {
      low = mid + 1;
    } else {
      up = mid - 1;
    }
  }

  return -1;
};
