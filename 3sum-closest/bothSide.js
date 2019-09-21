/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var threeSumClosest = function(nums, target) {
  nums.sort((a, b) => a - b);

  var result = NaN,
    closest = Infinity;

  const limitI = nums.length - 3,
    limitK = nums.length - 1;
  for (var i = 0; i <= limitI; i++) {
    if (nums[i - 1] === nums[i]) {
      continue;
    }
    const ask = target - nums[i];
    for (var j = i + 1, k = limitK; j < k; ) {
      const answer = nums[j] + nums[k];
      const diff = ask - answer;
      const close = Math.abs(diff);
      if (close === 0) {
        return target;
      } else if (close < closest) {
        closest = close;
        result = nums[i] + answer;
      }

      if (diff > 0) {
        do {
          j++;
        } while (nums[j - 1] === nums[j]);
      } else {
        do {
          k--;
        } while (nums[k] === nums[k + 1]);
      }
    }
  }

  return result;
};
