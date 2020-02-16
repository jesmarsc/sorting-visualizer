const selectionSort = function*(store) {
  const array = store.array;
  for (let i = 0; i < array.length; i++) {
    let min = i;
    for (let j = i + 1; j < array.length; j++) {
      yield store.compare(min, j, 'red');
      if (array[j].height < array[min].height) {
        min = j;
      }
    }
    yield store.swap(i, min);
  }
};

export default selectionSort;
