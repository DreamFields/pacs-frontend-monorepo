/*
 * @Author: linkenzone
 * @Date: 2021-07-07 14:26:42
 * @Descripttion: Do not edit
 */
import React, { useEffect, useRef } from 'react';

import * as THREE from 'three';

import Stats from 'three/examples/jsm/libs/stats.module.js';
import { unzipSync } from 'three/examples/jsm/libs/fflate.module.js';

import style from './style.less';

import RENDER_VERTEX_SHADER from './shaders/vertexShader.vert';
import RENDER_FRAGMENT_SHADER from './shaders/fragmentShader.frag';

const Demo: React.FC<unknown> = () => {
  const containerRef: any = useRef(null);
  const context: any = useRef(null);

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
    // 获取 Dom
    const container = containerRef.current;
    // 获取长和宽
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 初始化摄像机
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
    camera.position.z = 70;

    // 创建场景
    const scene = new THREE.Scene();

    let mesh;

    const planeWidth = 70;
    const planeHeight = 35;
    // width 256, height 256, depth 109, 8-bit, zip archived raw data

    new THREE.FileLoader()
      .setResponseType('arraybuffer')
      .load('./head256x256x109.zip', (data: any) => {
        const zip = unzipSync(new Uint8Array(data));
        const array = new Uint8Array(zip.head256x256x109.buffer);
        console.log('array', array);

        const texture = new THREE.DataTexture2DArray(array, 256, 256, 109);
        texture.format = THREE.RedFormat;
        texture.type = THREE.UnsignedByteType;

        console.log('texture', texture);

        const material = new THREE.ShaderMaterial({
          uniforms: {
            diffuse: { value: texture },
            depth: { value: 55 },
            size: { value: new THREE.Vector2(planeWidth, planeHeight) },
          },
          vertexShader: RENDER_VERTEX_SHADER,
          fragmentShader: RENDER_FRAGMENT_SHADER,
          // glslVersion: THREE.GLSL3,
        });

        const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);

        mesh = new THREE.Mesh(geometry, material);

        context.current.mesh = mesh;

        scene.add(mesh);
      });

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
    const depthStep = 0.4;
    if (mesh) {
      let { value } = mesh.material.uniforms.depth;

      value += depthStep;

      // console.log('depth value', value);

      if (value > 256.0 || value < 0.0) {
        if (value > 1.0) value = 256.0 * 2.0 - value;
        if (value < 0.0) value = -value;

        value = -depthStep;
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
    init();
    animate();
    // start();

    const container = containerRef.current;

    return () => {
      const { scene, mesh, renderer } = context.current;

      stop();
      window.removeEventListener('resize', onWindowResize);
      container.removeChild(renderer.domElement);
      scene.remove(mesh);
    };
  }, []);

  return (
    <div style={{ height: '800px' }}>
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        <div className={style.vis} ref={containerRef} />
      </div>
    </div>
  );
};

export default Demo;
