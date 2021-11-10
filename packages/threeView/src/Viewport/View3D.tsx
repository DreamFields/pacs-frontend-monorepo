/*
 * @Author: linkenzone
 * @Date: 2021-07-14 14:40:07
 * @Descripttion: Do not edit
 */
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { VolumeRenderShader1 } from 'three/examples/jsm/shaders/VolumeShader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { observer } from 'mobx-react';

import style from './style.less';
import ImageArray from '../store/ImageArray';
import { getDicomSeriesImageData } from '../io/OrthancDicomLoader';

const View3D: React.FC<any> = observer((props) => {
  const containerRef: any = useRef(null);
  const context: any = useRef(null);

  const { store } = props;

  const render = () => {
    const { renderer, scene, camera } = context.current;
    renderer.render(scene, camera);
  };

  function onWindowResize() {
    // 获取 Dom
    const container = containerRef.current;
    // 获取长和宽
    const width = container.clientWidth;
    const height = container.clientHeight;

    const { renderer, camera } = context.current;

    renderer.setSize(width, height);
    const aspect = width / height;
    const frustumHeight = camera.top - camera.bottom;
    camera.left = (-frustumHeight * aspect) / 2;
    camera.right = (frustumHeight * aspect) / 2;
    camera.updateProjectionMatrix();
    render();
  }

  const init = async () => {
    const res: boolean = await getDicomSeriesImageData(
      '6c1df2fa-9ccb6202-68731ddc-b0e7ab52-d1a1e9e5',
    );
    if (!res) return;

    const { WW, WL, dataArray, rescaleSlope, rescaleIntercept, xDim, zDim, yDim } = store;

    // 获取 Dom
    const container = containerRef.current;
    // 获取长和宽
    const width = container.clientWidth;
    const height = container.clientHeight;
    // 创建场景
    const scene = new THREE.Scene();
    // create renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // Create camera (The volume renderer does not work very well with perspective yet)
    const h = 512; // frustum height
    const aspect = width / height;
    const camera = new THREE.OrthographicCamera(
      (-h * aspect) / 2,
      (h * aspect) / 2,
      h / 2,
      -h / 2,
      1,
      1000,
    );
    camera.position.set(0, 0, 128);
    camera.up.set(0, 0, 1); // In our data, z is up

    // 设置上下文
    context.current = {
      camera,
      renderer,
      scene,
    };

    // Create controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render);
    controls.target.set(64, 64, 128);
    controls.minZoom = 0.5;
    controls.maxZoom = 4;
    controls.update();

    // load the data

    const numPixels = store.xDim * store.yDim * store.zDim;
    const imgPixels = new Uint8Array(numPixels);

    if (WW !== null && WL !== null) {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < numPixels; i++) {
        const pos = i;

        // NewValue = (RawPixelValue * RescaleSlope) + RescaleIntercept
        // U = m*SV + b
        const valScaled = dataArray[pos] * rescaleSlope + rescaleIntercept;

        let val = Math.floor(((valScaled - WL + WW / 2) * 255) / WW);

        val = val >= 0 ? val : 0;
        val = val < 255 ? val : 255;

        imgPixels[i] = val;
      }
    }

    const texture = new THREE.DataTexture3D(imgPixels, store.xDim, store.yDim, store.zyDim);
    texture.format = THREE.RedFormat;
    texture.type = THREE.FloatType;
    // eslint-disable-next-line no-multi-assign
    texture.minFilter = texture.magFilter = THREE.LinearFilter;
    texture.unpackAlignment = 1;

    // Colormap textures
    const cmtextures = {
      viridis: new THREE.TextureLoader().load('textures/cm_viridis.png', render),
      gray: new THREE.TextureLoader().load('textures/cm_gray.png', render),
    };

    // Material
    const shader = VolumeRenderShader1;

    const uniforms = THREE.UniformsUtils.clone(shader.uniforms);

    uniforms.u_data.value = texture;
    uniforms.u_size.value.set(xDim, yDim, zDim);

    uniforms.u_clim.value.set(0, 1);
    uniforms.u_renderstyle.value = 0; // 0: MIP, 1: ISO
    uniforms.u_renderthreshold.value = 0.15; // For ISO renderstyle
    uniforms.u_cmdata.value = cmtextures.viridis;

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader,
      side: THREE.BackSide, // The volume shader uses the backface as its "reference point"
    });

    // THREE.Mesh
    const geometry = new THREE.BoxGeometry(xDim, yDim, zDim);
    geometry.translate(xDim / 2 - 0.5, yDim / 2 - 0.5, zDim / 2 - 0.5);

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    render();

    window.addEventListener('resize', onWindowResize);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div style={{ height: '800px' }}>
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        <div className={style.vis} ref={containerRef} />
      </div>
    </div>
  );
});

const View3DConnected: React.FC<any> = observer((props) => {
  return <View3D store={ImageArray} />;
});

export default View3DConnected;
