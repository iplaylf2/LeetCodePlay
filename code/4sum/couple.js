/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[][]}
 */
var fourSum = function(nums, target) {
  if (nums.length < 4) {
    return [];
  }
  const coupleMap = new Map();

  for (var i = 0; i !== nums.length - 1; i++) {
    for (var j = i + 1; j !== nums.length; j++) {
      const part = nums[i] + nums[j];
      var group;
      if (coupleMap.has(part)) {
        group = coupleMap.get(part);
      } else {
        group = [];
        coupleMap.set(part, group);
      }
      group.push([i, j]);
    }
  }

  const recoredSet = new Set();

  const resultMap = new Map();
  for (var [part, coupleGroup] of coupleMap) {
    const rest = target - part;
    if (coupleMap.has(rest)) {
      if (recoredSet.has(part)) {
        continue;
      }

      const restGroup = coupleMap.get(rest);
      for (const a of coupleGroup) {
        for (const b of restGroup) {
          const fullIndex = a.concat(b);
          if (new Set(fullIndex).size < 4) {
            continue;
          }
          const full = fullIndex.map(i => nums[i]);
          full.sort((a, b) => a - b);
          resultMap.set(full.join(","), full);
        }
      }

      recoredSet.add(part);
      recoredSet.add(rest);
    }
  }

  return Array.from(resultMap.values());
};