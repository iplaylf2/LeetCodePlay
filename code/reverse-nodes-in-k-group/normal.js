/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} k
 * @return {ListNode}
 */
var reverseKGroup = function(head, k) {
  const start = { next: head };
  var lastPart = start;

  while (head) {
    const current = head;

    const part = new Array(k);
    for (var i = 0; i !== k; i++) {
      if (head === null) {
        lastPart.next = current;
        return start.next;
      }
      part[k - i - 1] = head;
      head = head.next;
    }

    for (var i = 0; i !== k; i++) {
      lastPart.next = part[i];
      lastPart = lastPart.next;
    }
  }
  lastPart.next = head;

  return start.next;
};
