import { SortAction } from "../types";
import { swap } from "../utils";

export const selectionSort = function* (arr: number[]): Generator<SortAction> {
  for (let i = 0; i < arr.length; i++) {
    let min = i;

    for (let j = i + 1; j < arr.length; j++) {
      yield { type: "compare", indeces: [min, j] };

      if (arr[j] < arr[min]) {
        min = j;
      }
    }

    swap(arr, i, min);
    yield { type: "swap", indeces: [i, min] };
  }
};
