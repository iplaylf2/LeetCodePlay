/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function(s) {
  if (s.length < 2) {
    return s;
  }

  var recordPoint = 0,
    maxPoint = 0,
    maxRadius = 0;
  //最远（右）检测点的中轴，左边界，右边界。
  var checkedAxis = 0,
    checkedLeft = 0,
    checkRight = 0;
  const recordArray = Array(s.length * 2 - 1).fill(0),
    down = 0,
    up = recordArray.length - 1;

  var padding = 1;
  while (checkRight < up) {
    var radius = 0;
    if (checkRight > recordPoint) {
      const mirror = checkedAxis * 2 - recordPoint; //maxAxisOfSymmetry-(recordPoint-maxAxisOfSymmetry)
      const mirrorRadius = recordArray[mirror];
      const stableOffset = Math.min(mirrorRadius, mirror - checkedLeft);
      radius = stableOffset;
    }

    while (true) {
      const border = radius + 2;
      const left = recordPoint - border,
        right = recordPoint + border;
      if (left < down - 1 || right > up + 1) {
        break;
      } else if (s[Math.ceil(left / 2)] === s[Math.floor(right / 2)]) {
        radius = border;
      } else {
        break;
      }
    }

    recordArray[recordPoint] = radius;

    if (checkRight < recordPoint + radius) {
      checkedAxis = recordPoint;
      checkedLeft = recordPoint - radius;
      checkRight = recordPoint + radius;
    }

    if (maxRadius < radius + padding) {
      maxPoint = recordPoint;
      maxRadius = radius;
    }

    padding ^= 1;
    recordPoint++;
  }

  return s.slice(
    Math.ceil((maxPoint - maxRadius) / 2),
    Math.floor((maxPoint + maxRadius) / 2 + 1)
  );
};
