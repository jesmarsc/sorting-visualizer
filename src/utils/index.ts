import { Bar } from "../types";

export function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    // Generate a random index between 0 and i (inclusive).
    const randomIndex = Math.floor(Math.random() * (i + 1));

    // Swap the elements at indices i and randomIndex.
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }

  return array;
}

export const normalize = (value: number, min: number, max: number) => {
  return ((value - min) * 100) / (max - min);
};

export const generateRandomArray = (amount: number): Bar[] => {
  return shuffleArray(
    Array.from({ length: amount }, (_, i) => ({
      status: "default",
      height: normalize(amount - i, -1, amount),
    }))
  );
};

export function swap(arr: any[], i: number, j: number) {
  [arr[i], arr[j]] = [arr[j], arr[i]];
}

export function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}
