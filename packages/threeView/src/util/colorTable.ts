/**
 * 伪彩
 */

import { clamp } from './clamp';

export const ColorTable = {
  BW_LINEAR: { val: 'BW_LINEAR', display: 'black/white linear' },
  WB_LINEAR: { val: 'WB_LINEAR', display: 'white/black linear' },
  BWB_LINEAR: { val: 'BWB_LINEAR', display: 'black/white/black' },
  WBW_LINEAR: { val: 'WBW_LINEAR', display: 'white/black/white' },
  RED_TEMP: { val: 'RED_TEMP', display: 'red temperature' },
  INV_RED_TEMP: { val: 'INV_RED_TEMP', display: 'inverse red temp.' },
  HOT_METAL: { val: 'HOT_METAL', display: 'hot metal' },
  NIH: { val: 'NIH', display: 'NIH' },
};

type RGB = {
  r?: number;
  g?: number;
  b?: number;
};

type HSV = {
  h?: number;
  s?: number;
  v?: number;
};

/**
 * hsv to rgb
 * @param hsv
 */
const hsv_to_rgb = (hsv: HSV) => {
  const rgb: RGB = {};
  let fraction;
  let p;
  let q;
  let t;
  let whole;
  const UCHAR_MAX = 0xff;

  if (hsv.s === 0.0) {
    /* saturation is zero (on black white line)n */

    rgb.r = UCHAR_MAX * hsv.v;
    rgb.g = UCHAR_MAX * hsv.v;
    rgb.b = UCHAR_MAX * hsv.v;
  } else {
    if (hsv.h === 360.0) hsv.h = 0.0; /* from [0 360] to [0 360) */

    whole = Math.floor(hsv.h / 60.0);
    fraction = hsv.h / 60.0 - whole;

    p = hsv.v * (1.0 - hsv.s);
    q = hsv.v * (1.0 - hsv.s * fraction);
    t = hsv.v * (1.0 - hsv.s * (1.0 - fraction));

    switch (whole) {
      case 0:
        rgb.r = UCHAR_MAX * hsv.v;
        rgb.g = UCHAR_MAX * t;
        rgb.b = UCHAR_MAX * p;
        break;
      case 1:
        rgb.r = UCHAR_MAX * q;
        rgb.g = UCHAR_MAX * hsv.v;
        rgb.b = UCHAR_MAX * p;
        break;
      case 2:
        rgb.r = UCHAR_MAX * p;
        rgb.g = UCHAR_MAX * hsv.v;
        rgb.b = UCHAR_MAX * t;
        break;
      case 3:
        rgb.r = UCHAR_MAX * p;
        rgb.g = UCHAR_MAX * q;
        rgb.b = UCHAR_MAX * hsv.v;
        break;
      case 4:
        rgb.r = UCHAR_MAX * t;
        rgb.g = UCHAR_MAX * p;
        rgb.b = UCHAR_MAX * hsv.v;
        break;
      case 5:
        rgb.r = UCHAR_MAX * hsv.v;
        rgb.g = UCHAR_MAX * p;
        rgb.b = UCHAR_MAX * q;
        break;
      default:
        /* should never get here */
        rgb.r = 0;
        rgb.g = 0;
        rgb.b = 0;
        break;
    }
  }

  return rgb;
};

/**
 * 输出对应颜色的像素值
 * @param datum 图像像素值
 * @param which Color table值
 * @param min 像素范围下限
 * @param max 像素范围上限
 */
