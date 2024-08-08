import { SortAction } from "../types";
import { swap } from "../utils";

export const quickSort = (arr: number[]) => {
  const recursivePivot = function* (
    left: number,
    right: number
  ): Generator<SortAction> {
    if (left < right) {
      const pivotIndex = yield* pivot(left, right);
      yield* recursivePivot(left, pivotIndex - 1);
      yield* recursivePivot(pivotIndex + 1, right);
    }
  };

  const pivot = function* (left: number, right: number): Generator<SortAction> {
    const pivot = arr[left];

    let side = "right";

    while (left < right) {
      yield {
        type: "compare",
        indeces: [left, right],
      };

      if (side === "right") {
        if (arr[right] < pivot) {
          swap(arr, left, right);

          yield {
            type: "swap",
            indeces: [left, right],
          };

          left++;
          side = "left";
        } else {
          right--;
        }
      } else {
        if (arr[left] > pivot) {
          swap(arr, left, right);

          yield {
            type: "swap",
            indeces: [left, right],
          };

          right--;
          side = "right";
        } else {
          left++;
        }
      }
    }
    yield { type: "set", index: right, value: pivot };

    return right;
  };

  return recursivePivot(0, arr.length - 1);
};
