/**
 * @param {string} s
 * @return {number}
 */
var romanToInt = function(s) {
  return s.split(regex).reduce((num, c) => num + table[c], 0);
};

const regex = /((?:CM)|M|(?:CD)|D|(?:XC)|C|(?:XL)|L|(?:IX)|X|(?:IV)|V)/;

const seed = [
  ["I", "V", "X", 1],
  ["X", "L", "C", 10],
  ["C", "D", "M", 100],
  ["M", "-", "-", 1000]
];
const table = seed
  .map(([I, V, X, p]) => ({
    [`${I}`]: 1 * p,
    [`${I}${I}`]: 2 * p,
    [`${I}${I}${I}`]: 3 * p,
    [`${I}${V}`]: 4 * p,
    [`${V}`]: 5 * p,
    [`${V}${I}`]: 6 * p,
    [`${V}${I}${I}`]: 7 * p,
    [`${V}${I}${I}${I}`]: 8 * p,
    [`${I}${X}`]: 9 * p
  }))
  .reduce((r, c) => Object.assign(r, c), {});
table[""] = 0;
