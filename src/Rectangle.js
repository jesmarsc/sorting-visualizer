import React, { memo } from 'react';

const Rectangle = memo(({ id, height }) => {
  const style = {
    border: '1px solid black',
    height: `${height}%`,
    backgroundColor: 'green',
    flexGrow: '1',
  };

  return <div id={id} style={style}></div>;
});

export default Rectangle;
