/**
 * @param {number} x
 * @return {number}
 */
var reverse = function(x) {
  const xR = Number.parseInt(
    String(x)
      .split("")
      .reverse()
      .join(""),
    10
  );
  return x < 0 ? (-xR < min ? 0 : -xR) : xR > max ? 0 : xR;
};

const min = -Math.pow(2, 31),
  max = Math.pow(2, 31) - 1;
