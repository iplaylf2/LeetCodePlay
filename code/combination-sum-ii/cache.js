/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
var combinationSum2 = function(candidates, target) {
  const candidatesMap = new Map();
  for (const num of candidates) {
    candidatesMap.set(num, (candidatesMap.get(num) || 0) + 1);
  }
  candidates = Array.from(candidatesMap.keys());
  candidates.sort((a, b) => a - b);
  const candidatesCount = candidates.map(num => candidatesMap.get(num));

  return getCombinationSum2(
    candidates,
    candidatesCount,
    target,
    candidates.map(() => new Map()),
    0
  );
};

const getCombinationSum2 = function(
  candidates,
  candidatesCount,
  target,
  cache,
  start
) {
  const result = [],
    num = candidates[start],
    next = start + 1,
    limit = candidatesCount[start];

  if (next === candidates.length) {
    const count = Math.floor(target / num);
    if (count <= limit && count * num === target) {
      result.push(new Array(count).fill(num));
    }
  } else {
    for (
      var count = 0, rest = target;
      count <= limit && rest > num;
      count++, rest -= num
    ) {
      const part =
          cache[next].get(rest) ||
          getCombinationSum2(candidates, candidatesCount, rest, cache, next),
        nNum = new Array(count).fill(num);
      result.push(...part.map(c => c.concat(nNum)));
    }

    if (rest === num && count < limit) {
      result.push(new Array(count + 1).fill(num));
    }
  }

  cache[start].set(target, result);

  return result;
};
