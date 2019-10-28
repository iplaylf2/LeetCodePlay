/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
var combinationSum = function(candidates, target) {
  candidates.sort((a, b) => a - b);
  return getCombinationSum(
    candidates,
    target,
    candidates.map(() => new Map()),
    0
  );
};

const getCombinationSum = function(candidates, target, cache, start) {
  const result = [],
    num = candidates[start],
    next = start + 1;

  if (next === candidates.length) {
    const count = Math.floor(target / num);
    if (count * num === target) {
      result.push(new Array(count).fill(num));
    }
  } else {
    for (var count = 0, rest = target; rest > num; count++, rest -= num) {
      const part =
          cache[next].get(rest) ||
          getCombinationSum(candidates, rest, cache, next),
        nNum = new Array(count).fill(num);
      result.push(...part.map(c => c.concat(nNum)));
    }

    if (rest === num) {
      result.push(new Array(count + 1).fill(num));
    }
  }

  cache[start].set(target, result);

  return result;
};
