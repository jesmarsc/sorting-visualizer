import { SortAction } from "../types";
import { swap } from "../utils";

export const heapSort = (arr: number[]) => {
  const heapify = function* (
    array: number[],
    index: number,
    end: number
  ): Generator<SortAction> {
    let left_child = index * 2 + 1;
    let right_child = index * 2 + 2;
    let max = index;

    if (left_child < end && array[left_child] > array[max]) {
      max = left_child;
    }

    if (right_child < end && array[right_child] > array[max]) {
      max = right_child;
    }

    if (max !== index) {
      swap(arr, index, max);
      yield { type: "swap", indeces: [index, max] };
      yield* heapify(array, max, end);
    }
  };

  const buildMaxHeap = function* (array: number[]): Generator<SortAction> {
    const middle = Math.floor(array.length / 2) - 1;

    for (let i = middle; i >= 0; i--) {
      yield* heapify(array, i, array.length);
    }
  };

  const sorter = function* (array: number[]): Generator<SortAction> {
    yield* buildMaxHeap(array);
    for (let i = array.length - 1; i >= 0; i--) {
      swap(arr, 0, i);
      yield { type: "swap", indeces: [0, i] };
      yield* heapify(array, 0, i);
    }
  };

  return sorter(arr);
};
