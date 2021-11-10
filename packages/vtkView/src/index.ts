/*
 * @Author: linkenzone
 * @Date: 2021-06-30 10:24:57
 * @Descripttion: Do not edit
 */
import { getDicomSeriesImageData } from './io/dicom';

import View2D from './Viewport/View2D';
import View3D from './Viewport/View3D';
import Viewer3D from './Viewer/Viewer3D';
import IsoValueUi from './Viewer/ui/IsoValue';
import FpsMonitorUi from './Viewer/ui/FpsMonitor';
import VolumeControllerUi from './Viewer/ui/VolumeController';

import { VtkViewProvider } from './context/vtkViewProvider';

import VtkBaseDemo from './demo/VtkBaseDemo';
import VtkVolumeDemo from './demo/VtkVolumeDemo';
import VtkFiltersDemo from './demo/VtkFiltersDemo';
import VtkVolumeSliceDemo from './demo/VtkVolumeSliceDemo';
import VTKVolumeExampleDemo from './demo/VTKVolumeExampleDemo';

import SliceUI from './ui/Slice';
import axios from 'axios';
import axiosRetry from 'axios-retry';

import '@kitware/vtk.js/favicon';
// Load the rendering pieces we want to use (for both WebGL and WebGPU)
import '@kitware/vtk.js/Rendering/Profiles/Volume';
// Force DataAccessHelper to have access to various data source
import '@kitware/vtk.js/IO/Core/DataAccessHelper/HtmlDataAccessHelper';
import '@kitware/vtk.js/IO/Core/DataAccessHelper/JSZipDataAccessHelper';

console.log('配置 axios 全局重新连接次数...');
axiosRetry(axios, {
  retries: 3, // number of retries
  retryDelay: (retryCount) => {
    console.log(`retry attempt: ${retryCount}`);
    return retryCount * 2000; // time interval between retries
  },
});

const vtkViewer = {
  getDicomSeriesImageData,
  View2D,
  View3D,
  Viewer3D,
  IsoValueUi,
  FpsMonitorUi,
  VolumeControllerUi,
  SliceUI,
  VtkBaseDemo,
  VtkVolumeDemo,
  VtkFiltersDemo,
  VtkVolumeSliceDemo,
  VTKVolumeExampleDemo,
};

export {
  getDicomSeriesImageData,
  View2D,
  View3D,
  Viewer3D,
  IsoValueUi,
  FpsMonitorUi,
  VolumeControllerUi,
  VtkViewProvider,
  SliceUI,
  VtkBaseDemo,
  VtkVolumeDemo,
  VtkFiltersDemo,
  VtkVolumeSliceDemo,
  VTKVolumeExampleDemo,
};

export default vtkViewer;
