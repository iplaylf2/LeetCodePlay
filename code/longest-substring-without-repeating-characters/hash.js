/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
  const map = new Map();
  var left = 0;
  var max = 0;

  var i = 0;
  for (var c of s) {
    const lastC = map.get(c);
    if (lastC !== undefined) {
      max = Math.max(i - left, max);
      left = Math.max(lastC + 1, left);
    }

    map.set(c, i++);
  }

  return Math.max(i - left, max);
};
