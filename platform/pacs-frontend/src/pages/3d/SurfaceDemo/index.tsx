/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
/*
 * @Descripttion:
 * @Author: kid
 * @Date: 2021-04-20 16:52:29
 */

import '@kitware/vtk.js/favicon';

// Load the rendering pieces we want to use (for both WebGL and WebGPU)
import '@kitware/vtk.js/Rendering/Profiles/Geometry';

// Enable data soure for DataAccessHelper
// import 'vtk.js/Sources/IO/Core/DataAccessHelper/LiteHttpDataAccessHelper'; // Just need HTTP
// import 'vtk.js/Sources/IO/Core/DataAccessHelper/HttpDataAccessHelper'; // HTTP + zip
// import 'vtk.js/Sources/IO/Core/DataAccessHelper/HtmlDataAccessHelper'; // html + base64 + zip
// import 'vtk.js/Sources/IO/Core/DataAccessHelper/JSZipDataAccessHelper'; // zip

import vtkGenericRenderWindow from '@kitware/vtk.js/Rendering/Misc/GenericRenderWindow';

import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkHttpDataSetReader from '@kitware/vtk.js/IO/Core/HttpDataSetReader';
import vtkXMLImageDataReader from '@kitware/vtk.js/IO/XML/XMLImageDataReader';
// import HttpDataAccessHelper from '@kitware/vtk.js/IO/Core/DataAccessHelper/HttpDataAccessHelper';

import vtkImageMarchingCubes from '@kitware/vtk.js/Filters/General/ImageMarchingCubes';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';

import { useEffect, useRef, useState } from 'react';
import { Col, Divider, Row, Select, Slider, Space } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import { MoneyCollectOutlined } from '@ant-design/icons';

const Demo = () => {
  // 下拉框值定义
  // TODO：改为动态获取
  const selectOptions = [
    { label: 'ct_mouse', value: '/vti/ct_mouse.vti' },
    { label: 'mri_brain', value: '/vti/mri_brain.vti' },
    { label: 'pet_b320_attn', value: '/vti/pet_b320_attn.vti' },
    { label: 'pet_brain', value: '/vti/pet_brain.vti' },
    { label: 'pet_mouse', value: '/vti/pet_mouse.vti' },
    { label: 'pet_tongji_brain', value: '/vti/pet_tongji_brain.vti' },
  ];

  const vtkContainerRef: any = useRef(null);
  const context: any = useRef(null);

  // 拖动条的状态维护
  const [MCSliderState, setMCSliderState] = useState({
    min: 0,
    max: 1,
    step: 0.05,
    value: 0.5,
  });

  // 下拉框的状态维护
  const [MCSelectState, setMCSelectState] = useState({
    value: selectOptions[0].value,
  });

  // 加载数据并初始化渲染 mc，返回 Promise
  const initMarchingCube = (url: string) => {
    return new Promise((resolve, reject) => {
      const { reader, mc, actor, mapper, renderer, renderWindow } = context.current;
      context.current = {
        ...context.current,
        mc,
        reader,
      };
      // Vtk.js 数据流
      actor.setMapper(mapper);
      mapper.setInputConnection(mc.getOutputPort());
      mc.setInputConnection(reader.getOutputPort());
      reader.setUrl(url);
      // 异步拉数据
      reader
        .loadData()
        .then(() => {
          const data = reader.getOutputData();
          const dataRange = data.getPointData().getScalars().getRange();
          const firstIsoValue = Math.floor((dataRange[0] + dataRange[1]) / 3);
          // TODO: 这句耗时很高，可以异步优化，尽量不卡 UI
          mc.setContourValue(firstIsoValue);
          const data0 = dataRange[0];
          const data1 = dataRange[1];
          MCSliderState.min = data0;
          MCSliderState.max = data1;
          MCSliderState.step = Math.floor((data1 - data0) / 100);
          MCSliderState.value = firstIsoValue;
          setMCSliderState(MCSliderState);

          console.log('init MCSliderState:', MCSliderState);

          // 加载完数据后初始化渲染
          renderer.addActor(actor);
          renderer.getActiveCamera().set({ position: [1, 1, 0], viewUp: [0, 0, -1] });
          renderer.resetCamera();
          renderWindow.render();

          context.current = {
            ...context.current,
            renderWindow,
            renderer,
            mc,
            actor,
            mapper,
            reader,
          };
          resolve(`initMarchingCube: success`);
        })
        .catch((err: any) => {
          reject(new Error(`initMarchingCube: error\n ${err}`));
        });
    });
  };

  useEffect(() => {
    // 防御
    if (context.current) {
      return () => {};
    }
    // We use the wrapper here to abstract out manual RenderWindow/Renderer/OpenGLRenderWindow setup
    const genericRenderWindow = vtkGenericRenderWindow.newInstance();
    genericRenderWindow.setContainer(vtkContainerRef.current);
    genericRenderWindow.resize();
    const renderer = genericRenderWindow.getRenderer();
    const renderWindow = genericRenderWindow.getRenderWindow();

    // renderer camera to parallel projection
    renderer.getActiveCamera().setParallelProjection(true);

    const actor = vtkActor.newInstance();
    const mapper = vtkMapper.newInstance();
    const mc = vtkImageMarchingCubes.newInstance({
      contourValue: 0.0,
      computeNormals: true,
      mergePoints: true,
    });
    const reader = vtkXMLImageDataReader.newInstance();

    context.current = {
      ...context.current,
      genericRenderWindow,
      renderWindow,
      renderer,
      mc,
      actor,
      mapper,
      reader,
    };
    return () => {};
    // TODO: 这里有异步问题，提前delete会崩，但注释掉会有内存泄漏风险
    // return () => {
    //   if (!context.current) {
    //     return;
    //   }
    //   actor.delete();
    //   mapper.delete();
    //   mc.delete();
    //   genericRenderWindow.delete();
    //   renderWindow.delete();
    //   renderer.delete();
    //   context.current = null;
    // };
  }, [MCSliderState, initMarchingCube, vtkContainerRef]);

  useEffect(() => {
    if (!context.current) {
      return;
    }
    console.log('MCSliderState changed:', MCSliderState);
    const { mc, renderWindow } = context.current;
    const isoValue = MCSliderState.value;
    // TODO: 这句耗时很高，可以异步优化，尽量不卡 UI
    mc.setContourValue(isoValue);
    renderWindow.render();
  }, [MCSliderState]);

  useEffect(() => {
    if (!context.current) {
      return;
    }
    console.log('MCSelectState changed:', MCSelectState);
    initMarchingCube(MCSelectState.value)
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [MCSelectState]);

  return (
    <>
      <Row>
        <Col span={8}>
          <Paragraph>MarchingCube ISO value is {MCSliderState.value}</Paragraph>
          <Slider
            min={MCSliderState.min}
            max={MCSliderState.max}
            step={MCSliderState.step}
            value={MCSliderState.value}
            onChange={(SliderValue) => {
              setMCSliderState({
                ...MCSliderState,
                value: SliderValue,
              });
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col span={4}>
          <Select
            style={{ width: 120 }}
            options={selectOptions}
            value={MCSelectState.value}
            onChange={(SelectValue) => {
              setMCSelectState({
                ...MCSelectState,
                value: SelectValue,
              });
            }}
          ></Select>
        </Col>
      </Row>
      <Divider orientation="left" plain>
        工具区
      </Divider>
      <Row>
        <div style={{ width: '75vw', height: '75vh' }} ref={vtkContainerRef}></div>
      </Row>
    </>
  );
};

export default Demo;
