const bubbleSort = function*(store) {
  const array = store.array;

  let swapOccured = false;
  for (let i = array.length - 1; i > 0; i--) {
    for (let j = 0; j < i; j++) {
      yield store.compare(j, j + 1, 'pink');
      if (array[j].height > array[j + 1].height) {
        yield store.swap(j, j + 1);
        swapOccured = true;
      }
    }
    if (!swapOccured) break;
  }
};

export default bubbleSort;
