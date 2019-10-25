/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
var combinationSum = function(candidates, target) {
  candidates.sort((a, b) => a - b);
  return getCombinationSum(candidates, 0, target);
};

const getCombinationSum = function(candidates, start, target) {
  const result = [];
  for (var i = start; i !== candidates.length; i++) {
    const num = candidates[i],
      rest = target - num;
    if (rest === 0) {
      result.push([num]);
      break;
    } else if (rest >= num) {
      const part = getCombinationSum(candidates, i, rest);
      for (const combination of part) {
        combination.push(num);
        result.push(combination);
      }
    }
  }
  return result;
};
