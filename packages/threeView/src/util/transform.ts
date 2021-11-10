/*
 * @Author: Meng Tian
 * @Date: 2021-07-17 17:30:46
 * @Description: 旋转矩阵
 */
/**
 * @description: 用于（x，y）绕center:{x,y}旋转rotate角度后的新坐标
 * @param {number} x
 * @param {number} y
 * @param {any} center：旋转中心
 * @param {number} rotate：旋转角度，顺时针传入值为正
 * @return {*}
 */
export const rotateMatrix = (
  x: number,
  y: number,
  center: { x: number; y: number },
  rotate: number,
): any => {
  const rotatePI = (rotate * Math.PI) / 180;
  const tempPos = {
    x: x - center.x,
    y: y - center.y,
  };
  // console.log('平移后的坐标', tempPos);
  const changePos = {
    x: Math.cos(rotatePI) * tempPos.x - Math.sin(rotatePI) * tempPos.y,
    y: Math.sin(rotatePI) * tempPos.x + Math.cos(rotatePI) * tempPos.y,
  };
  // console.log('旋转后的坐标', changePos);
  const newPos = {
    x: changePos.x + center.x,
    y: changePos.y + center.y,
  };
  // console.log('平移后的坐标newPos', newPos);
  return newPos;
};

/**
 * @description: 用于（x，y）以center:{x,y}为缩放中心缩放后scaleBy倍的新坐标
 * @param {*}
 * @return {*}
 */
export const relativeZoom = (
  x: number,
  y: number,
  center: { x: number; y: number },
  scaleBy: number,
) => {
  return {
    x:x*scaleBy+center.x*(1-scaleBy),
    y:y*scaleBy+center.y*(1-scaleBy)
  }
};
