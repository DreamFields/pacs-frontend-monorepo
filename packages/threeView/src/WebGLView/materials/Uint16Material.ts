/* eslint-disable @typescript-eslint/no-namespace */
/*
 * @Author: linkenzone
 * @Date: 2021-10-25 10:43:30
 * @Descripttion: 16 bit 图片的材质
 * 
 * 这里弃用掉
 * 
 * 如果从这里导出的话，渲染多个窗口的时候会有BUG
 */
import * as THREE from 'three';
import { extend } from '@react-three/fiber';

import RENDER_VERTEX_SHADER from './shaders/Uint16.vert';
import RENDER_FRAGMENT_SHADER from './shaders/Uint16.frag';

import { shaderMaterial } from '@react-three/drei';

// const Uint16Material: any = shaderMaterial(
//   {
//     diffuse: undefined,
//     depth: 0,
//     size: undefined,
//     ww: undefined,
//     wl: undefined,
//     rescaleSlope: 1,
//     rescaleIntercept: 0,
//     type: undefined,
//     numOfSlice: undefined,
//   },
//   RENDER_VERTEX_SHADER,
//   RENDER_FRAGMENT_SHADER,
// );

const Uint16Material = {
  uniforms: {
    diffuse: { value: undefined },
    depth: { value: 20 },
    size: { value: new THREE.Vector2(0, 0) },
    ww: { value: undefined },
    wl: { value: undefined },
    rescaleSlope: { value: 1 },
    rescaleIntercept: { value: 0 },
    orientation: { value: 0 },
    numOfSlice: { value: 0 },
  },
  vertexShader: RENDER_VERTEX_SHADER,
  fragmentShader: RENDER_FRAGMENT_SHADER,
};

export { Uint16Material };
