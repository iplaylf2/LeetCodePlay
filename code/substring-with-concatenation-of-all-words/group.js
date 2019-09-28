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

  const stringLength = s.length,
    wordCount = words.length,
    wordLength = words[0].length,
    groupLength = wordCount * wordLength;

  const result = [];

  for (var start = 0; start !== wordLength; start++) {
    const wordRecord = new Map(),
      wordRecordArray = [];

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
        if (head + groupLength > stringLength) {
          break;
        }

        g = 0;
        gIndex = head;
        wordRecord.clear();
        wordRecordArray.splice(0, wordRecordArray.length);
      } else {
        var record = wordRecord.get(current);
        if (record) {
          if (record.count === expect) {
            var i = 0;
            for (var r of wordRecordArray) {
              if (r === record) {
                break;
              }

              if (r.count === 1) {
                wordRecord.delete(r.word);
              } else {
                r.count--;
              }

              i++;
            }

            i++;
            head += wordLength * i;
            if (head + groupLength > stringLength) {
              break;
            }

            g = g - i + 1;
            gIndex += wordLength;
            wordRecordArray.splice(0, i);
            wordRecordArray.push(record);
            continue;
          }
        } else {
          record = { count: 0, word: current };
          wordRecord.set(current, record);
        }

        g++;
        if (g === wordCount) {
          result.push(head);
          head += wordLength;
          if (head + groupLength > stringLength) {
            break;
          }

          g--;
          gIndex += wordLength;

          record.count++;
          wordRecordArray.push(record);

          const first = wordRecordArray.shift();
          if (first.count === 1) {
            wordRecord.delete(first.word);
          } else {
            first.count--;
          }
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
