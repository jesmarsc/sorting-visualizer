import React from 'react';
import { observer } from 'mobx-react';
import classes from './Bar.module.css';

const Bar = observer(({ id, barData: { height, color } }) => {
  return (
    <div
      id={id}
      className={classes.bar}
      style={{ height: `${height}%`, backgroundColor: color }}
    />
  );
});

export default Bar;
