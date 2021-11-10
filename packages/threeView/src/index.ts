/*
 * @Author: linkenzone
 * @Date: 2021-07-07 10:38:51
 * @Descripttion: Do not edit
 */
import BaseDemo from './demo/Base';
import FiberBaseDemo from './demo/Fiber_Base';
import MaterialsTexture2darrayDemo from './demo/materialsTexture2darray';
// import { getDicomSeriesImageData } from './io/DicomLoader';
import VolumeDemo from './demo/volume';
import axios from 'axios';
import axiosRetry from 'axios-retry';

import View2D from './Viewport/View2D';
import LeftToolsBar from './Viewport/ui/LeftToolsBar';
import ImageLoader from './util/ImageLoader';


console.log('配置 axios 全局重新连接次数...');

axiosRetry(axios, {
  retries: 3, // number of retries
  retryDelay: (retryCount) => {
    console.log(`retry attempt: ${retryCount}`);
    return retryCount * 2000; // time interval between retries
  },
});

export {
  BaseDemo,
  FiberBaseDemo,
  MaterialsTexture2darrayDemo,
  // getDicomSeriesImageData,
  VolumeDemo,
  View2D,
  LeftToolsBar,
  ImageLoader,
};

export default {
  BaseDemo,
  FiberBaseDemo,
  MaterialsTexture2darrayDemo,
  // getDicomSeriesImageData,
  VolumeDemo,
  View2D,
  LeftToolsBar,
  ImageLoader,
};
