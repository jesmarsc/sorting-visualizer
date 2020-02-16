import React, { Fragment } from 'react';
import { observable, decorate, action } from 'mobx';
import { observer, useLocalStore } from 'mobx-react';

import { Bar, Menu } from './components';
import classes from './App.module.css';

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

class ArrayStore {
  array = [];
  currentSelection = [{}, {}];

  constructor(length) {
    this.reset(length);
  }

  reset = length => {
    this.array = Array.from({ length }, () => ({
      height: Math.floor(Math.random() * 100),
      color: 'green',
    }));
  };

  resetColor = () => {
    this.array.forEach(bar => {
      bar.color = 'green';
    });
    this.currentSelection = [{}, {}];
  };

  getHeight = index => {
    return this.array[index].height;
  };

  setHeight = (index, value) => {
    this.array[index].height = value;
    this.array[index].color = 'green';
  };

  compare = (indexOne, indexTwo, color) => {
    const [prevOne, prevTwo] = this.currentSelection;
    prevOne.color = 'green';
    prevTwo.color = 'green';
    this.array[indexOne].color = color;
    this.array[indexTwo].color = color;
    this.currentSelection = [this.array[indexOne], this.array[indexTwo]];
  };

  swap = (i, j) => {
    const temp = this.array[i].height;
    this.array[i].height = this.array[j].height;
    this.array[j].height = temp;
    this.compare(i, j, 'red');
  };

  mergeSortCompare = (indexOne, indexTwo) => {
    this.array[indexOne].color = 'pink';
    this.array[indexTwo].color = 'red';
  };
}

decorate(ArrayStore, { array: observable });

class AnimationStore {
  generatorFunction = null;
  generator = null;
  isPaused = true;
  delay = 0;

  constructor(ArrayStore) {
    this.arrayStore = ArrayStore;
  }

  startAnimation = generatorFunction => {
    this.isPaused = false;
    if (this.generatorFunction !== generatorFunction) {
      this.generatorFunction = generatorFunction;
      this.generator = generatorFunction(this.arrayStore);
      this.arrayStore.resetColor();
    }
    this.animation = setInterval(() => {
      const action = this.generator.next();
      if (action.done) {
        this.arrayStore.resetColor();
        this.pauseAnimation();
      }
    }, this.delay);
  };

  pauseAnimation = () => {
    clearInterval(this.animation);
    this.isPaused = true;
  };

  stepAnimation = () => {
    this.generator.next();
  };

  resetAnimation = length => {
    this.pauseAnimation();
    this.generatorFunction = null;
    this.generator = null;
    this.arrayStore.reset(length);
  };
}

decorate(AnimationStore, {
  generatorFunction: observable,
  generator: observable,
  isPaused: observable,
  delay: observable,
  startAnimation: action,
  pauseAnimation: action,
});

const App = observer(() => {
  const arrayStore = useLocalStore(() => new ArrayStore(150));
  const animationStore = useLocalStore(() => new AnimationStore(arrayStore));

  return (
    <Fragment>
      <Menu animationStore={animationStore} arrayStore={arrayStore} />

      <div className={classes.barsContainer}>
        {arrayStore.array.map((barData, index) => {
          return <Bar key={index} id={index} barData={barData} />;
        })}
      </div>
    </Fragment>
  );
});

export default App;
