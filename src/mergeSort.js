const doMergeSort = array => {
  const copy = [...array];
  mergeSort(copy, 0, copy.length - 1);
  return copy;
};

const mergeSort = function(array, left, right) {
  if (left < right) {
    let mid = Math.floor((left + right) / 2);
    mergeSort(array, left, mid);
    mergeSort(array, mid + 1, right);
    const steps = merge(array, left, mid, right);
    for (const step of steps) {
      console.log(step);
    }
  }
};

const merge = function*(array, start, mid, end) {
  const temp = [];
  let runner1 = start,
    runner2 = mid + 1;
  for (let i = 0; i <= end - start; i++) {
    if (runner1 > mid) {
      temp.push(array[runner2++]);
    } else if (runner2 > end) {
      temp.push(array[runner1++]);
    } else if (array[runner1] <= array[runner2]) {
      temp.push(array[runner1++]);
    } else {
      temp.push(array[runner2++]);
    }
    yield { type: 'COMPARE', indices: [runner1, runner2] };
  }
  for (let i = 0; i < temp.length; i++) {
    yield { type: 'SET', index: start, height: temp[i] };
    array[start++] = temp[i];
  }
};

let test = Array.from({ length: 5 }, () => Math.floor(Math.random() * 20));
console.log(test);
let sorted = doMergeSort(test);
console.log(sorted);
