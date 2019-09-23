/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
  const leftStack = [];

  for (var c of s) {
    switch (c) {
      case "(":
      case "{":
      case "[": {
        leftStack.push(c);
        break;
      }
      case ")":
      case "}":
      case "]": {
        const left = leftStack.pop();
        if (pair[left] !== c) {
          return false;
        }
        break;
      }
    }
  }
  return leftStack.length === 0;
};

const pair = {
  "(": ")",
  "{": "}",
  "[": "]"
};
