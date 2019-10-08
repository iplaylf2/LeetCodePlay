/**
 * @param {string} s
 * @return {number}
 */
var longestValidParentheses = function(s) {
  var stack = 0;
  const stackMap = new Map([[0, -1]]);

  var max = 0;

  var i = 0;
  for (const c of s) {
    if (c === "(") {
      stack++;
      stackMap.set(stack, i);
    } else {
      if (stack === 0) {
        stackMap.set(0, i);
      } else {
        stackMap.delete(stack);

        stack--;
        const startIndex = stackMap.get(stack);
        max = Math.max(max, i - startIndex);
      }
    }
    i++;
  }

  return max;
};
