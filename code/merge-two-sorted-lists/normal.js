/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var mergeTwoLists = function(l1, l2) {
  const start = { next: null };

  var lastSorted = start;
  while (l1 && l2) {
    if (l1.val < l2.val) {
      lastSorted.next = l1;
      l1 = l1.next;
    } else {
      lastSorted.next = l2;
      l2 = l2.next;
    }
    lastSorted = lastSorted.next;
  }

  lastSorted.next = l1 || l2;

  return start.next;
};
