/*
 * @Author: linkenzone
 * @Date: 2021-09-26 17:58:40
 * @Descripttion: Do not edit
 *
 * 代码改写来自 cornerstone-master
 * src\internal\getModalityLUT.js
 */

import generateLut from './generateLut';
import computeAutoVoi from './computeAutoVoi';

/**
 * Retrieve or generate a LUT Array for an Image and Viewport
 *
 * @param {Image} image An Image Object
 * @param {Viewport} viewport An Viewport Object
 * @param {Boolean} invalidated Whether or not the LUT data has been invalidated
 * (e.g. by a change to the windowWidth, windowCenter, or invert viewport parameters).
 * @return {Uint8ClampedArray} LUT Array
 * @memberof rendering
 */
export default function getLut(image, viewport, invalidated) {
  // If we have a cached lut and it has the right values, return it immediately

  //   if (
  //     image.cachedLut !== undefined &&
  //     image.cachedLut.windowCenter === viewport.voi.windowCenter &&
  //     image.cachedLut.windowWidth === viewport.voi.windowWidth &&
  //     lutMatches(image.cachedLut.modalityLUT, viewport.modalityLUT) &&
  //     lutMatches(image.cachedLut.voiLUT, viewport.voiLUT) &&
  //     image.cachedLut.invert === viewport.invert &&
  //     invalidated !== true
  //   ) {
  //     return image.cachedLut.lutArray;
  //   }

  computeAutoVoi(viewport, image);

  // Lut is invalid or not present, regenerate it and cache it
  generateLut(
    image,
    viewport.voi.windowWidth,
    viewport.voi.windowCenter,
    viewport.invert,
    viewport.modalityLUT,
    viewport.voiLUT,
  );

  image.cachedLut.windowWidth = viewport.voi.windowWidth;
  image.cachedLut.windowCenter = viewport.voi.windowCenter;
  image.cachedLut.invert = viewport.invert;
  image.cachedLut.voiLUT = viewport.voiLUT;
  image.cachedLut.modalityLUT = viewport.modalityLUT;

  return {
    lutArray: image.cachedLut.lutArray,
    windowWidth: viewport.voi.windowWidth,
    windowCenter: viewport.voi.windowCenter,
  };
}
