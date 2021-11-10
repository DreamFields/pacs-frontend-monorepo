/*
 * @Author: linkenzone
 * @Date: 2021-07-06 11:07:00
 * @Descripttion: Do not edit
 */
import React, { useState } from 'react';
import { render } from 'react-dom';

import { View2D, View3D, VtkViewProvider, SliceUI } from '../src/index';

import Viewer3dDemo from './Viewer3D';

import 'antd/dist/antd.css';

const ProxyDemo = () => (
  <>
    <div style={{ display: 'flex' }}>
      <div style={{ width: '320px' }}>
        <SliceUI />
      </div>

      <div
        style={{
          width: '100%',
          height: '90vh',
          display: 'grid',
          gridColumnGap: '2px',
          gridRowGap: '2px',
          gridTemplateRows: '1fr 1fr',
          gridTemplateColumns: '1fr 1fr',
        }}
      >
        <VtkViewProvider uuid="bfd34afd-f97a9f7c-c0551428-93a0c48a-0285c8ce">
          <View2D viewType="x" />
          <View3D />
          <View2D viewType="y" />
          <View2D viewType="z" />
        </VtkViewProvider>
      </div>
    </div>
  </>
);

const demoList = {
  ProxyDemo: <ProxyDemo />,
  Viewer3dDemo: <Viewer3dDemo />,
};

const App: React.FC<unknown> = () => {
  const [curDemo, setCurDemo] = useState('Viewer3dDemo');

  return (
    <>
      <div style={{ padding: '8px', borderBottom: 'black solid 1px' }}>
        选择一个例子:
        <select
          style={{ width: '240px' }}
          onChange={(e) => {
            console.log('e', e.target.value);
            setCurDemo(e.target.value);
          }}
        >
          <option value="Viewer3dDemo">Demo/Viewer3dDemo</option>
          <option value="ProxyDemo">Demo/ProxyDemo</option>
        </select>
      </div>

      <div style={{ padding: '12px', maxHeight: '800px' }}>{demoList[curDemo]}</div>
    </>
  );
};

render(<App />, document.getElementById('root'));
