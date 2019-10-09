/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var searchRange = function(nums, target) {
  var left = 0,
    right = nums.length - 1;

  var targetIndex = -1,
    low = -1,
    up = -1;
  while (left <= right) {
    const mid = (left + right) >> 1,
      midValue = nums[mid];

    if (midValue === target) {
      targetIndex = mid;
      low = left;
      up = right;
      break;
    } else if (midValue < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  if (targetIndex === -1) {
    return [-1, -1];
  }

  left = low;
  right = targetIndex;

  var targetLeft = targetIndex;
  while (left <= right) {
    const mid = (left + right) >> 1,
      midValue = nums[mid];
    if (midValue === target) {
      right = mid - 1;
      if (nums[right] !== target) {
        targetLeft = mid;
        break;
      }
    } else if (midValue < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  left = targetIndex;
  right = up;

  var targetRight = targetIndex;
  while (left <= right) {
    const mid = (left + right) >> 1,
      midValue = nums[mid];
    if (midValue === target) {
      left = mid + 1;
      if (nums[left] !== target) {
        targetRight = mid;
        break;
      }
    } else if (midValue < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return [targetLeft, targetRight];
};
