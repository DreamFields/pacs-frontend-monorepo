/* eslint-disable prefer-destructuring */

/*
 * @Author: linkenzone
 * @Date: 2021-06-30 13:21:09
 * @Descripttion: Do not edit
 */

const resize2DCameraToFit = (view: any, lookAxis: any, viewUpAxis: any, bounds: any) => {
  const camera = view.getCamera();
  const lengths = [bounds[1] - bounds[0], bounds[3] - bounds[2], bounds[5] - bounds[4]];
  const [w, h] = view.getOpenglRenderWindow().getSize();
  let bw = 0;
  let bh = 0;
  if (lookAxis === 0 && viewUpAxis === 1) {
    bw = lengths[2];
    bh = lengths[1];
  } else if (lookAxis === 0 && viewUpAxis === 2) {
    bw = lengths[1];
    bh = lengths[2];
  } else if (lookAxis === 1 && viewUpAxis === 0) {
    bw = lengths[2];
    bh = lengths[0];
  } else if (lookAxis === 1 && viewUpAxis === 2) {
    bw = lengths[0];
    bh = lengths[2];
  } else if (lookAxis === 2 && viewUpAxis === 0) {
    bw = lengths[1];
    bh = lengths[0];
  } else if (lookAxis === 2 && viewUpAxis === 1) {
    bw = lengths[0];
    bh = lengths[1];
  }
  /* eslint-enable prefer-destructuring */
  const viewAspect = w / h;
  const boundsAspect = bw / bh;
  let scale = 0;
  if (viewAspect >= boundsAspect) {
    scale = bh / 2;
  } else {
    scale = bw / 2 / viewAspect;
  }
  camera.setParallelScale(scale);
};

export { resize2DCameraToFit };
