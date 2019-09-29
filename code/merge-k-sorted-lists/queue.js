/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode[]} lists
 * @return {ListNode}
 */
var mergeKLists = function(lists) {
  const sortedLists = [];
  for (const list of lists) {
    if (list) {
      sortedLists.push(list);
    }
  }
  sortedLists.sort((a, b) => a.val - b.val);

  var length = sortedLists.length;
  if (length === 0) {
    return null;
  }

  const start = sortedLists[0];
  var lastSorted = start;
  while (length > 1) {
    sortedLists[0] = sortedLists[0].next;

    if (sortedLists[0]) {
      //let sortedLists[0] to smallest

      const insertNode = sortedLists[0],
        insertVal = insertNode.val;

      var i = 1;
      for (; i !== length && insertVal >= sortedLists[i].val; i++) {
        sortedLists[i - 1] = sortedLists[i];
      }
      sortedLists[i - 1] = insertNode;
    } else {
      //sortedLists[0]===null,remove sortedLists[0]

      for (var i = 1; i !== length; i++) {
        sortedLists[i - 1] = sortedLists[i];
      }
      length--;
    }

    lastSorted.next = sortedLists[0];
    lastSorted = lastSorted.next;
  }

  lastSorted.next = sortedLists[0].next;

  return start;
};
