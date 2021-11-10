/*
 * @Author: linkenzone
 * @Date: 2021-10-09 16:45:22
 * @Descripttion: Do not edit
 */

/**
 * 来自 cornerstone
 * src\webgl\shaders\uint16.js
 *
 * Convert stored pixel data to image data.
 *
 * For uint16 pack uint16 into two uint8 channels (r and a).
 *
 * @param {dataArray} dataArray dataArray
 * @returns {Uint8Array} The image data for use by the WebGL shader
 * @memberof WebGLRendering
 */
function storedPixelDataToImageData(dataArray, width, height, depth) {
  // Transfer image data to alpha and luminance channels of WebGL texture
  // Credit to @jpambrun and @fernandojsg

  // Pack uint16 into two uint8 channels (r and a)
  const pixelData = dataArray;

  const numberOfChannels = 2;
  const data = new Uint8Array(width * height * depth * numberOfChannels);
  let offset = 0;

  console.time('转换pixelData为uint8');

  for (let i = 0; i < pixelData.length; i++) {
    const val = pixelData[i];

    data[offset++] = val & 0xff;
    data[offset++] = val >> 8;
  }

  console.log('pixelData', data);
  console.timeEnd('转换pixelData为uint8');

  return data;
}

export default storedPixelDataToImageData;
