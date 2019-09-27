/**
 * @param {number} n
 * @return {string[]}
 */
var generateParenthesis = function(n) {
  return getRecord(0, 2 * n);
};

const getRecord = function(stack, rest) {
  const key = `${stack},${rest}`;

  const cache = recordMap.get(key);
  if (cache) {
    return cache;
  }

  const result = [];
  if (stack === rest) {
    result.push(")".repeat(stack));
  } else {
    //stack+1,rest-1
    const putOneResult = getRecord(stack + 1, rest - 1).map(part => "(" + part);
    result.push(...putOneResult);

    if (stack > 0) {
      //stack-1,rest-1
      const putCoupleResulyt = getRecord(stack - 1, rest - 1).map(
        part => ")" + part
      );
      result.push(...putCoupleResulyt);
    }
  }
  recordMap.set(key, result);
  return result;
};

const recordMap = new Map([["1,1", [")"]]]);
