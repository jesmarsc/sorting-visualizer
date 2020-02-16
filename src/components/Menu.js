import React from 'react';
import { useLocalStore, observer } from 'mobx-react';
import Select from 'react-select';
import Slider from 'rc-slider/lib/Slider';
import 'rc-slider/assets/index.css';

import { selectionSort, mergeSort, quickSort, bubbleSort } from '../algorithms';
import classes from './Menu.module.css';

const options = [
  { value: selectionSort, label: 'Selection Sort' },
  { value: mergeSort, label: 'Merge Sort' },
  { value: quickSort, label: 'Quick Sort' },
  { value: bubbleSort, label: 'Bubble Sort' },
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
    sliderValue: 150,
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
        placeholder="Select Algorithm..."
      />
      <Slider
        min={5}
        max={300}
        step={5}
        value={sliderValue}
        onChange={sliderOnChange}
        onAfterChange={sliderAfterChange}
        style={{ marginTop: '8px' }}
        disabled={!isPaused}
      />
      <p style={{ color: 'white' }}>Size: {sliderValue}</p>
      <Slider
        min={0}
        max={1000}
        step={100}
        value={delay}
        onChange={value => (animationStore.delay = value)}
        style={{ marginTop: '8px' }}
        disabled={!isPaused}
      />
      <p style={{ color: 'white' }}>Delay: {delay}ms</p>
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
