/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function(height) {
  const left = 0,
    right = height.length - 1;
  if (height[left] < height[right]) {
    return maxInLeftToRight(height, left, right, height[left] * right);
  } else {
    return maxInRightToLeft(height, left, right, height[right] * right);
  }
};

const maxInLeftToRight = function(wall, left, right, max) {
  const rightTop = wall[right];
  var leftTop = wall[left];

  while (true) {
    left++;
    if (left === right) {
      return max;
    }

    const newTop = wall[left];
    if (newTop > leftTop) {
      var lowerLeft = newTop < rightTop;
      if (lowerLeft) {
        const newArea = newTop * (right - left);
        if (newArea >= max) {
          leftTop = newTop;
          max = newArea;
        }
      } else {
        const newArea = rightTop * (right - left);
        max = Math.max(max, newArea);
        return maxInRightToLeft(wall, left, right, max);
      }
    }
  }
};

const maxInRightToLeft = function(wall, left, right, max) {
  const leftTop = wall[left];
  var rightTop = wall[right];

  while (true) {
    right--;
    if (right === left) {
      return max;
    }

    const newTop = wall[right];
    if (newTop > rightTop) {
      var lowerRight = newTop < leftTop;
      if (lowerRight) {
        const newArea = newTop * (right - left);
        if (newArea >= max) {
          rightTop = newTop;
          max = newArea;
        }
      } else {
        const newArea = leftTop * (right - left);
        max = Math.max(max, newArea);
        return maxInLeftToRight(wall, left, right, max);
      }
    }
  }
};
