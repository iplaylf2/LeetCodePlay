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
  return mergeAll(lists);
};

class CoupleList {
  constructor(val, a, b) {
    this.val = val;
    this.a = a;
    this.b = b;
  }
  get next() {
    if (this.a.val < this.b.val) {
      const smaller = this.a.val;
      const aNext = this.a.next;
      if (aNext) {
        return new CoupleList(smaller, aNext, this.b);
      } else {
        return { val: smaller, next: this.b };
      }
    } else {
      const smaller = this.b.val;
      const bNext = this.b.next;
      if (bNext) {
        return new CoupleList(smaller, this.a, bNext);
      } else {
        return { val: smaller, next: this.a };
      }
    }
  }
}

const mergeAll = function(lists) {
  var a = (b = null);

  if (lists.length > 2) {
    const right = lists.splice(lists.length >> 1),
      left = lists;

    a = mergeAll(left);
    b = mergeAll(right);
  } else {
    [a, b] = lists;
  }

  if (a && b) {
    return new CoupleList(0, a, b).next;
  } else {
    return a || b || null;
  }
};
