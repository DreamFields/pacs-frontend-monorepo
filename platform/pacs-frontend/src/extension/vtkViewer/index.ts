/*
 * @Author: linkenzone
 * @Date: 2021-06-30 10:24:57
 * @Descripttion: Do not edit
 */
import { getDicomSeriesImageData } from './io/dicom';

import View2D from './Viewport/View2D';
import View3D from './Viewport/View3D';
import { VtkViewProvider } from './context/vtkViewProvider';

import SliceUI from './ui/Slice';

const vtkViewer = {
  getDicomSeriesImageData,
  View2D,
  View3D,
  VtkViewProvider,
  SliceUI,
};

export { getDicomSeriesImageData, View2D, View3D, VtkViewProvider, SliceUI };

export default vtkViewer;
