/**
 * @param {number} dividend
 * @param {number} divisor
 * @return {number}
 */
var divide = function(dividend, divisor) {
  const result = Number.parseInt(dividend / divisor);
  return result < min ? max : result > max ? max : result;
};

const min = -Math.pow(2, 31),
  max = Math.pow(2, 31) - 1;
