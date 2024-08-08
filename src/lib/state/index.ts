import { proxy } from "valtio";

import { clamp, generateRandomArray } from "@/utils";
import { Bar, SortAction, SortAlgorithm, Status } from "@/types";

import {
  bubbleSort,
  heapSort,
  mergeSort,
  quickSort,
  selectionSort,
} from "@/algorithms";

type Config = {
  interval: number;
  itemAmount: number;
  status: Status;
  algorithm: SortAlgorithm;
};

export abstract class State {
  generator = heapSort;
  generatorInstance: Generator<SortAction>;
  bars: Bar[];
  config: Config;
  previousBars: Bar[] = [];

  constructor() {
    this.config = proxy({
      interval: 0,
      itemAmount: 300,
      status: "pending",
      algorithm: "mergeSort",
    });

    this.bars = generateRandomArray(this.config.itemAmount);
    this.setAlgorithm(this.config.algorithm);
    this.generatorInstance = this.generator(this.bars.map((bar) => bar.height));
  }

  setAlgorithm(algorithm: SortAlgorithm) {
    let sortFunction = {
      bubbleSort,
      heapSort,
      mergeSort,
      quickSort,
      selectionSort,
    }[algorithm];

    this.config.algorithm = algorithm;
    this.setGenerator(sortFunction);
  }

  setGenerator(generator: typeof bubbleSort) {
    this.generator = generator;
    this.generatorInstance = generator(this.bars.map((bar) => bar.height));
  }

  setItemAmount(itemAmount: number) {
    this.config.itemAmount = clamp(itemAmount, 0, 1000);
    this.reset();
  }

  setInterval(interval: number) {
    this.config.interval = interval;
  }

  pause() {
    this.config.status = "paused";
  }

  reset() {
    this.bars = generateRandomArray(this.config.itemAmount);
    this.setGenerator(this.generator);
    this.config.status = "pending";
  }

  step() {
    this.config.status = "paused";
    this._step();
  }

  animate() {
    const config = this.config;

    config.status = "sorting";

    let lastFrameTime = performance.now();

    const requestAnimate = (currentFrameTime: number) => {
      const elapsedTime = currentFrameTime - lastFrameTime;

      if (elapsedTime >= config.interval) {
        if (config.status !== "sorting") return;

        this._step();

        lastFrameTime = currentFrameTime;
      }

      // Request the next animation frame
      window.requestAnimationFrame(requestAnimate);
    };

    window.requestAnimationFrame(requestAnimate);
  }

  _step() {
    const { generatorInstance, bars, config } = this;

    this.previousBars.forEach((bar) => (bar.status = "default"));

    const action = generatorInstance.next();

    if (action.done) {
      this.setGenerator(this.generator);
      config.status = "completed";
      return;
    }

    let currentBars: Bar[] = [];

    switch (action.value.type) {
      case "swap":
        const [i, j] = action.value.indeces;

        const temp = bars[i].height;
        bars[i].height = bars[j].height;
        bars[j].height = temp;

        bars[i].status = "swapped";
        bars[j].status = "swapped";

        currentBars = [bars[i], bars[j]];
        break;
      case "set":
        const { index, value } = action.value;
        const setBar = bars[index];

        setBar.height = value;
        setBar.status = "sorted";

        currentBars = [bars[index]];
        break;
      case "compare":
        const [a, b] = action.value.indeces;

        bars[a].status = "compared";
        bars[b].status = "compared";

        currentBars = [bars[a], bars[b]];
        break;
    }

    this.previousBars = currentBars;
  }
}
