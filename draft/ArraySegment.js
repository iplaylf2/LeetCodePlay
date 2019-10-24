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

  constructor(arr, start, end) {
    this.source = arr;
    this.start = start;
    this.end = end;
    this.length = end - start + 1;

    return new Proxy(this, ArraySegment.proxy);
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

  *[Symbol.iterator]() {
    for (var i = this.start; i <= this.end; i++) {
      yield this.source[i];
    }
  }
}
