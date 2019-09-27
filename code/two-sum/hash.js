/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
  const map = new Map();
  map.set(nums.shift(), 0);
  var i = 1;
  for (const n of nums) {
    const before = target - n;
    const beforeIndex = map.get(before);
    if (beforeIndex === undefined) {
      map.set(n, i);
      i++;
    } else {
      return [beforeIndex, i];
    }
  }
};
