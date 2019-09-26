//good suffix shift table
const getGsst = function(patten) {
  //common substring length table
  const cslt = Array(patten.length);
  const tail = patten.length - 1;
  cslt[tail] = patten.length;

  var lastStart = Infinity,
    lastEnd = Infinity;
  for (var i = tail - 1; i >= 0; i--) {
    if (i > lastEnd) {
      const shadow = tail - (lastStart - i);
      if (cslt[shadow] < i - lastEnd) {
        cslt[i] = cslt[shadow];
        continue;
      }
    }

    var j = i;
    while (j >= 0 && patten[j] === patten[tail - (i - j)]) {
      j--;
    }
    cslt[i] = i - j;

    lastStart = i;
    lastEnd = j;
  }

  //good suffix shift table
  const gsst = Array(patten.length);
  gsst[0] = patten.length;

  //prefix and suffix
  var offset = patten.length;
  for (var j = tail - 2; j > 0; j--) {
    const length = tail - j - 1;
    const i = length - 1;
    if (length === cslt[i]) {
      offset = tail - i;
    }
    gsst[j] = offset;
  }

  //part and suffix
  for (var i = 0; i !== tail; i++) {
    const j = tail - cslt[i];
    gsst[j] = tail - i;
  }

  return gsst;
};

const getBct = function(patten) {
  const badChars = new Map();

  var i = 0,
    length = patten.length;
  for (var i = 0; i !== length - 1; i++) {
    badChars.set(patten.charAt(i), length - i - 1);
  }

  return badChars;
};

const bm = function(str, patten) {
  if (patten === "") {
    return 0;
  }

  const bct = getBct(patten);
  const gsst = getGsst(patten);

  const jStart = patten.length - 1;
  for (var tail = patten.length - 1; tail < str.length; ) {
    var i = tail,
      j = jStart;
    while (str[i] === patten[j]) {
      i--;
      j--;
      if (j === -1) {
        return tail - patten.length + 1;
      }
    }
    if (bct.has(str[i])) {
      tail += Math.max(bct.get(str[i]), gsst[j]);
    } else {
      tail += patten.length;
    }
  }

  return -1;
};
