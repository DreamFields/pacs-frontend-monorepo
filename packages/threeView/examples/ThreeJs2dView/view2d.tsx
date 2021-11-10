/* eslint-disable react-hooks/exhaustive-deps */
/*
 * @Author: linkenzone
 * @Date: 2021-10-08 14:23:56
 * @Descripttion: Do not edit
 */
import React, { useEffect, useRef } from 'react';

import * as THREE from 'three';

import Stats from 'three/examples/jsm/libs/stats.module.js';

import { DragControls } from 'three/examples/jsm/controls/DragControls.js';

import style from './style.less';

import RENDER_VERTEX_SHADER from './shaders/vertexShader.vert';
import RENDER_FRAGMENT_SHADER from './shaders/fragmentShader.frag';

import { observer } from 'mobx-react';

import ImageArray from '../../src/store/ImageArray';
import storedPixelDataToImageData from './util/storedPixelDataToImageData';

// type
// 0 z轴
// 1 x轴
// 2 y轴

type View2DProps = {
  type?: number;
  uuid?: string;
};

const View2d: React.FC<View2DProps> = observer((props) => {
  const containerRef: any = useRef(null);
  const context: any = useRef(null);

  const store = ImageArray;
  const { loading } = store;

  const { type } = props;

  let numOfSlice = 0;
  let depthStep = 0.4;
  let controls;

  // 渲染
  const render = () => {
    const { camera, scene, renderer } = context.current;
    renderer.render(scene, camera);
  };

  // 窗口重置的方法
  const onWindowResize = () => {
    const { camera, renderer } = context.current;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    render();
  };

  // 初始化
  const init = () => {
    // 从数据流获取数据
    const { dataArray, rescaleSlope, rescaleIntercept, boxSize, WW, WL, xDim, yDim, zDim } = store;

    if (!dataArray) return;

    // 获取 Dom
    const container = containerRef.current;
    // 获取长和宽
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 初始化摄像机 透视
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);

    // 正交
    // const camera = new THREE.OrthographicCamera(
    //   width / -2,
    //   width / 2,
    //   height / 2,
    //   height / -2,
    //   1,
    //   1000,
    // );

    camera.position.z = 70;

    // 创建场景
    const scene = new THREE.Scene();

    const planeWidth = 50;
    const planeHeight = 50;

    // 获取数据
    console.log('dataArray', dataArray);
    console.log('type', type);

    if (type == 0) {
      numOfSlice = zDim;
    } else if (type == 1) {
      numOfSlice = xDim;
    } else {
      numOfSlice = yDim;
    }

    // 先对 uint16 的数据进行打包，变成 uint8 的数据
    const imageData = storedPixelDataToImageData(dataArray, xDim, yDim, zDim);

    const texture = new THREE.DataTexture3D(imageData, xDim, yDim, zDim);
    // 将每个元素同时作为亮度分量和Alpha分量来读取。
    texture.format = THREE.LuminanceAlphaFormat;
    texture.type = THREE.UnsignedByteType;

    console.log('texture', texture);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        diffuse: { value: texture },
        depth: { value: 20 },
        size: { value: new THREE.Vector2(planeWidth, planeHeight) },
        ww: { value: WW },
        wl: { value: WL },
        rescaleSlope: { value: rescaleSlope },
        rescaleIntercept: { value: rescaleIntercept },
        type: { value: type },
        numOfSlice: { value: numOfSlice },
      },
      vertexShader: RENDER_VERTEX_SHADER,
      fragmentShader: RENDER_FRAGMENT_SHADER,
      // glslVersion: THREE.GLSL3,
    });

    const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);

    const mesh = new THREE.Mesh(geometry, material);

    console.log('mesh', mesh);

    // context.current.mesh = mesh;

    scene.add(mesh);
    // 设置背景颜色
    const color = new THREE.Color(0x3f436b);
    scene.background = color;

    // 2D Texture array is available on WebGL 2.0

    const renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);

    renderer.setSize(width, height);

    container.appendChild(renderer.domElement);

    const stats = Stats();
    stats.dom.style.position = 'absolute';

    container.appendChild(stats.dom);

    window.addEventListener('resize', onWindowResize);

    // 设置上下文
    context.current = {
      mesh,
      camera,
      renderer,
      stats,
      scene,
    };
  };

  // 渲染循环
  const animate = () => {
    const { mesh, stats } = context.current;
    if (mesh) {
      let { value } = mesh.material.uniforms.depth;
      value += depthStep;
      if (value > numOfSlice || value < 0.0) {
        if (value > 1.0) value = numOfSlice * 2.0 - value;
        if (value < 0.0) value = -value;
        depthStep = -depthStep;
      }
      mesh.material.uniforms.depth.value = value;
    }
    render();
    stats.update();

    const frameId = requestAnimationFrame(animate);
    context.current.frameId = frameId;
  };

  // 开始渲染
  const start = () => {
    let { frameId } = context.current;
    console.log('frameId', frameId);
    if (!frameId) {
      frameId = requestAnimationFrame(animate);
      context.current.frameId = frameId;
    }
  };

  // 结束渲染
  const stop = () => {
    const { frameId } = context.current;
    cancelAnimationFrame(frameId);
    context.current.frameId = null;
  };

  useEffect(() => {
    if (loading === false) {
      init();
      animate();
    }

    // const container = containerRef.current;

    return () => {
      //   const { scene, mesh, renderer } = context.current;
      //   stop();
      //   window.removeEventListener('resize', onWindowResize);
      //   container.removeChild(renderer.domElement);
      //   scene.remove(mesh);
    };
  }, [loading]);

  useEffect(() => {
    const container = containerRef.current;
    return () => {
      // 执行清理
      const { scene, mesh, renderer } = context.current;
      stop();
      window.removeEventListener('resize', onWindowResize);
      container.removeChild(renderer.domElement);
      scene.remove(mesh);
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div style={{ position: 'relative', width: 'calc(100% - 20px)', height: '100%' }}>
        <div className={style.vis} ref={containerRef} />
      </div>
    </div>
  );
});

export default View2d;
