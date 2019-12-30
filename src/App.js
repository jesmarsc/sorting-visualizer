import React, { useEffect, useReducer } from 'react';
import Rectangle from './Rectangle';

let currentComparison = [{}, {}];
let animationSpeed = 1;

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
    default: {
      throw new Error('Invalid action.type!');
    }
  }
};

function App() {
  const [array, dispatchArray] = useReducer(sortingReducer, []);

  useEffect(() => {
    dispatchArray({ type: 'RESET', length: 100, max: 100 });
  }, []);

  const selectionSort = function*(array) {
    const copy = [...array];
    for (let i = 0; i < copy.length; i++) {
      let min = i;
      for (let j = i + 1; j < copy.length; j++) {
        yield { type: 'COMPARE', indices: [j, min] };
        if (copy[j] < copy[min]) {
          min = j;
        }
      }
      [copy[i], copy[min]] = [copy[min], copy[i]];
      yield { type: 'SWAP', indices: [i, min] };
    }
  };

  const sort = () => {
    const sorter = selectionSort(array);
    let j = 1;
    for (const action of sorter) {
      setTimeout(() => dispatchArray(action), j++ * animationSpeed);
    }
  };

  const rectangles = array.map((height, index) => (
    <Rectangle id={index} key={index} height={height} />
  ));

  return (
    <div>
      <button
        style={{ position: 'absolute', top: '0', left: '0' }}
        onClick={sort}
      >
        Sort
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
