/*
 * @Author: linkenzone
 * @Date: 2021-07-07 10:49:33
 * @Descripttion: Do not edit
 */

import React, { useState } from 'react';
import { render } from 'react-dom';

import BaseDemo from './BaseDemo';
import MaterialsTexture2darrayDemo from '../src/demo/materialsTexture2darray';
import VolumeDemo from '../src/demo/volume';
import ImageIo from './imageIo';
import DataStore from './dataStore';
import KonvaDemo from '../src/demo/KonvaDemo';
import View3dDemo from './view3D';
import DicomParser from './dicomParser';
// import OrthancParser from './orthancParser';

import ThreeJs2dView from './ThreeJs2dView';
import Threejs2dViewStable from './ThreeJS2dViewStable';

import 'antd/dist/antd.css';

const demoList = {
  BaseDemo: <BaseDemo />,
  MaterialsTexture2darrayDemo: <MaterialsTexture2darrayDemo />,
  ImageIo: <ImageIo />,
  DataStore: <DataStore />,
  KonvaDemo: <KonvaDemo uuid="b5981569-302c412a-6ced2c80-fd877f65-933991a4" />,
  View3dDemo: <View3dDemo />,
  VolumeDemo: <VolumeDemo />,
  DicomParser: <DicomParser />,
  // OrthancParser: <OrthancParser />,
  ThreeJs2dView: <ThreeJs2dView />,
  ThreeJs2dViewStable: <Threejs2dViewStable />,
};

const App: React.FC<unknown> = () => {
  const [curDemo, setCurDemo] = useState('BaseDemo');

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
          <option value="BaseDemo">Demo/Base</option>
          <option value="MaterialsTexture2darrayDemo">MaterialsTexture2darrayDemo</option>
          <option value="ImageIo">ImageIo</option>
          <option value="DataStore">DataStore</option>
          <option value="KonvaDemo">KonvaDemo</option>
          <option value="ThreeJs2dView">ThreeJs2dView</option>
          <option value="ThreeJs2dViewStable">ThreeJs2dView/Stable</option>
          {/* <option value="View3dDemo">View3dDemo</option> */}
          <option value="VolumeDemo">VolumeDemo</option>
          <option value="DicomParser">DicomParser</option>
          {/* <option value="OrthancParser">OrthancParser</option> */}
        </select>
      </div>

      <div style={{ padding: '12px', minHeight: '800px' }}>{demoList[curDemo]}</div>
    </>
  );
};

render(<App />, document.getElementById('root'));
