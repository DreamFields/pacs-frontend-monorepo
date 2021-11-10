/*
 * @Author: linkenzone
 * @Date: 2021-06-08 21:47:27
 * @Descripttion: Do not edit
 */
import { Select } from 'antd';
import React, { useState } from 'react';

import VolumeDemo from './VolumeDemo';
import SurfaceDemo from './SurfaceDemo';
import SliceDemo from './SliceDemo';
import VtkViewDemo from './vtkViewDemo';
import ImageIo from './imageIo';
import VtkViewer3D from './vtkViewer3D';
import View2d from './View2D';

import {
  BaseDemo,
  FiberBaseDemo,
  MaterialsTexture2darrayDemo,
  VolumeDemo as ThreeJsVolumeDemo,
} from 'rayplus-three-view';

import {
  VtkBaseDemo,
  VtkFiltersDemo,
  VtkVolumeDemo,
  VtkVolumeSliceDemo,
  VTKVolumeExampleDemo,
} from 'rayplus-vtkview';

const { Option } = Select;

const Page: React.FC<{}> = () => {
  const [curCom, setCurCom] = useState('VtkBaseDemo');

  const comList = {
    VolumeDemo: <VolumeDemo />,
    SurfaceDemo: <SurfaceDemo />,
    SliceDemo: <SliceDemo />,

    // 自己的包
    VTK3DExample: <VtkVolumeDemo />,
    VtkBaseDemo: <VtkBaseDemo />,
    VtkFiltersDemo: <VtkFiltersDemo />,
    VtkVolumeSliceDemo: <VtkVolumeSliceDemo />,
    VTKVolumeExampleDemo: <VTKVolumeExampleDemo />,
    ImageIo: <ImageIo />,

    // VtkProxyManager: <VtkProxyManager />,
    vtkViewDemo: <VtkViewDemo />,
    vtkViewer3D: <VtkViewer3D />,

    // threejs
    View2d: <View2d />,
    BaseDemo: (
      <div style={{ height: '800px' }}>
        <BaseDemo />
      </div>
    ),
    MaterialsTexture2darrayDemo: <MaterialsTexture2darrayDemo />,
    ThreeJsVolumeDemo: <ThreeJsVolumeDemo />,
    FiberBaseDemo: <FiberBaseDemo />,
  };

  return (
    <>
      <Select
        defaultValue="VtkBaseDemo"
        style={{ width: 480 }}
        onChange={(e) => {
          setCurCom(e);
        }}
      >
        <Option value="VolumeDemo">ReactVtkJs-VolumeDemo</Option>
        <Option value="SurfaceDemo">ReactVtkJs-SurfaceDemo</Option>
        <Option value="SliceDemo">ReactVtkJs-SliceDemo</Option>
        <Option value="VTK3DExample">vtkView-3DExample</Option>
        <Option value="VTKVolumeExampleDemo">vtkView-VolumeExample</Option>
        <Option value="VtkBaseDemo">vtkView-BaseDemo</Option>
        <Option value="VtkFiltersDemo">vtkView-FiltersDemo</Option>
        <Option value="VtkVolumeSliceDemo">vtkView-VolumeSliceDemo</Option>
        {/* <Option value="VtkProxyManager">VtkProxyManager</Option> */}
        <Option value="vtkViewDemo">vtkView-Demo</Option>
        <Option value="vtkViewer3D">vtkView/vtkViewer3D</Option>

        <Option value="ImageIo">ImageIo</Option>

        <Option value="BaseDemo">threejs/BaseDemo</Option>
        <Option value="FiberBaseDemo">threejs/FiberBaseDemo</Option>
        <Option value="MaterialsTexture2darrayDemo">threejs/MaterialsTexture2darrayDemo</Option>
        <Option value="ThreeJsVolumeDemo">threejs/ThreeJsVolumeDemo</Option>

        <Option value="View2d">threejs/View2d</Option>
      </Select>

      <div style={{ margin: '24px', padding: '12px', border: '1px #dedede solid' }}>
        {comList[curCom]}
      </div>
    </>
  );
};

export default Page;
