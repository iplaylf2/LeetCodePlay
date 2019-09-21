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
var addTwoNumbers = function(l1, l2) {
  const result = {};
  var current = result;

  var carry = 0;
  do {
    const a = l1.val;
    const b = l2.val;
    const sum = a + b + carry;

    current.next = {
      val: sum % 10,
      next: null
    };
    current = current.next;

    carry = (sum / 10) >> 0;

    l1 = l1.next;
    l2 = l2.next || defaultNode;
  } while (l1 !== null);

  if (l2 !== defaultNode) {
    do {
      const b = l2.val;
      const sum = b + carry;

      current.next = {
        val: sum % 10,
        next: null
      };
      current = current.next;

      carry = (sum / 10) >> 0;

      l2 = l2.next;
    } while (l2 !== null);
  }

  if (carry === 1) {
    current.next = {
      val: 1,
      next: null
    };
  }

  return result.next;
};

const defaultNode = {
  val: 0,
  next: null
};
