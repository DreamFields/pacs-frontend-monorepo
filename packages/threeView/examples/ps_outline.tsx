/*
 * @Author: linkenzone
 * @Date: 2021-07-22 20:42:59
 * @Descripttion: Do not edit
 */
import React, { useEffect, useRef } from 'react';
import { render } from 'react-dom';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';

// import { MTLLoader } from 'MTLLoader'
// import { OBJLoader } from 'OBJLoader'

const Demo: React.FC<unknown> = () => {
  const containerRef: any = useRef(null);
  const context: any = useRef(null);

  const init = () => {
    let selectedObjects = [];

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const container = containerRef.current;

    // 获取长和高
    const width = container.clientWidth;
    const height = container.clientHeight;

    console.log('width', width);
    console.log('height', height);

    const renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 5;
    controls.maxDistance = 20;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // light

    scene.add(new THREE.AmbientLight(0xaaaaaa, 0.2));

    const light = new THREE.DirectionalLight(0xddffdd, 0.6);
    light.position.set(1, 1, 1);
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;

    const d = 10;

    light.shadow.camera.left = -d;
    light.shadow.camera.right = d;
    light.shadow.camera.top = d;
    light.shadow.camera.bottom = -d;
    light.shadow.camera.far = 1000;

    scene.add(light);

    const group = new THREE.Group();

    // 设置模型

    const geometry = new THREE.SphereGeometry(3, 48, 24);

    for (let i = 0; i < 20; i++) {
      const material = new THREE.MeshLambertMaterial();
      material.color.setHSL(Math.random(), 1.0, 0.3);

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = Math.random() * 4 - 2;
      mesh.position.y = Math.random() * 4 - 2;
      mesh.position.z = Math.random() * 4 - 2;
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      mesh.scale.multiplyScalar(Math.random() * 0.3 + 0.1);
      group.add(mesh);
    }

    scene.add(group);

    // stats
    const stats = Stats();
    stats.dom.style.position = 'absolute';
    container.appendChild(stats.dom);

    // postprocessing

    const composer = new EffectComposer(renderer);

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const outlinePass = new OutlinePass(new THREE.Vector2(width, height), scene, camera);
    composer.addPass(outlinePass);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('textures/tri_pattern.jpg', (texture) => {
      console.log('texture', texture);
      outlinePass.patternTexture = texture;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
    });

    const effectFXAA = new ShaderPass(FXAAShader);
    effectFXAA.uniforms['resolution'].value.set(1 / width, 1 / height);
    composer.addPass(effectFXAA);

    renderer.domElement.style.touchAction = 'none';
    renderer.domElement.addEventListener('pointermove', onPointerMove);

    function onPointerMove(event) {
      if (event.isPrimary === false) return;

      mouse.x = (event.clientX / width) * 2 - 1;
      mouse.y = -(event.clientY / height) * 2 + 1;

      checkIntersection();
    }

    function addSelectedObject(object) {
      selectedObjects = [];
      selectedObjects.push(object);
    }

    function checkIntersection() {
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObject(scene, true);

      console.log('intersects.length', intersects.length);
      if (intersects.length > 0) {
        const selectedObject = intersects[0].object;
        addSelectedObject(selectedObject);
        outlinePass.selectedObjects = selectedObjects;
      } else {
        // outlinePass.selectedObjects = [];
      }
    }

    // 设置上下文
    context.current = { composer, controls, stats, outlinePass, group, scene, camera, renderer };
  };

  const renderGui = () => {
    const { outlinePass } = context.current;

    const params = {
      edgeStrength: 3.0,
      edgeGlow: 0.0,
      edgeThickness: 1.0,
      pulsePeriod: 0,
      rotate: false,
      usePatternTexture: false,

      visibleEdgeColor: '#ffffff',
      hiddenEdgeColor: '#190a05',
    };
    // Init gui
    const gui = new GUI({ width: 300 });
    gui.add(params, 'edgeStrength', 0.01, 10).onChange((value) => {
      outlinePass.edgeStrength = Number(value);
    });
    gui.add(params, 'edgeGlow', 0.0, 1).onChange((value) => {
      outlinePass.edgeGlow = Number(value);
    });
    gui.add(params, 'edgeThickness', 1, 4).onChange((value) => {
      outlinePass.edgeThickness = Number(value);
    });
    gui.add(params, 'pulsePeriod', 0.0, 5).onChange((value) => {
      outlinePass.pulsePeriod = Number(value);
    });
    gui.add(params, 'rotate');
    gui.add(params, 'usePatternTexture').onChange((value) => {
      outlinePass.usePatternTexture = value;
    });
    gui.addColor(params, 'visibleEdgeColor').onChange((value) => {
      outlinePass.visibleEdgeColor.set(value);
    });
    gui.addColor(params, 'hiddenEdgeColor').onChange((value) => {
      outlinePass.hiddenEdgeColor.set(value);
    });

    // 设置上下文
    context.current = { ...context.current, params };
  };

  const animate = () => {
    requestAnimationFrame(animate);
    const { composer, controls, stats, params, group } = context.current;
    stats.begin();
    const timer = performance.now();
    if (params.rotate) {
      group.rotation.y = timer * 0.0001;
    }
    controls.update();
    composer.render();
    stats.end();
  };

  useEffect(() => {
    init();
    renderGui();
    animate();

    return () => {};
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        style={{ width: '800px', height: '800px', position: 'relative' }}
      ></div>
    </>
  );
};

render(
  <div>
    111
    <Demo />
  </div>,
  document.getElementById('root'),
);
