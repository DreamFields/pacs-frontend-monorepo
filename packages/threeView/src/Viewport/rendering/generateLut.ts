/* eslint-disable no-plusplus */

/*
 * @Author: linkenzone
 * @Date: 2021-09-26 16:51:14
 * @Descripttion:
 * 生成 lut
 * lut : Look Up Table
 *
 * 代码改写来自 cornerstone-master
 * src\rendering\getLut.js
 */

import getModalityLUT from './getModalityLUT';
import getVOILUT from './getVOILUT';

/**
 * @description:
 * @param {*} image
 * @param {*} windowWidth
 * @param {*} windowCenter
 * @param {*} invert
 * @param {*} modalityLUT
 * @param {*} voiLUT
 * @return {*}
 */
const generateLut = (image, windowWidth, windowCenter, invert, modalityLUT, voiLUT) => {
  const { maxPixelValue } = image;
  const { minPixelValue } = image;
  const offset = Math.min(minPixelValue, 0);

  if (image.cachedLut === undefined) {
    const length = maxPixelValue - offset + 1;

    image.cachedLut = {};
    image.cachedLut.lutArray = new Uint8ClampedArray(length);
  }

  const lut = image.cachedLut.lutArray;
  const mlutfn = getModalityLUT(image.slope, image.intercept, modalityLUT);
  const vlutfn = getVOILUT(windowWidth, windowCenter, voiLUT);

  // console.log('------generateLut------');
  // console.log('maxPixelValue', maxPixelValue);
  // console.log('minPixelValue', minPixelValue);
  // console.log('windowWidth', windowWidth);
  // console.log('windowCenter', windowCenter);

  // 是否 反色
  if (invert === true) {
    for (let storedValue = minPixelValue; storedValue <= maxPixelValue; storedValue++) {
      lut[storedValue + -offset] = 255 - vlutfn(mlutfn(storedValue));
    }
  } else {
    for (let storedValue = minPixelValue; storedValue <= maxPixelValue; storedValue++) {
      lut[storedValue + -offset] = vlutfn(mlutfn(storedValue));
    }
  }

  return lut;
};

export default generateLut;
