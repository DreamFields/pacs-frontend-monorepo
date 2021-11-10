/* eslint-disable react-hooks/exhaustive-deps */
/*
 * @Author: linkenzone
 * @Date: 2021-10-25 10:18:50
 * @Descripttion:
 * 2D 影像渲染
 */

// React.Suspense 可以指定加载指示器（loading indicator），以防其组件树中的某些子组件尚未具备渲染条件。
// url: https://zh-hans.reactjs.org/docs/react-api.html#reactsuspense
import React, {
  forwardRef,
  Suspense,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { observer } from 'mobx-react';

import ImageArray from '../store/ImageArray';
import * as THREE from 'three';

import storedPixelDataToImageData from './util/storedPixelDataToImageData';
import {
  MapControls,
  Stats,
  OrbitControls,
  Html,
  PerspectiveCamera,
  Text,
} from '@react-three/drei';
import { Button } from 'antd';
import { Leva, useControls } from 'leva';

import DicomImage from './DicomImage';

import View2dList from './store/ViewList';

import styles from './style.less';

const LARGE_NUMBER = 1073741823;

type View2DProps = {
  orientation: 'Axial' | 'Coronal' | 'Sagittal';
};

const View2D: React.FC<View2DProps> = observer((props) => {
  const store = ImageArray;

  const { ViewList } = View2dList;

  const containerRef: any = useRef();
  const DicomImageRef: any = useRef();
  const orbitRef: any = useRef();

  // 创建一个上下文
  const context: any = useRef({});

  const { orientation } = props;

  const { loading } = store;

  const [uniforms, setUniforms] = useState(undefined);

  let numOfSlice = 0;

  // 当前窗口的类型发生改变
  useEffect(() => {
    console.log('当前窗口类型:', orientation);
    // 获取当前窗口
    context.current.View = ViewList[orientation];

    console.log('context.current', context.current);
  }, [orientation]);

  const [options, setOptions] = useControls(() => {
    console.log('useControls');
    return {
      depth: { value: 0, min: 0, max: uniforms ? uniforms.numOfSlice.value : 0, step: 1 },
      type: { options: { z: 0, x: 1, y: 2 } },
      ww: {
        value: uniforms ? uniforms.ww.value : 1,
        min: 1,
        max: uniforms ? uniforms.maxVal.value : 1,
        step: 1,
      },
      wl: {
        value: uniforms ? uniforms.wl.value : 1,
        min: -32768,
        max: uniforms ? uniforms.maxVal.value : 0,
        step: 1,
      },
    };
  }, [uniforms]);

  useEffect(() => {
    console.log('useEffect uniforms', uniforms);
    if (uniforms) {
      setOptions({
        ww: uniforms.ww.value,
        wl: uniforms.wl.value,
      });
    }
    return () => {};
  }, [uniforms]);

  // 初始化图像
  const init = () => {
    // 从数据流获取数据
    const { dataArray, rescaleSlope, rescaleIntercept, boxSize, WW, WL, xDim, yDim, zDim } = store;
    if (!dataArray) return;
    console.log('dataArray', dataArray);

    // 获取最大和最小值
    let maxVal = -LARGE_NUMBER;
    let minVal = +LARGE_NUMBER;
    for (let i = 0; i < dataArray.length; i++) {
      const valData = dataArray[i];
      minVal = valData < minVal ? valData : minVal;
      maxVal = valData > maxVal ? valData : maxVal;
    }
    maxVal = maxVal - minVal > 0 ? maxVal : maxVal + 1;
    console.log('maxVal', maxVal);
    console.log('minVal', minVal);

    // 先对 uint16 的数据进行打包，变成 uint8 的数据
    const imageData = storedPixelDataToImageData(dataArray, xDim, yDim, zDim);
    // 将每个元素同时作为亮度分量和Alpha分量来读取。
    const texture = new THREE.DataTexture3D(imageData, xDim, yDim, zDim);
    texture.format = THREE.LuminanceAlphaFormat;
    texture.type = THREE.UnsignedByteType;

    const type = 0;

    if (type == 0) {
      numOfSlice = zDim;
    } else if (type == 1) {
      numOfSlice = xDim;
    } else {
      numOfSlice = yDim;
    }

    setUniforms({
      diffuse: { value: texture },
      depth: { value: 0 },
      size: { value: new THREE.Vector2(50, 50) },
      ww: { value: WW },
      wl: { value: WL },
      rescaleSlope: { value: rescaleSlope },
      rescaleIntercept: { value: rescaleIntercept },

      orientation: { value: context.current.View.orientation },

      numOfSlice: { value: numOfSlice },

      maxVal: { value: maxVal },
      minVal: { value: minVal },
    });
  };

  // 重置当前图像
  const reset = () => {
    console.log('重置图像位置...');

    // console.log('camera', camera);
    // console.log('viewport', viewport);
    // console.log('scene', scene);

    if (DicomImageRef.current) {
      DicomImageRef.current.reset();

      orbitRef.current.reset();
    }
  };

  useEffect(() => {
    // 设置
    if (orbitRef.current) {
      orbitRef.current.enableRotate = false;

      orbitRef.current.mouseButtons = {
        LEFT: THREE.MOUSE.PAN,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.ROTATE,
      };
    }
  }, [orbitRef.current]);

  useEffect(() => {
    if (loading === false) {
      init();
    }
    return () => {};
  }, [loading]);

  return (
    <div style={{ position: 'relative' }} ref={containerRef}>
      <Button
        style={{ position: 'absolute', zIndex: 1, fontSize: '8px', padding: '4px', right: '8px' }}
        onClick={() => {
          reset();
        }}
      >
        重置
      </Button>
      <Canvas
      // orthographic
      // camera={{
      //   position: [0, 0, 1],
      //   left: 100,
      //   right: 100,
      //   top: 100,
      //   bottom: 100,
      //   zoom: 1,
      //   up: [0, 0, 1],
      //   far: 1000,
      // }}

      // camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 0, 50] }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={[0, 0.3, 0.5]} />

          <Text
            color="white"
            anchorX="center"
            anchorY="middle"
            fontSize={5}
            textAlign={'left'}
            position={[0, 30, 0]}
          >
            ruler 1 ------
          </Text>

          <Text
            color="white"
            anchorX="center"
            anchorY="middle"
            fontSize={5}
            textAlign={'left'}
            position={[0, -30, 0]}
          >
            ruler 2 ------
          </Text>

          <DicomImage
            uniforms={uniforms}
            options={options}
            ref={DicomImageRef}
            orientation={orientation}
          />

          <PerspectiveCamera
            makeDefault // Registers it as the default camera system-wide (default=false)
            fov={75}
            near={0.1}
            far={1000}
            position={[0, 0, 50]}
          />

          <Html style={{ pointerEvents: 'none' }} fullscreen>
            <div style={{ color: 'white', position: 'absolute', top: '50%', left: '0' }}>
              DICOM 影像
            </div>
          </Html>

          <OrbitControls ref={orbitRef} />
          <Stats parent={containerRef} className={styles.stats} />
        </Suspense>
      </Canvas>
    </div>
  );
});

export default View2D;
