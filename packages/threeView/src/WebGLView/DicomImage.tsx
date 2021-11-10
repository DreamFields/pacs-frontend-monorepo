/* eslint-disable react-hooks/exhaustive-deps */

/*
 * @Author: linkenzone
 * @Date: 2021-10-28 15:27:06
 * @Descripttion: Do not edit
 */

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import { useFrame, useThree } from '@react-three/fiber';

import { Html } from '@react-three/drei';

// import { Uint16Material } from './materials/Uint16Material';

import styles from './style.less';

import RENDER_VERTEX_SHADER from './materials/shaders/Uint16.vert';
import RENDER_FRAGMENT_SHADER from './materials/shaders/Uint16.frag';
import * as THREE from 'three';

const DicomImage = forwardRef((props: any, _ref: any) => {
  const ref: any = useRef();

  const stringRef: any = useRef('_');

  const { uniforms, options, orientation } = props;

  const camera: any = useThree((state) => state.camera);
  const scene = useThree((state) => state.scene);
  const gl = useThree((state) => state.gl);

  // 必须要这样写，否则会无法重新渲染
  const args = useMemo(() => {
    return {
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
  }, [uniforms]);

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);

  // TODO 这里通过ref的方法将子组件的方法暴露给父组件使用
  // 这样做可能不太好，但是现在暂时先用着吧

  useImperativeHandle(_ref, () => ({
    reset() {
      console.log('camera', camera);
      console.log('scene', scene);
      console.log('gl', gl);
      console.log('ref', ref.current);

      // ref.current.scale.x += 0.1;
      // ref.current.scale.y += 0.1;
      // ref.current.scale.z += 0.1;

      camera.position.x = 0;
      camera.position.y = 0;
      camera.position.z = 50;

      camera.rotation.x = 0;
      camera.rotation.y = 0;
      camera.rotation.z = 0;

      // camera.updateProjectionMatrix();

      gl.render(scene, camera);
    },
  }));

  useFrame(({ clock }) => {
    // ref.current.material.uniforms.depth.value += 0.1;
    // if (uniforms) ref.current.material.uniforms.orientation.value = uniforms.orientation.value;

    ref.current.material.uniforms.depth.value = options.depth;

    ref.current.material.uniforms.ww.value = options.ww;
    ref.current.material.uniforms.wl.value = options.wl;
  });

  useEffect(() => {
    if (uniforms) {
      console.log('-----DicomImage-----');
      console.log('uniforms', uniforms);
      console.log('options', options);

      console.log('orientation', orientation);

      // TODO 这个地方的代码可以优化
      // 如果直接给uniforms赋值 object 的话，会无法重新渲染

      const { material } = ref.current;

      material.uniforms.diffuse.value = uniforms.diffuse.value;
      material.uniforms.depth.value = uniforms.depth.value;
      material.uniforms.size.value = uniforms.size.value;
      material.uniforms.ww.value = uniforms.ww.value;
      material.uniforms.wl.value = uniforms.wl.value;
      material.uniforms.rescaleSlope.value = uniforms.rescaleSlope.value;
      material.uniforms.rescaleIntercept.value = uniforms.rescaleIntercept.value;
      material.uniforms.numOfSlice.value = uniforms.numOfSlice.value;

      material.uniforms.orientation.value = uniforms.orientation.value;

      console.log('material.uniforms.orientation.value', material.uniforms.orientation.value);

      console.log('material', material);

      stringRef.current = orientation;

      console.log('stringRef.current', stringRef.current);
    }

    return () => {};
  }, [uniforms]);

  const onPointerDown = (event: ThreeEvent<PointerEvent>) => {
    console.log('event', event);
    // 世界坐标
    const point = event.point;

    const material = new THREE.LineBasicMaterial({
      color: 0x0000ff,
    });

    const points = [];
    points.push(new THREE.Vector3(-5, 0, 0));
    points.push(new THREE.Vector3(5, 0, 0));

    points.push(new THREE.Vector3(0, 5, 0));
    points.push(new THREE.Vector3(0, -5, 0));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const line = new THREE.Line(geometry, material);

    line.position.set(point.x, point.y, 0);

    line.renderOrder = 1;

    scene.add(line);
  };

  const onPointerMove = (event: ThreeEvent<PointerEvent>) => {
    // console.log('event', event);

    // 获取当前坐标

    // 世界坐标
    console.log('point', event.point);
  };

  return (
    <mesh
      ref={ref}
      scale={hovered ? 1.05 : 1}
      onPointerOver={(e) => {
        // console.log('e', e);
        // setHover(true);
      }}
      onPointerOut={(e) => setHover(false)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      position={[0, 0, 0]}
      renderOrder={0}
    >
      <planeGeometry args={[50, 50]} />
      <shaderMaterial attach="material" args={[args]} />
    </mesh>
  );
});

export default DicomImage;
