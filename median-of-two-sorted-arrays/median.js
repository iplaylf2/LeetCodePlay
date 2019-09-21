/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function(nums1, nums2) {
  if (nums1.length > nums2.length) {
    [nums1, nums2] = [nums2, nums1];
  }
  const total = nums1.length + nums2.length;

  //.... an |          a0 a1 a2|
  //....bx-1|bx                |b0 b1 b2 (b3)
  var dividerA = nums1.length;
  var dividerB = (total >> 1) - nums1.length;

  var downA = -1,
    upA = nums1.length;

  var leftA, rightA, leftB, rightB;
  while (true) {
    [leftA, rightA] = getCouple(nums1, dividerA);
    [leftB, rightB] = getCouple(nums2, dividerB);

    if (leftA > rightB) {
      //dividerA向左移，dividerB向右移

      upA = dividerA - 1;
      const offset = (dividerA - downA + 1) >> 1;
      dividerA -= offset;
      dividerB += offset;
    } else if (leftB > rightA) {
      //dividerB向左移，dividerA向右移

      downA = dividerA + 1;
      const offset = (upA - dividerA + 1) >> 1;
      dividerA += offset;
      dividerB -= offset;
    } else {
      //找到了正确的分割处。
      break;
    }
  }

  const oneMid = total % 2 === 1;
  if (oneMid) {
    return Math.min(rightA, rightB);
  } else {
    return (Math.max(leftA, leftB) + Math.min(rightA, rightB)) / 2;
  }
};

const getCouple = function(nums, divider) {
  const left = nums[divider - 1];
  const right = nums[divider];
  return [
    left === undefined ? -Infinity : left,
    right === undefined ? Infinity : right
  ];
};
