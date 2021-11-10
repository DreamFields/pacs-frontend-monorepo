/*
 * @Author: linkenzone
 * @Date: 2021-06-19 23:43:28
 * @Descripttion: Do not edit
 */

// Load the rendering pieces we want to use (for both WebGL and WebGPU)
// import '@kitware/vtk.js/Rendering/Profiles/Volume';

// Force DataAccessHelper to have access to various data source
// import '@kitware/vtk.js/IO/Core/DataAccessHelper/HtmlDataAccessHelper';
import '@kitware/vtk.js/IO/Core/DataAccessHelper/HttpDataAccessHelper';
// import '@kitware/vtk.js/IO/Core/DataAccessHelper/JSZipDataAccessHelper';

import React, { useState, useEffect, useRef } from 'react';

import vtkGenericRenderWindow from '@kitware/vtk.js/Rendering/Misc/GenericRenderWindow';

import vtkHttpDataSetReader from '@kitware/vtk.js/IO/Core/HttpDataSetReader';

import vtkVolumeMapper from '@kitware/vtk.js/Rendering/Core/VolumeMapper';
import vtkVolume from '@kitware/vtk.js/Rendering/Core/Volume';

import vtkPiecewiseFunction from '@kitware/vtk.js/Common/DataModel/PiecewiseFunction';
import vtkPiecewiseGaussianWidget from '@kitware/vtk.js/Interaction/Widgets/PiecewiseGaussianWidget';

import vtkColorTransferFunction from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction';
import vtkColorMaps from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction/ColorMaps';

const BaseDemo: React.FC<unknown> = () => {
  const vtkContainerRef = useRef(null);

  useEffect(() => {
    const genericRenderWindow = vtkGenericRenderWindow.newInstance();
    genericRenderWindow.setContainer(vtkContainerRef.current);
    genericRenderWindow.resize();

    const renderWindow = genericRenderWindow.getRenderWindow();
    const renderer = genericRenderWindow.getRenderer();

    // pipeline
    const actor = vtkVolume.newInstance();
    const mapper = vtkVolumeMapper.newInstance();
    actor.setMapper(mapper);

    const reader = vtkHttpDataSetReader.newInstance({ fetchGzip: true });

    mapper.setInputConnection(reader.getOutputPort());

    // 透明度
    // Linear opacity function maps [0, 256] to [0, 1]
    const piecewiseFun = vtkPiecewiseFunction.newInstance();
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i <= 8; i++) {
      piecewiseFun.addPoint(i * 32, i / 8);
    }
    actor.getProperty().setScalarOpacity(0, piecewiseFun);

    // 色彩转换
    const lookupTable = vtkColorTransferFunction.newInstance();
    // 设置色彩转换的方法
    lookupTable.applyColorMap(vtkColorMaps.getPresetByName('Cool to Warm'));
    // 硬编码一个初始化的转换空间
    // 一般来说你会使用这个方法来获取区间
    // imageData.getPointData().getScalars().getRange()
    lookupTable.setMappingRange(0, 256);
    lookupTable.updateRange();

    // 设置 actor 属性
    actor.getProperty().setRGBTransferFunction(0, lookupTable);

    // 设置 ui
    const widget = vtkPiecewiseGaussianWidget.newInstance({
      numberOfBins: 256,
      size: [400, 150],
    });

    reader.setUrl('https://kitware.github.io/vtk-js/data/volume/LIDC2.vti').then(() => {
      reader.loadData().then(() => {
        renderer.addVolume(actor);

        renderer.resetCamera();
        renderWindow.render();
      });
    });
  }, []);

  return (
    <>
      <div ref={vtkContainerRef} style={{ height: '640px' }} />
    </>
  );
};

export default BaseDemo;
