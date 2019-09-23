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
    if (map.has(c)) {
      max = Math.max(i - left, max);
      left = Math.max(map.get(c) + 1, left);
    }

    map.set(c, i++);
  }

  return Math.max(i - left, max);
};
