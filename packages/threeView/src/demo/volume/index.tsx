/*
 * @Author: linkenzone
 * @Date: 2021-07-14 17:14:24
 * @Descripttion: Do not edit
 */
import React, { useEffect, useRef, useState } from 'react';

import * as THREE from 'three';

import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import style from './style.less';

import ImageArray from '../../store/ImageArray';
import { observer } from 'mobx-react';

import vertexShaderFirstPass from './shaders/vertexShaderFirstPass.vert';
import fragmentShaderFirstPass from './shaders/fragmentShaderFirstPass.frag';

import fragmentShaderSecondPass from './shaders/fragmentShaderSecondPass.frag';
import vertexShaderSecondPass from './shaders/vertexShaderSecondPass.vert';
import { getDicomSeriesImageData } from '../../io/OrthancDicomLoader';
import { Slider } from 'antd';

import ColorPicker from './ColorPicker';

const Demo: React.FC<{ store: any }> = observer((props) => {
  const containerRef: any = useRef(null);
  const tfCanvas: any = useRef(null);
  const context: any = useRef(null);

  const [colorSetting, setColorSetting] = useState([
    { color: '#00fa58', stepPos: 0.1 },
    { color: '#cc6600', stepPos: 0.7 },
    { color: '#f2f200', stepPos: 1 },
  ]);

  const [steps, setSteps] = useState(100);
  const [alphaCorrection, setAlphaCorrection] = useState(0.1);

  const { store } = props;

  // 渲染
  const render = () => {
    const { camera, sceneFirstPass, sceneSecondPass, renderer, rtTexture, materialSecondPass } =
      context.current;

    // Render first pass and store the world space coords of the back face fragments into the texture.
    renderer.setRenderTarget(rtTexture);
    renderer.render(sceneFirstPass, camera);
    renderer.setRenderTarget(null);

    renderer.render(sceneSecondPass, camera);

    // materialSecondPass.uniforms.steps.value = steps;
    // materialSecondPass.uniforms.alphaCorrection.value = alphaCorrection;
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

  // 渲染循环
  const animate = () => {
    const { stats } = context.current;
    render();
    stats.update();

    const frameId = requestAnimationFrame(animate);
    context.current.frameId = frameId;
  };

  const updateTransferFunction = () => {
    console.log('colorSetting', colorSetting);
    const tfCanvasDom = tfCanvas.current;

    tfCanvasDom.height = 20;
    tfCanvasDom.width = 256;

    const ctx = tfCanvasDom.getContext('2d');

    const grd = ctx.createLinearGradient(0, 0, tfCanvasDom.width - 1, tfCanvasDom.height - 1);
    grd.addColorStop(colorSetting[0].stepPos, colorSetting[0].color);
    grd.addColorStop(colorSetting[1].stepPos, colorSetting[1].color);
    grd.addColorStop(colorSetting[2].stepPos, colorSetting[2].color);

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, tfCanvasDom.width - 1, tfCanvasDom.height - 1);

    const transferTexture = new THREE.Texture(tfCanvasDom);
    transferTexture.wrapS = THREE.ClampToEdgeWrapping;
    transferTexture.wrapT = THREE.ClampToEdgeWrapping;
    transferTexture.needsUpdate = true;

    return transferTexture;
  };

  // 初始化
  const init = async () => {
    // 获取 Dom
    const container = containerRef.current;
    // 获取长和宽
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 初始化摄像机
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.01, 3000);
    camera.position.z = 2.0;

    // 创建场景
    const sceneFirstPass = new THREE.Scene();
    const sceneSecondPass = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const stats = Stats();
    stats.dom.style.position = 'absolute';
    stats.dom.style.left = null;
    stats.dom.style.right = '0px';
    container.appendChild(stats.dom);

    // 使用NearestFilter来消除插值.  在 cube 阶段, 生成世界坐标插值
    // 将在片段着色器中产生虚假的射线方向，从而产生外来的颜色。
    const rtTexture = new THREE.WebGLRenderTarget(width, height, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
      // format: THREE.RGBFormat,
      type: THREE.FloatType,
      generateMipmaps: false,
    });

    const materialFirstPass = new THREE.ShaderMaterial({
      vertexShader: vertexShaderFirstPass,
      fragmentShader: fragmentShaderFirstPass,
      // 定义将要渲染哪一面 - 正面，背面或两者
      // BackSide，FrontSide，DoubleSide
      side: THREE.BackSide,
    });
    const boxGeometry = new THREE.BoxGeometry(1.0, 1.0, 1.0);
    const meshFirstPass = new THREE.Mesh(boxGeometry, materialFirstPass);
    sceneFirstPass.add(meshFirstPass);

    // create a buffer with color data
    const _width = 512;
    const _height = 512;
    const _depth = 41;
    const size = _width * _height;
    const data = new Uint8Array(4 * size * _depth);
    for (let i = 0; i < _depth; i += 1) {
      const color = new THREE.Color(Math.random(), Math.random(), Math.random());
      const r = Math.floor(color.r * 255);
      const g = Math.floor(color.g * 255);
      const b = Math.floor(color.b * 255);
      for (let j = 0; j < size; j += 1) {
        const stride = (i * size + j) * 4;
        data[stride] = r;
        data[stride + 1] = g;
        data[stride + 2] = b;
        data[stride + 3] = 125;
      }
    }
    const cubeTex = new THREE.DataTexture3D(data, _width, _height, _depth);
    cubeTex.format = THREE.RGBAFormat;
    cubeTex.type = THREE.UnsignedByteType;
    cubeTex.minFilter = THREE.NearestFilter;
    cubeTex.magFilter = THREE.NearestFilter;
    cubeTex.unpackAlignment = 1;

    // 有 ww 和 WL 的数据: b5981569-302c412a-6ced2c80-fd877f65-933991a4
    // 6c1df2fa-9ccb6202-68731ddc-b0e7ab52-d1a1e9e5
    // 1c45fb55-795f38d0-b9e4abd2-1d1fbc32-50a17af1

    // 获取真实数据
    const res = await getDicomSeriesImageData('b5981569-302c412a-6ced2c80-fd877f65-933991a4');
    if (!res) return;
    console.time('3D纹理生成时间');
    const { WW, WL, dataArray, rescaleSlope, rescaleIntercept } = store;
    const numPixels = store.xDim * store.yDim * store.zDim;
    const imgPixels = new Uint8Array(numPixels * 4);
    if (WW !== null && WL !== null) {
      for (let j = 0; j < store.zDim; j += 1) {
        for (let i = 0; i < store.xDim * store.yDim; i += 1) {
          const stride = (j * store.xDim * store.yDim + i) * 4;
          // NewValue = (RawPixelValue * RescaleSlope) + RescaleIntercept
          // U = m*SV + b
          const valScaled =
            dataArray[j * store.xDim * store.yDim + i] * rescaleSlope + rescaleIntercept;
          let val = Math.floor(((valScaled - WL + WW / 2) * 255) / WW);
          val = val >= 0 ? val : 0;
          val = val < 255 ? val : 255;

          imgPixels[stride] = val;
          imgPixels[stride + 1] = val;
          imgPixels[stride + 2] = val;
          imgPixels[stride + 3] = val;

          // imgPixels[stride + 3] = 255;

          // if (val < 5) {
          //   imgPixels[stride + 3] = 0;
          // } else {
          //   imgPixels[stride + 3] = 255;
          // }
        }
      }
    }
    const imgTexture = new THREE.DataTexture3D(imgPixels, store.xDim, store.yDim, store.zDim);
    imgTexture.format = THREE.RGBAFormat;
    imgTexture.type = THREE.UnsignedByteType;
    imgTexture.minFilter = THREE.LinearFilter;
    imgTexture.magFilter = THREE.LinearFilter;
    imgTexture.unpackAlignment = 1;

    console.timeEnd('3D纹理生成时间');

    // Colormap textures
    const cmtextures = {
      viridis: new THREE.TextureLoader().load('textures/cm_viridis.png', render),
      gray: new THREE.TextureLoader().load('textures/cm_gray.png', render),
    };

    const transferTexture = updateTransferFunction();

    const materialSecondPass = new THREE.ShaderMaterial({
      vertexShader: vertexShaderSecondPass,
      fragmentShader: fragmentShaderSecondPass,
      side: THREE.FrontSide,
      uniforms: {
        tex: { value: rtTexture },
        cubeTex: { value: imgTexture },
        steps: { value: steps },
        alphaCorrection: { value: alphaCorrection },
        transferTex: { value: transferTexture },
      },
    });

    const boxGeometrySecondPass = new THREE.BoxGeometry(1.0, 1.0, 1.0);
    const meshSecondPass = new THREE.Mesh(boxGeometrySecondPass, materialSecondPass);
    sceneSecondPass.add(meshSecondPass);

    // 设置上下文
    context.current = {
      camera,
      renderer,
      stats,
      sceneFirstPass,
      sceneSecondPass,
      rtTexture,
      meshSecondPass,
      materialSecondPass,
    };

    // Create controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render);
    controls.target.set(0, 0, 0);
    controls.minZoom = 0.5;
    controls.maxZoom = 4;
    controls.update();

    animate();

    window.addEventListener('resize', onWindowResize);
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
    updateTransferFunction();
    init();
    // animate();
    // start();

    const container = containerRef.current;

    return () => {
      const { scene, mesh, renderer } = context.current;

      stop();
      window.removeEventListener('resize', onWindowResize);
      container.removeChild(renderer.domElement);
      // scene.remove(mesh);
    };
  }, []);

  // 当转换方程发生改变
  useEffect(() => {
    if (!context.current) return;
    const transferTexture = updateTransferFunction();
    const { materialSecondPass } = context.current;
    materialSecondPass.uniforms.transferTex.value = transferTexture;
  }, [colorSetting]);

  const ColorSettingCom = (index: number) => (
    <div style={{ marginBottom: '8px' }}>
      <div style={{ display: 'flex' }}>
        <span style={{ marginRight: '10px', lineHeight: '30px', width: '120px' }}>
          color{index}: {colorSetting[index].color}
        </span>
        <ColorPicker
          color={colorSetting[index].color}
          handleChange={(color) => {
            const _colorSetting = [...colorSetting];
            _colorSetting[index].color = color.hex;
            setColorSetting(_colorSetting);
          }}
        />
        <span
          style={{ marginRight: '10px', marginLeft: '10px', lineHeight: '30px', width: '120px' }}
        >
          stepPos{index}: {colorSetting[index].stepPos}
        </span>
        <Slider
          style={{ width: '100px', lineHeight: '30px' }}
          min={0}
          max={1}
          step={0.01}
          value={colorSetting[index].stepPos}
          onChange={(value) => {
            const _colorSetting = [...colorSetting];
            _colorSetting[index].stepPos = value;
            setColorSetting(_colorSetting);
          }}
        />
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <div>
          Steps: {steps}
          <Slider
            style={{ width: '360px' }}
            min={0}
            max={512}
            value={steps}
            onChange={(value) => {
              console.log('value', value);
              const { materialSecondPass } = context.current;
              materialSecondPass.uniforms.steps.value = value;
              setSteps(value);
            }}
          />
          AlphaCorrection: {alphaCorrection}
          <Slider
            style={{ width: '360px' }}
            min={0}
            max={5}
            step={0.01}
            value={alphaCorrection}
            onChange={(value) => {
              console.log('value', value);
              const { materialSecondPass } = context.current;
              materialSecondPass.uniforms.alphaCorrection.value = value;
              setAlphaCorrection(value);
            }}
          />
        </div>
        <div>
          {ColorSettingCom(0)}
          {ColorSettingCom(1)}
          {ColorSettingCom(2)}
        </div>
      </div>
      <div>
        <span style={{ display: 'block' }}>转换方程</span>
        <canvas ref={tfCanvas} width="256px" height="20px"></canvas>
      </div>
      <div style={{ height: '800px' }}>
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <div className={style.vis} ref={containerRef} />
        </div>
      </div>
    </div>
  );
});

const VolumeConnected: React.FC<any> = observer(() => {
  return <Demo store={ImageArray}></Demo>;
});

export default VolumeConnected;
