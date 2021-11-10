/*
 * @Author: linkenzone
 * @Date: 2021-05-13 17:03:38
 * @Descripttion: Do not edit
 */

import initCornerstone from './utils/initCornerstone';
import customTools from './customTools';
import ConnectedViewport from './viewer/ConnectedViewport';

import services from './services';

const cornerstoneExtension = {
  customTools,
  initCornerstone,
  ConnectedViewport,
  services,
};

export { customTools, initCornerstone, ConnectedViewport, services };

export default cornerstoneExtension;