export const lookUpTable = (datum, which: string, min = 0, max = 0xff) => {
  let temp = 0;
  let scale = 1;
  let ret = {
    r: 0,
    g: 0,
    b: 0,
    a: 0,
  };
  const hsv: HSV = {};
  let hsv2rgb;
  switch (ColorTable[which]) {
    case ColorTable.WB_LINEAR:
      ret = lookUpTable(max - datum + min, ColorTable.BW_LINEAR.val, min, max);
      ret.a = 0xff - ret.a;
      break;

    case ColorTable.BWB_LINEAR:
      temp = (2 * (datum - min) * 0xff) / (max - min);
      if (temp > 0xff) {
        temp = 511 - temp;
      }

      temp = clamp(0, 0xff, temp);

      ret = { r: temp, g: temp, b: temp, a: temp };
      break;
    case ColorTable.WBW_LINEAR:
      ret = lookUpTable(datum, ColorTable.BWB_LINEAR.val, min, max);
      ret.r = 0xff - ret.r;
      ret.g = 0xff - ret.g;
      ret.b = 0xff - ret.b;
      break;
    case ColorTable.RED_TEMP:
      /* this may not be exactly right.... */
      scale = 0xff / (max - min);
      temp = (datum - min) / (max - min);
      if (temp > 1.0) ret = { r: 0xff, g: 0xff, b: 0xff, a: 0xff };
      else if (temp < 0.0) ret = { r: 0, g: 0, b: 0, a: 0 };
      else {
        ret.r = temp >= 0.7 ? 0xff : (scale * (datum - min)) / 0.7;
        ret.g = temp >= 0.5 ? 2 * scale * (datum - min / 2.0 - max / 2.0) : 0;
        ret.b = temp >= 0.5 ? 2 * scale * (datum - min / 2.0 - max / 2.0) : 0;
        ret.a = 0xff * temp;
      }
      break;
    case ColorTable.INV_RED_TEMP:
      ret = lookUpTable(max - datum + min, ColorTable.RED_TEMP.val, min, max);
      ret.a = 0xff - ret.a;
      break;
    case ColorTable.HOT_METAL:
      temp = (datum - min) / (max - min); /* between 0.0 and 1.0 */
      if (temp > 1.0) {
        ret = { r: 0xff, g: 0xff, b: 0xff, a: 0xff };
      } else if (temp < 0.0) {
        ret = { r: 0, g: 0, b: 0, a: 0 };
      } else {
        /* several "magic" numbers are used, i.e. I have no idea how they're derived,
       but they work.....
       red: distributed between 0-181 (out of 255)
       green: distributed between 128-218 (out of 255)
       blue: distributed between 192-255 (out of 255)
        */
        ret.r = temp >= 182.0 / 255.0 ? 0xff : 0xff * temp * (255.0 / 182);
        if (temp < 128.0 / 255.0) {
          ret.g = 0x00;
        } else if (temp >= 219.0 / 255.0) {
          ret.g = 0xff;
        } else {
          ret.g = 0xff * (temp - 128.0 / 255.0) * (255.0 / 91.0);
        }

        ret.b = temp >= 192.0 / 255.0 ? 0xff * (temp - 192.0 / 255) * (255.0 / 63.0) : 0x00;
        ret.a = 0xff * temp;
      }
      break;
    case ColorTable.NIH:
      /* this algorithm is a complete guess, don't trust it */
      temp = (datum - min) / (max - min);
      hsv.s = 1.0;

      if (temp < 0.0) hsv.v = 0.0;
      else if (temp > 0.2) hsv.v = 1.0;
      else hsv.v = 5 * temp;

      if (temp > 1.0) {
        hsv.h = 0.0;
        ret.a = 0xff;
      } else if (temp < 0.0) {
        hsv.h = 300.0;
        ret.a = 0;
      } else {
        hsv.h = 300.0 * (1.0 - temp);
        ret.a = 0xff * temp;
      }

      hsv2rgb = hsv_to_rgb(hsv);
      ret.r = hsv2rgb.r;
      ret.g = hsv2rgb.g;
      ret.b = hsv2rgb.b;
      break;

    case ColorTable.BW_LINEAR:
    default:
      temp = ((datum - min) * 0xff) / (max - min);
      temp = clamp(0, 0xff, temp);
      ret = { r: temp, g: temp, b: temp, a: temp };
      break;
  }

  return ret;
};
