/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} n
 * @return {ListNode}
 */
var removeNthFromEnd = function(head, n) {
  const start = { next: head };
  var a = start,
    b = start;
  for (var i = 0; i !== n + 1; i++) {
    a = a.next;
  }

  while (a) {
    a = a.next;
    b = b.next;
  }
  b.next = b.next.next;

  return start.next;
};
