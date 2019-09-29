/**
 * @param {string} digits
 * @return {string[]}
 */
var letterCombinations = function(digits) {
  if (digits === "") {
    return [];
  }
  return press(digits, table[digits[0]], 1);
};

const table = [
  ,
  ,
  ["a", "b", "c"],
  ["d", "e", "f"],
  ["g", "h", "i"],
  ["j", "k", "l"],
  ["m", "n", "o"],
  ["p", "q", "r", "s"],
  ["t", "u", "v"],
  ["w", "x", "y", "z"]
];

const press = function(digits, combine, i) {
  if (i === digits.length) {
    return combine;
  }

  const append = table[digits[i]];
  const newCombine = [];
  for (const pre of combine) {
    for (const c of append) {
      newCombine.push(pre + c);
    }
  }
  return press(digits, newCombine, i + 1);
};
