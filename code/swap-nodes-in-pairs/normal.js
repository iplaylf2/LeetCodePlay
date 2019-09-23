/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var swapPairs = function(head) {
  const start = { next: head };
  var last = start;
  while (head) {
    const second = head.next;
    if (second === null) {
      break;
    }
    const first = head;

    head = second.next;

    last.next = second;
    second.next = first;
    last = first;
  }
  last.next = head;
  return start.next;
};
