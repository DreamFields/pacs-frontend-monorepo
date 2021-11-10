/*
 * @Author: linkenzone
 * @Date: 2021-07-01 14:24:59
 * @Descripttion: Do not edit
 */

const Slice = [
  {
    name: 'colorBy',
    domain: {},
  },
  {
    name: 'useColorByForColor',
  },
  {
    name: 'useColorByForOpacity',
  },
  {
    name: 'visibility',
  },
  {
    name: 'windowWidth',
    domain: { min: 0, max: 255, step: 0.01 },
  },
  {
    name: 'windowLevel',
    domain: { min: 0, max: 255, step: 0.01 },
  },
  {
    name: 'slice',
    domain: { min: 0, max: 255, step: 1 },
  },
  {
    name: 'opacity',
    domain: { min: 0, max: 1, step: 0.01 },
  },
];

export default {
  Slice,
};
