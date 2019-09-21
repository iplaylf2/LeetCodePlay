/**
 * @param {number} x
 * @return {boolean}
 */
var isPalindrome = function(x) {
  if (x === 0) {
    return true;
  } else if (x < 0 || x % 10 === 0) {
    return false;
  }

  var xR = 0;
  while (x > xR) {
    const tail = x % 10;
    x = (x - tail) / 10;
    xR = xR * 10 + tail;
  }

  return x === xR || x === Math.floor(xR / 10);
};
