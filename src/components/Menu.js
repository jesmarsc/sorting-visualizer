import React from 'react';
import { useLocalStore, observer } from 'mobx-react';
import Select from 'react-select';
import Slider from 'rc-slider/lib/Slider';
import 'rc-slider/assets/index.css';

import {
  selectionSort,
  mergeSort,
  quickSort,
  bubbleSort,
  heapSort,
} from '../algorithms';
import classes from './Menu.module.css';

const options = [
  { value: mergeSort, label: 'Merge Sort' },
  { value: quickSort, label: 'Quick Sort' },
  { value: heapSort, label: 'Heap Sort' },
  { value: bubbleSort, label: 'Bubble Sort' },
  { value: selectionSort, label: 'Selection Sort' },
];

const Menu = observer(({ animationStore }) => {
  const {
    isPaused,
    generator,
    delay,
    pauseAnimation,
    startAnimation,
    resetAnimation,
    stepAnimation,
  } = animationStore;

  const menu = useLocalStore(() => ({
    selectedOption: options[0],
    sliderValue: 100,
    selectOnChange: selectedOption => {
      menu.selectedOption = selectedOption;
    },
    sliderOnChange: value => {
      menu.sliderValue = value;
    },
    sliderAfterChange: () => {
      resetAnimation(menu.sliderValue);
    },
  }));

  const {
    selectedOption,
    sliderValue,
    selectOnChange,
    sliderOnChange,
    sliderAfterChange,
  } = menu;

  return (
    <div className={classes.menu}>
      <Select
        value={selectedOption}
        onChange={selectOnChange}
        options={options}
        isSearchable={false}
        placeholder="Select Algorithm..."
      />
      <div className={classes.sliders}>
        <Slider
          min={5}
          max={300}
          step={5}
          value={sliderValue}
          onChange={sliderOnChange}
          onAfterChange={sliderAfterChange}
          disabled={!isPaused}
        />
        <p style={{ color: 'white', marginBottom: '8px' }}>
          Size: {sliderValue}
        </p>
        <Slider
          min={0}
          max={1000}
          step={100}
          value={delay}
          onChange={value => (animationStore.delay = value)}
          disabled={!isPaused}
        />
        <p style={{ color: 'white' }}>Delay: {delay}ms</p>
      </div>
      <div className={classes.buttonList}>
        {isPaused ? (
          <button
            className={classes.button}
            onClick={() => startAnimation(selectedOption.value)}
            style={{ backgroundColor: 'greenyellow' }}
          >
            Sort
          </button>
        ) : (
          <button
            className={classes.button}
            onClick={pauseAnimation}
            style={{ backgroundColor: 'red' }}
          >
            Pause
          </button>
        )}
        {generator && (
          <button className={classes.button} onClick={stepAnimation}>
            Step
          </button>
        )}
        <button
          className={classes.button}
          onClick={() => resetAnimation(menu.sliderValue)}
        >
          Reset
        </button>
      </div>
    </div>
  );
});

export default Menu;
