/**
 * @param {string} s
 * @param {string[]} words
 * @return {number[]}
 */
var findSubstring = function(s, words) {
  if (words.length === 0) {
    return [];
  }

  const wordMap = new Map();
  for (var word of words) {
    wordMap.set(word, (wordMap.get(word) || 0) + 1);
  }
  const wordRecord = new Map(
    Array.from(wordMap.keys()).map(word => [word, { count: 0 }])
  );

  const stringLength = s.length,
    wordCount = words.length,
    wordLength = words[0].length,
    groupLength = wordCount * wordLength,
    wordRecordArray = [],
    clearWordRecordArray = function() {
      for (var record of wordRecordArray) {
        record.count = 0;
      }
      wordRecordArray.splice(0, wordRecordArray.length);
    };

  const result = [];
  for (var start = 0; start !== wordLength; start++) {
    var head = start,
      g = 0,
      gIndex = head;

    if (head + groupLength > stringLength) {
      break;
    }

    while (true) {
      const gTail = gIndex + wordLength,
        current = s.substring(gIndex, gTail),
        expect = wordMap.get(current);

      if (expect === undefined) {
        head = gTail;
        clearWordRecordArray();

        if (head + groupLength > stringLength) {
          break;
        }

        g = 0;
        gIndex = head;
      } else {
        var record = wordRecord.get(current);

        if (record.count === expect) {
          var removeCount = 1;
          for (var r of wordRecordArray) {
            if (r === record) {
              break;
            }

            r.count--;
            removeCount++;
          }

          head += wordLength * removeCount;
          if (head + groupLength > stringLength) {
            clearWordRecordArray();
            break;
          }

          g = g - removeCount + 1;
          gIndex += wordLength;
          wordRecordArray.splice(0, removeCount);
          wordRecordArray.push(record);
          continue;
        }

        g++;
        if (g === wordCount) {
          result.push(head);
          head += wordLength;
          if (head + groupLength > stringLength) {
            clearWordRecordArray();
            break;
          }

          g--;
          gIndex += wordLength;

          record.count++;
          wordRecordArray.push(record);

          const first = wordRecordArray.shift();
          first.count--;
        } else {
          gIndex += wordLength;

          record.count++;
          wordRecordArray.push(record);
        }
      }
    }
  }

  return result;
};
