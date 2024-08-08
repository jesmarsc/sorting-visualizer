type Indeces = [number, number];

export type SortAction =
  | { type: "compare"; indeces: Indeces }
  | { type: "set"; index: number; value: number }
  | { type: "swap"; indeces: Indeces };

export type Bar = {
  height: number;
  status: "default" | "sorted" | "compared" | "swapped";
};

export type SortAlgorithm =
  | "bubbleSort"
  | "heapSort"
  | "mergeSort"
  | "quickSort"
  | "selectionSort";

export type Status = "sorting" | "pending" | "paused" | "completed";
