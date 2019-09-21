/**
 * @param {number} num
 * @return {string}
 */
var intToRoman = function(num) {
  var result = "";

  for (var i = 0; num !== 0; i++) {
    const tail = num % 10;
    num = (num - tail) / 10;

    result = table[i][tail] + result;
  }

  return result;
};

const seed = [["I", "V", "X"], ["X", "L", "C"], ["C", "D", "M"], ["M", "", ""]];
const table = seed.map(([I, V, X]) => [
  "",
  `${I}`,
  `${I}${I}`,
  `${I}${I}${I}`,
  `${I}${V}`,
  `${V}`,
  `${V}${I}`,
  `${V}${I}${I}`,
  `${V}${I}${I}${I}`,
  `${I}${X}`
]);
