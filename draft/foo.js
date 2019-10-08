/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function(nums, target) {
  var left = 0,
    right = nums.length - 1;
  while (true) {
    mid = (left + right) >> 1;

    var midValue = nums[mid];

    if (midValue < nums[right]) {
      if (midValue < nums[mid - 1]) {
        break;
      } else {
        right = mid - 1;
      }
    } else {
      left = mid + 1;
    }
  }

  // 567801234
  // 012345678
};
