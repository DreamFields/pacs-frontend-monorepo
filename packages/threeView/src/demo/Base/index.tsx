import React, { useEffect, useState, useRef } from 'react';

import * as THREE from 'three';

import Stats from 'three/examples/jsm/libs/stats.module.js';

import style from './style.less';

const BaseDemo: React.FC<unknown> = () => {
  const mount: any = useRef(null);
  const context: any = useRef(null);
  const [isAnimating, setAnimating] = useState(true);

  useEffect(() => {
    const stats = Stats();

    let frameId: any;
    const mountIns = mount.current;
    // 获取渲染窗口的长和宽
    let width = mount.current.clientWidth;
    let height = mount.current.clientHeight;
    // 建立场景、相机和渲染器
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, // 视野角度（FOV）
      width / height, // 长宽比（aspect ratio）
      0.1, // 近截面（near）
      1000, // 远截面（far）
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);

    // 创建一个立方体
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    camera.position.z = 5;

    // 渲染场景
    const renderScene = () => {
      renderer.render(scene, camera);

      stats.update();
    };

    const handleResize = () => {
      width = mount.current.clientWidth;
      height = mount.current.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderScene();
    };

    // 动画循环
    const animate = () => {
      // requestAnimationFrame(animate);

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderScene();
      frameId = window.requestAnimationFrame(animate);
    };
    // 开始渲染
    const start = () => {
      if (!frameId) {
        frameId = requestAnimationFrame(animate);
      }
    };
    // 结束渲染
    const stop = () => {
      cancelAnimationFrame(frameId);
      frameId = null;
    };

    window.addEventListener('resize', handleResize);
    mount.current.appendChild(renderer.domElement);

    stats.dom.style.position = 'absolute';
    mount.current.appendChild(stats.dom);

    start();

    // 设置上下文
    context.current = { controls: { start, stop } };

    return () => {
      stop();
      window.removeEventListener('resize', handleResize);
      mountIns.removeChild(renderer.domElement);

      scene.remove(cube);
      geometry.dispose();
      material.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const { controls } = context.current;
    console.log('isAnimating', controls);
    if (!controls) return;

    if (isAnimating) {
      controls.start();
    } else {
      controls.stop();
    }
  }, [isAnimating]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div className={style.info}>点击暂停</div>
      <div
        className={style.vis}
        ref={mount}
        onClick={() => {
          setAnimating(!isAnimating);
        }}
      />
    </div>
  );
};

export default BaseDemo;
