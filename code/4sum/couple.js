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
      var group = coupleMap.get(part);
      if (!group) {
        group = [];
        coupleMap.set(part, group);
      }
      group.push([i, j]);
    }
  }

  const recoredSet = new Set();

  const resultMap = new Map();
  for (const [part, coupleGroup] of coupleMap) {
    const rest = target - part;
    const restGroup = coupleMap.get(rest);
    if (restGroup) {
      if (recoredSet.has(part)) {
        continue;
      }

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
