const quickSort = store => {
  const array = store.array;

  const recursivePivot = function*(array, left, right) {
    if (left < right) {
      const pivotIndex = yield* pivot(array, left, right);
      yield* recursivePivot(array, left, pivotIndex - 1);
      yield* recursivePivot(array, pivotIndex + 1, right);
    }
  };

  const pivot = function*(array, left, right) {
    const pivot = array[left].height;
    let side = 'right';
    while (left < right) {
      yield store.compare(left, right, 'pink');
      if (side === 'right') {
        if (array[right].height < pivot) {
          yield store.swap(left, right);
          left++;
          side = 'left';
        } else {
          right--;
        }
      } else {
        if (array[left].height > pivot) {
          yield store.swap(left, right);
          right--;
          side = 'right';
        } else {
          left++;
        }
      }
    }
    yield store.setHeight(right, pivot);
    return right;
  };

  return recursivePivot(array, 0, array.length - 1);
};

export default quickSort;
