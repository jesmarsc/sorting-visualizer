const mergeSort = store => {
  const array = store.array;

  const recursiveMerge = function*(array, left, right) {
    if (left < right) {
      let mid = Math.floor((left + right) / 2);
      yield* recursiveMerge(array, left, mid);
      yield* recursiveMerge(array, mid + 1, right);
      yield* merge(array, left, mid, right);
    }
  };

  const merge = function*(array, start, mid, end) {
    const temp = [];
    let runner1 = start,
      runner2 = mid + 1;

    for (let i = runner1; i <= end; i++) {
      yield store.mergeSortCompare(
        Math.min(runner1, mid),
        Math.min(runner2, end)
      );
      if (runner1 > mid) {
        temp.push(array[runner2++].height);
      } else if (runner2 > end) {
        temp.push(array[runner1++].height);
      } else if (array[runner1].height <= array[runner2].height) {
        temp.push(array[runner1++].height);
      } else {
        temp.push(array[runner2++].height);
      }
    }
    for (let i = 0; i < temp.length; i++) {
      yield store.setHeight(start++, temp[i]);
    }
  };

  return recursiveMerge(array, 0, array.length - 1);
};

export default mergeSort;
