import { SortAction } from "../types";

export const mergeSort = (arr: number[]) => {
  function* recursiveMerge(left: number, right: number): Generator<SortAction> {
    if (left < right) {
      let mid = Math.floor((left + right) / 2);

      yield* recursiveMerge(left, mid);
      yield* recursiveMerge(mid + 1, right);
      yield* merge(left, mid, right);
    }
  }

  const merge = function* (
    start: number,
    mid: number,
    end: number
  ): Generator<SortAction> {
    let result: number[] = [];

    let leftIndex = start;
    let rightIndex = mid + 1;

    for (let i = leftIndex; i <= end; i++) {
      if (leftIndex > mid) {
        result.push(arr[rightIndex++]);
      } else if (rightIndex > end) {
        result.push(arr[leftIndex++]);
      } else if (arr[leftIndex] <= arr[rightIndex]) {
        yield { type: "compare", indeces: [leftIndex, rightIndex] };
        result.push(arr[leftIndex++]);
      } else {
        yield { type: "compare", indeces: [leftIndex, rightIndex] };
        result.push(arr[rightIndex++]);
      }
    }

    for (let i = 0; i < result.length; i++) {
      arr[start + i] = result[i];
      yield { type: "set", index: start + i, value: result[i] };
    }
  };

  return recursiveMerge(0, arr.length - 1);
};
