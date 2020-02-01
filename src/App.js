import React, { Fragment, useCallback } from 'react';
import Bar from './Bar';
import classes from './App.module.css';
import { observable, decorate } from 'mobx';
import { observer, useLocalStore } from 'mobx-react';

/*
let context = null;
let oscillator = null;
let gain = null;
let frequencyBase = 0;
let frequencyMultiplier = 1.3;

const storeProxy = new Proxy(new Store(), {
  Height: function(target, property) {
    if (property === 'length') {
      return target.array.length;
    }
    return target.array[property];
  },
});

const array = observable.array(
  Array.from({ length: 500 }, () => ({
    height: Math.floor(Math.random() * 100),
    color: 'green',
  }))
);

const colorChanger = observable.object({
  set: [],
  compare: [],
});

observe(colorChanger, change => {
  if (change.name === 'set') {
    change.oldValue.color = 'green';
    change.newValue.color = 'red';
  }
  if (change.name === 'set') {
    change.oldValue.color = 'green';
    change.newValue.color = 'red';
  }
});
*/

class Store {
  array = [];
  currentSelection = [{}, {}];

  constructor(length) {
    this.array = Array.from({ length }, () => ({
      height: Math.floor(Math.random() * 100),
      color: 'green',
    }));
  }

  getHeight = index => {
    return this.array[index].height;
  };

  setHeight = (index, value) => {
    let { array } = this;
    array[index].height = value;
    array[index].color = 'green';
  };

  mergeSortCompare = (indexOne, indexTwo) => {
    let { array } = this;
    array[indexOne].color = 'pink';
    array[indexTwo].color = 'red';
  };

  selectionSortSwap = (i, j) => {
    const { array } = this;
    [array[i].height, array[j].height] = [array[j].height, array[i].height];
    this.compare(i, j, 'cyan');
  };

  compare = (indexOne, indexTwo) => {
    const [prevOne, prevTwo] = this.currentSelection;
    prevOne.color = 'green';
    prevTwo.color = 'green';
    this.array[indexOne].color = 'red';
    this.array[indexTwo].color = 'red';
    this.currentSelection = [this.array[indexOne], this.array[indexTwo]];
  };
}

decorate(Store, { array: observable });

const selectionSort = function*(store) {
  const array = store.array;
  for (let i = 0; i < array.length; i++) {
    let min = i;
    for (let j = i + 1; j < array.length; j++) {
      yield store.compare(min, j);
      if (array[j].height < array[min].height) {
        min = j;
      }
    }
    yield store.selectionSortSwap(i, min);
  }
};

const mergeSort = store => {
  const array = store.array;

  const recursiveMerge = function*(array, left, right) {
    if (left < right) {
      let mid = Math.floor((left + right) / 2);
      yield* recursiveMerge(array, left, mid);
      yield* recursiveMerge(array, mid + 1, right);
      yield* merge(array, left, mid, right);
    }
  };

  const merge = function*(array, start, mid, end) {
    const temp = [];
    let runner1 = start,
      runner2 = mid + 1;

    for (let i = runner1; i <= end; i++) {
      yield store.mergeSortCompare(
        Math.min(runner1, mid),
        Math.min(runner2, end)
      );
      if (runner1 > mid) {
        temp.push(array[runner2++].height);
      } else if (runner2 > end) {
        temp.push(array[runner1++].height);
      } else if (array[runner1].height <= array[runner2].height) {
        temp.push(array[runner1++].height);
      } else {
        temp.push(array[runner2++].height);
      }
    }
    for (let i = 0; i < temp.length; i++) {
      yield store.setHeight(start++, temp[i]);
    }
  };

  return recursiveMerge(array, 0, array.length - 1);
};

const App = observer(() => {
  const store = useLocalStore(() => new Store(300));

  const doSorting = useCallback(
    sortGenerator => {
      const steps = sortGenerator(store);

      const animation = setInterval(() => {
        const action = steps.next();
        if (action.done) {
          clearInterval(animation);
        }
      }, 0);
    },
    [store]
  );

  return (
    <Fragment>
      <ul className={classes.menu}>
        <li>
          <button onClick={() => doSorting(selectionSort)}>
            Selection Sort
          </button>
        </li>
        <li>
          <button onClick={() => doSorting(mergeSort)}>Merge Sort</button>
        </li>
      </ul>
      <div className={classes.barsContainer}>
        {store.array.map((barData, index) => {
          return <Bar key={index} id={index} barData={barData} />;
        })}
      </div>
    </Fragment>
  );
});

export default App;
