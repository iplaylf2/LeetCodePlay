class ArraySegment {
  static proxy = {
    get(target, property) {
      const result = target[property];
      if (result === undefined) {
        return target.get(property);
      } else {
        return result;
      }
    },
    set(target, property, value) {
      target.set(property, value);
    }
  };

  static create(segment) {
    return new Proxy(segment, ArraySegment.proxy);
  }

  constructor(arr, start, end) {
    this.source = arr;
    this.start = start;
    this.end = end;
    this.length = end - start + 1;

    return ArraySegment.create(this);
  }

  get(property) {
    const index = Number.parseInt(property) + this.start;
    if (Number.isNaN(index)) {
      return undefined;
    } else {
      return this.source[index];
    }
  }

  set(property, value) {
    const index = Number.parseInt(property) + this.start;
    if (!Number.isNaN(index) && index < this.length) {
      this.source[index] = value;
    }
  }

  take(start, end) {
    const segment = Object.create(ArraySegment.prototype);
    segment.source = this.source;
    segment.start = this.start + start;
    segment.end = this.start + end;
    segment.length = end - start + 1;

    return ArraySegment.create(segment);
  }

  *[Symbol.iterator]() {
    for (var i = this.start; i <= this.end; i++) {
      yield this.source[i];
    }
  }
}
