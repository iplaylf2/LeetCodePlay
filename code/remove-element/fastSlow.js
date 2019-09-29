/**
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
var removeElement = function(nums, val) {
  var slow = 0;

  for (const num of nums) {
    if (num !== val) {
      nums[slow] = num;
      slow++;
    }
  }

  return slow;
};
