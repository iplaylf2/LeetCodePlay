/**
 * @param {number} n
 * @return {string}
 */
var countAndSay = function(n) {
  return result[n];
};

const result = ["", "1"];
for (var say = "1", i = 2; i !== 31; i++) {
  var newSay = "",
    last = say[0],
    count = 0;
  for (const c of say) {
    if (c === last) {
      count++;
    } else {
      newSay += `${count}${last}`;
      last = c;
      count = 1;
    }
  }
  newSay += `${count}${last}`;

  say = newSay;
  result.push(say);
}
