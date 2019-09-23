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
    if (map.has(before)) {
      return [map.get(before), i];
    } else {
      map.set(n, i);
      i++;
    }
  }
};
