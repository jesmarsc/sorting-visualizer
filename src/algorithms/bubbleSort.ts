import { SortAction } from "../types";
import { swap } from "../utils";

export const bubbleSort = function* (arr: number[]): Generator<SortAction> {
  let swapOccured = false;

  for (let i = arr.length - 1; i > 0; i--) {
    for (let j = 0; j < i; j++) {
      yield { type: "compare", indeces: [j, j + 1] };

      if (arr[j] > arr[j + 1]) {
        swap(arr, j, j + 1);
        yield { type: "swap", indeces: [j, j + 1] };

        swapOccured = true;
      }
    }

    if (!swapOccured) break;
  }
};
