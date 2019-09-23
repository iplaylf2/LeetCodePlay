/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function(nums) {
  var slow = 0;

  var last = -Infinity;
  for (const num of nums) {
    if (num !== last) {
      nums[slow] = num;
      last = num;

      slow++;
    }
  }
  return slow;
};
