import React, { useEffect, useReducer, useState } from 'react';
import Rectangle from './Rectangle';

let context = null;
let oscillator = null;
let gain = null;
let frequencyBase = 0;
let frequencyMultiplier = 1.3;

let currentComparison = [{}, {}];
let animationSpeed = 0;

const sortingReducer = (state, action) => {
  switch (action.type) {
    case 'RESET': {
      const { length, max } = action;
      return Array.from({ length }, () => Math.floor(Math.random() * max));
    }
    case 'COMPARE': {
      const [j, min] = action.indices;
      const [currentJ, currentMin] = currentComparison;
      currentJ.backgroundColor = 'green';
      currentMin.backgroundColor = 'green';

      currentComparison = [
        document.getElementById(j).style,
        document.getElementById(min).style,
      ];

      /*
      oscillator.frequency.value = Math.pow(
        parseFloat(currentComparison[0].height) + frequencyBase,
        frequencyMultiplier
      );
      */

      currentComparison[0].backgroundColor = 'red';
      currentComparison[1].backgroundColor = 'red';
      return state;
    }
    case 'SWAP': {
      const [i, min] = action.indices;
      const style1 = document.getElementById(i).style;
      const style2 = document.getElementById(min).style;
      [style1.height, style2.height] = [style2.height, style1.height];
      return state;
    }
    case 'SET': {
      const { index, height } = action;
      const style = document.getElementById(index).style;
      style.height = `${height}%`;
      /*
      oscillator.frequency.value = Math.pow(
        height + frequencyBase,
        frequencyMultiplier
      );
      */
      return state;
    }
    default: {
      throw new Error('Invalid action.type!');
    }
  }
};

function App() {
  const [array, dispatchArray] = useReducer(sortingReducer, []);

  useEffect(() => {
    dispatchArray({ type: 'RESET', length: 400, max: 100 });
    /*
    context = new AudioContext();
    oscillator = context.createOscillator();
    gain = context.createGain();
    gain.gain.value = 0;
    oscillator.type = 'triangle';
    oscillator.frequency.value = 0;
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();

    return () => {
      oscillator.stop();
    };
    */
  }, []);

  const mergeSort = array => {
    const recursiveMerge = function*(array, left, right) {
      if (left < right) {
        let mid = Math.floor((left + right) / 2);
        yield* recursiveMerge(array, left, mid);
        yield* recursiveMerge(array, mid + 1, right);
        yield* merge(array, left, mid, right);
      }
    };

    return recursiveMerge(array, 0, array.length - 1);
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
    }
    for (let i = 0; i < temp.length; i++) {
      yield { type: 'SET', index: start, height: temp[i] };
      array[start++] = temp[i];
    }
  };

  const selectionSort = function*(array) {
    for (let i = 0; i < array.length; i++) {
      let min = i;
      for (let j = i + 1; j < array.length; j++) {
        yield { type: 'COMPARE', indices: [j, min] };
        if (array[j] < array[min]) {
          min = j;
        }
      }
      [array[i], array[min]] = [array[min], array[i]];
      yield { type: 'SWAP', indices: [i, min] };
    }
  };

  const doSorting = sortingGenerator => {
    const copy = [...array];
    const steps = sortingGenerator(copy);

    setInterval(() => {
      const action = steps.next();
      if (action.done) {
        clearInterval();
      } else dispatchArray(action.value);
    }, animationSpeed);

    /*
    let j = 1;
    for (const action of steps) {
      // These timeouts do not execute until selectionSort completes.
      // When they do start, the first couple of timeouts are executed immediately.
      // I understand that those timeouts had completed while selectionSort was running,
      // but would it be possible to have them execute while selectionSort is running
      // so that the animation begins at the start and not ubruptly in the middle?
      setTimeout(() => dispatchArray(action), j++ * animationSpeed);
    }
    */
  };

  const rectangles = array.map((height, index) => (
    <Rectangle id={index} key={index} height={height} />
  ));

  return (
    <div>
      <button
        style={{ position: 'absolute', top: '0px', left: '0px' }}
        onClick={() => doSorting(selectionSort)}
      >
        Selection Sort
      </button>
      <button
        style={{ position: 'absolute', top: '40px', left: '0px' }}
        onClick={() => doSorting(mergeSort)}
      >
        Merge Sort
      </button>
      <div
        style={{
          display: 'flex',
          width: '100vw',
          height: '100vh',
          backgroundColor: 'black',
          alignItems: 'flex-end',
        }}
      >
        {rectangles}
      </div>
    </div>
  );
}

export default App;
