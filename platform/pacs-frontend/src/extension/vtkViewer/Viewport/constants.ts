/* eslint-disable no-template-curly-in-string */
/*
 * @Author: linkenzone
 * @Date: 2021-06-30 18:28:02
 * @Descripttion: Do not edit
 */

export const ANNOTATIONS = {
  s: 'Image&nbsp;size:&nbsp;${sliceWidth}&nbsp;x&nbsp;${sliceHeight}',
  nw:
    'Origin:&nbsp;${sliceOrigin}<br>Spacing:&nbsp;${sliceSpacing}&nbsp;mm<br>${sliceIndex}&nbsp;of&nbsp;${sliceCount}',
  se: 'WL:&nbsp;${windowLevel}&nbsp;/&nbsp;WW:&nbsp;${windowWidth}',
};

export const VIEW_ORIENTATIONS = {
  default: {
    axis: 1,
    orientation: -1,
    viewUp: [0, 0, 1],
  },
  x: {
    axis: 0,
    orientation: 1,
    viewUp: [0, 0, 1],
  },
  y: {
    axis: 1,
    orientation: -1,
    viewUp: [0, 0, 1],
  },
  z: {
    axis: 2,
    orientation: -1,
    viewUp: [0, -1, 0],
  },
};
