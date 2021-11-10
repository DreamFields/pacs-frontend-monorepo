/*
 * @Descripttion: 初始化
 * @Author: linkenzone
 * @Date: 2021-04-02 15:15:27
 */

import dicomParser from 'dicom-parser';
import cornerstone from 'cornerstone-core';

import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import cornerstoneWebImageLoader from 'cornerstone-web-image-loader';

import cornerstoneMath from 'cornerstone-math';
import cornerstoneTools from 'cornerstone-tools';
import Hammer from 'hammerjs';

import request from 'umi-request';

import config from '../config';

// function evenMoreHelloWorld() {
//   // Note this would need to be called from somewhere
//   // Within the Tool's implementation.
//   console.log('Hello World from the even more hello world mixin!');
// }

const initCornerstone = () => {
  // console.log('初始化 initCornerstone ...');

  // Cornertone Tools
  cornerstoneTools.external.cornerstone = cornerstone;
  cornerstoneTools.external.Hammer = Hammer;
  cornerstoneTools.external.cornerstoneMath = cornerstoneMath;

  // cornerstoneTools 初始化
  cornerstoneTools.init({
    // 是否改变鼠标的图标
    showSVGCursors: true,
  });
  // 增加自定义工具

  // Preferences
  const fontFamily =
    'Work Sans, Roboto, OpenSans, HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif';
  cornerstoneTools.textStyle.setFont(`16px ${fontFamily}`);
  cornerstoneTools.toolStyle.setToolWidth(2);
  cornerstoneTools.toolColors.setToolColor('rgb(255, 255, 0)');
  cornerstoneTools.toolColors.setActiveColor('rgb(0, 255, 0)');
  cornerstoneTools.store.state.touchProximity = 40;

  // IMAGE LOADER

  cornerstoneWebImageLoader.external.cornerstone = cornerstone;
  cornerstoneWebImageLoader.configure({
    beforeSend: (xhr) => {
      // Add custom headers here (e.g. auth tokens)
      // xhr.setRequestHeader('x-auth-token', 'my auth token');

      xhr.setRequestHeader('Accept', 'image/jpeg');
    },
  });

  cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
  cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
  cornerstoneWADOImageLoader.webWorkerManager.initialize({
    maxWebWorkers: navigator.hardwareConcurrency || 1,
    startWebWorkersOnDemand: true,
    taskConfiguration: {
      decodeTask: {
        initializeCodecsOnStartup: false,
        usePDFJS: false,
        strict: false,
      },
    },
  });

  // function metaDataProvider(type, imageId) {
  //   console.log('type', type);
  //   console.log('imageId', imageId);
  //   if (type === 'imagePlaneModule') {
  //     if (imageId === 'ct://1') {
  //       return {
  //         frameOfReferenceUID: '1.3.6.1.4.1.5962.99.1.2237260787.1662717184.1234892907507.1411.0',
  //         rows: 512,
  //         columns: 512,
  //         rowCosines: {
  //           x: 1,
  //           y: 0,
  //           z: 0,
  //         },
  //         columnCosines: {
  //           x: 0,
  //           y: 1,
  //           z: 0,
  //         },
  //         imagePositionPatient: {
  //           x: -250,
  //           y: -250,
  //           z: -399.100006,
  //         },
  //         rowPixelSpacing: 0.976562,
  //         columnPixelSpacing: 0.976562,
  //       };
  //     }
  //   }
  // }

  // Register this provider with CornerstoneJS
  // cornerstone.metaData.addProvider(metaDataProvider);

  function getOrthancImage(imageId: any) {
    let result = null;

    request(`${config}/instances/jpeg95-${imageId}`, { method: 'GET' })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // register our imageLoader plugin with cornerstone
  cornerstone.registerImageLoader('', getOrthancImage);

  // Debug
  window.cornerstone = cornerstone;
  window.cornerstoneTools = cornerstoneTools;
};

export default initCornerstone;
