const heapSort = store => {
  const array = store.array;

  const heapify = function*(array, index, end) {
    let left_child = index * 2 + 1;
    let right_child = index * 2 + 2;
    let max = index;

    if (left_child < end && array[left_child].height > array[max].height) {
      max = left_child;
    }

    if (right_child < end && array[right_child].height > array[max].height) {
      max = right_child;
    }

    if (max !== index) {
      yield store.swap(index, max);
      yield* heapify(array, max, end);
    }
  };

  const buildMaxHeap = function*(array) {
    const middle = Math.floor(array.length / 2) - 1;
    for (let i = middle; i >= 0; i--) {
      yield* heapify(array, i, array.length);
    }
  };

  const sorter = function*(array) {
    yield* buildMaxHeap(array);
    for (let i = array.length - 1; i >= 0; i--) {
      yield store.swap(0, i);
      yield* heapify(array, 0, i);
    }
  };

  return sorter(array);
};

export default heapSort;
