/**
 * @param {string} str
 * @return {number}
 */
var myAtoi = function(str) {
  const result = Number.parseInt(str, 10);
  return Number.isNaN(result)
    ? 0
    : result < 0
    ? result < min
      ? min
      : result
    : result > max
    ? max
    : result;
};

const min = -Math.pow(2, 31),
  max = Math.pow(2, 31) - 1;
