/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var searchInsert = function(nums, target) {
  var left = 0,
    right = nums.length - 1,
    mid = Math.ceil((left + right) / 2);

  while (left <= right) {
    const midValue = nums[mid];

    if (midValue === target) {
      break;
    } else if (midValue < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
    mid = Math.ceil((left + right) / 2);
  }

  return mid;
};
