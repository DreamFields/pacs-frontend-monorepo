/*
 * @Author: linkenzone
 * @Date: 2021-07-02 10:21:15
 * @Descripttion: Do not edit
 */
import '@kitware/vtk.js/favicon';
import { Slider } from 'antd';
import React, { useState, useEffect, useRef, useContext } from 'react';

type SliceProps = {};

const SliceUI: React.FC<SliceProps> = (props) => {
  const [slices, setSlices] = useState([0, 0, 0]); // x y z

  return (
    <div>
      x
      <Slider
        min={1}
        max={200}
        onChange={(value) => {
          slices[0] = value;
          setSlices([...slices]);
        }}
        value={typeof slices[0] === 'number' ? slices[0] : 0}
      />
      y
      <Slider
        min={1}
        max={200}
        onChange={(value) => {
          slices[1] = value;
          setSlices([...slices]);
        }}
        value={typeof slices[1] === 'number' ? slices[1] : 0}
      />
      z
      <Slider
        min={1}
        max={200}
        onChange={(value) => {
          slices[2] = value;
          setSlices([...slices]);
        }}
        value={typeof slices[2] === 'number' ? slices[2] : 0}
      />
    </div>
  );
};

export default SliceUI;
