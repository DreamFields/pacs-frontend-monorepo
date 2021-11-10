/*
 * @Author: linkenzone
 * @Date: 2021-07-17 22:39:04
 * @Descripttion: Do not edit
 */
import React, { useState } from 'react';
import { SketchPicker } from 'react-color';

type ColorPickerProps = {
  color: string;
  handleChange: (color: any) => any;
};

const ColorPicker: React.FC<ColorPickerProps> = (props) => {
  const { color, handleChange } = props;

  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const styles = {
    color: {
      width: '72px',
      // height: '14px',
      borderRadius: '2px',
      background: color,
      padding: '2px',
      fontSize: '12px',
    },
    swatch: {
      padding: '4px',
      background: '#fff',
      borderRadius: '1px',
      boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
      display: 'inline-block',
      cursor: 'pointer',
    },
  };

  const handleClick = () => {
    setDisplayColorPicker(true);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  return (
    <div>
      <div style={styles.swatch} onClick={handleClick}>
        <div style={styles.color}>{color}</div>
      </div>

      {displayColorPicker ? (
        <div style={{ position: 'absolute', zIndex: 2 }}>
          <div
            style={{ position: 'fixed', top: '0px', right: '0px', bottom: '0px', left: '0px' }}
            onClick={handleClose}
          />
          <SketchPicker color={color} onChange={handleChange} />
        </div>
      ) : null}
    </div>
  );
};

export default ColorPicker;
