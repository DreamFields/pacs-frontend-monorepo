/*
 * @Author: linkenzone
 * @Date: 2021-06-08 21:43:38
 * @Descripttion: Do not edit
 */

// import '@kitware/vtk.js/favicon';

// // Load the rendering pieces we want to use (for both WebGL and WebGPU)
// import '@kitware/vtk.js/Rendering/Profiles/Volume';

// // Force DataAccessHelper to have access to various data source
// import '@kitware/vtk.js/IO/Core/DataAccessHelper/HtmlDataAccessHelper';
// import '@kitware/vtk.js/IO/Core/DataAccessHelper/JSZipDataAccessHelper';

import axios from 'axios';
import axiosRetry from 'axios-retry';
// import files_path from './files';

import readImageDICOMFileSeries from 'itk/readImageDICOMFileSeries';
// import readImageFile from 'itk/readImageFile';

import React, { useState, useEffect } from 'react';

import vtkITKHelper from '@kitware/vtk.js/Common/DataModel/ITKHelper';
import vtkBoundingBox from '@kitware/vtk.js/Common/DataModel/BoundingBox';
import vtkURLExtract from '@kitware/vtk.js/Common/Core/URLExtract';
import vtkColorTransferFunction from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction';
import vtkPiecewiseFunction from '@kitware/vtk.js/Common/DataModel/PiecewiseFunction';
import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkVolume from '@kitware/vtk.js/Rendering/Core/Volume';
import vtkVolumeMapper from '@kitware/vtk.js/Rendering/Core/VolumeMapper';
import vtkDataArray from '@kitware/vtk.js/Common/Core/DataArray';
import vtkVolumeController from '@kitware/vtk.js/Interaction/UI/VolumeController';
import vtkFPSMonitor from '@kitware/vtk.js/Interaction/UI/FPSMonitor';

// import style from './index.css';

const { VtkDataTypes } = vtkDataArray;
const fpsMonitor = vtkFPSMonitor.newInstance();
const userParams = vtkURLExtract.extractURLParameters();

const BaseDemo: React.FC<unknown> = () => {
  // 待上传的文件列表
  const [fileList, setFileList] = useState<any[]>([]);

  const [_imageData, setImageData] = useState(null);

  const printImage = (image: any) => {
    function replacer(key: any, value: any) {
      if (!!value && value.byteLength !== undefined) {
        return `${String(value.slice(0, 6))}...`;
      }
      return value;
    }
    console.log(image);
    console.log(JSON.stringify(image, replacer, 4));
    // outputTextArea.textContent = JSON.stringify(image, replacer, 4);
  };

  const getImages = async (_fileList: any) => {
    const files_paths: string[] = [];

    axiosRetry(axios, {
      retries: 3, // number of retries
      retryDelay: (retryCount) => {
        console.log(`retry attempt: ${retryCount}`);
        return retryCount * 2000; // time interval between retries
      },
      // retryCondition: (error) => {
      //   // if retry condition is not specified, by default idempotent requests are retried
      //   return error.response.status === 503;
      // },
    });

    await axios
      .get('http://27.17.30.150:20083/series/b5981569-302c412a-6ced2c80-fd877f65-933991a4')
      .then((response) => {
        // console.log('response', response.data.Instances);
        const { Instances } = response.data;
        // eslint-disable-next-line guard-for-in
        for (const index in Instances) {
          files_paths.push(`http://27.17.30.150:20083/instances/${Instances[index]}/file`);
        }
      });

    const fetchFiles = files_paths.map((file_path, index) => {
      const path = file_path;
      return axios
        .get(path, { responseType: 'blob' })
        .then((response) => {
          const jsFile = new File([response.data], `${index}.dcm`); // `${index}.dcm` ` file_path.split('/').slice(-1)[0]`
          return jsFile;
        })
        .catch(() => {
          console.log('一个文件获取失败');
        });
    });

    Promise.all(fetchFiles).then((files: any) => {
      console.log('files', files);

      // readImageDICOMFileSeries
      readImageDICOMFileSeries(files).then(({ webWorker, image }: any) => {
        // webWorker.terminate();
        // printImage(image);
        image.name = files[0].name;
        console.log('image', image);
        const imageData = vtkITKHelper.convertItkToVtkImage(image);
        setImageData(imageData);
        console.log('imageData', imageData);

        const view3d = document.getElementById('view3d');
        const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
          rootContainer: view3d,
          containerStyle: {
            height: '100%',
            overflow: 'hidden',
          },
          background: [0, 0, 0],
        });
        const renderer = fullScreenRenderer.getRenderer();
        const renderWindow = fullScreenRenderer.getRenderWindow();
        renderWindow.getInteractor().setDesiredUpdateRate(15);

        const source = imageData;
        const mapper = vtkVolumeMapper.newInstance();
        const actor = vtkVolume.newInstance();

        const dataArray =
          source.getPointData().getScalars() || source.getPointData().getArrays()[0];
        const dataRange = dataArray.getRange();

        const lookupTable = vtkColorTransferFunction.newInstance();
        const piecewiseFunction = vtkPiecewiseFunction.newInstance();

        // Pipeline handling
        actor.setMapper(mapper);
        mapper.setInputData(source);
        renderer.addActor(actor);

        // Configuration
        const sampleDistance =
          0.7 *
          Math.sqrt(
            source
              .getSpacing()
              .map((v) => v * v)
              .reduce((a, b) => a + b, 0),
          );
        mapper.setSampleDistance(sampleDistance);
        actor.getProperty().setRGBTransferFunction(0, lookupTable);
        actor.getProperty().setScalarOpacity(0, piecewiseFunction);
        // actor.getProperty().setInterpolationTypeToFastLinear();
        actor.getProperty().setInterpolationTypeToLinear();

        // For better looking volume rendering
        // - distance in world coordinates a scalar opacity of 1.0
        actor
          .getProperty()
          .setScalarOpacityUnitDistance(
            0,
            vtkBoundingBox.getDiagonalLength(source.getBounds()) /
              Math.max(...source.getDimensions()),
          );
        // - control how we emphasize surface boundaries
        //  => max should be around the average gradient magnitude for the
        //     volume or maybe average plus one std dev of the gradient magnitude
        //     (adjusted for spacing, this is a world coordinate gradient, not a
        //     pixel gradient)
        //  => max hack: (dataRange[1] - dataRange[0]) * 0.05
        actor.getProperty().setGradientOpacityMinimumValue(0, 0);
        actor.getProperty().setGradientOpacityMaximumValue(0, (dataRange[1] - dataRange[0]) * 0.05);
        // - Use shading based on gradient
        actor.getProperty().setShade(true);
        actor.getProperty().setUseGradientOpacity(0, true);
        // - generic good default
        actor.getProperty().setGradientOpacityMinimumOpacity(0, 0.0);
        actor.getProperty().setGradientOpacityMaximumOpacity(0, 1.0);
        actor.getProperty().setAmbient(0.2);
        actor.getProperty().setDiffuse(0.7);
        actor.getProperty().setSpecular(0.3);
        actor.getProperty().setSpecularPower(8.0);

        // create color and opacity transfer functions
        // lookupTable.addRGBPoint(200.0, 0.4, 0.2, 0.0);
        // lookupTable.addRGBPoint(2000.0, 1.0, 1.0, 1.0);

        // piecewiseFunction.addPoint(200.0, 0.0);
        // piecewiseFunction.addPoint(1200.0, 0.5);
        // piecewiseFunction.addPoint(3000.0, 0.8);

        // actor.getProperty().setRGBTransferFunction(0, lookupTable);
        // actor.getProperty().setScalarOpacity(0, piecewiseFunction);

        // actor.getProperty().setScalarOpacityUnitDistance(0, 4.5);
        // actor.getProperty().setInterpolationTypeToLinear();
        // actor.getProperty().setUseGradientOpacity(0, 1);
        // actor.getProperty().setGradientOpacityMinimumValue(0, 15);
        // actor.getProperty().setGradientOpacityMinimumOpacity(0, 0.0);
        // actor.getProperty().setGradientOpacityMaximumValue(0, 100);
        // actor.getProperty().setGradientOpacityMaximumOpacity(0, 1.0);
        // actor.getProperty().setShade(1);
        // actor.getProperty().setAmbient(0.2);
        // actor.getProperty().setDiffuse(0.7);
        // actor.getProperty().setSpecular(0.3);
        // actor.getProperty().setSpecularPower(8.0);

        // Control UI
        const ControllerDom = document.getElementById('vtkVolumeController');
        const controllerWidget = vtkVolumeController.newInstance({
          size: [400, 150],
          rescaleColorMap: true,
        });
        controllerWidget.setContainer(ControllerDom);
        controllerWidget.setupContent(renderWindow, actor, true);

        fullScreenRenderer.setResizeCallback(({ width, height }) => {
          // 2px padding + 2x1px boder + 5px edge = 14
          if (width > 414) {
            controllerWidget.setSize(400, 150);
          } else {
            controllerWidget.setSize(width - 14, 150);
          }
          controllerWidget.render();
          fpsMonitor.update();
        });

        // First render
        renderer.resetCamera();
        renderWindow.render();

        const fpsElm = fpsMonitor.getFpsMonitorContainer();
        // fpsElm.classList.add(style.fpsMonitor);
        fpsMonitor.setRenderWindow(renderWindow);
        fpsMonitor.setContainer(view3d);
        fpsMonitor.update();
      });
    });
  };

  useEffect(() => {
    getImages();
  }, []);

  const array = [];
  while (array.length < 1000) {
    array.push(Math.random());
  }

  return (
    <>
      <div id="vtkVolumeController" style={{ position: 'absolute' }}></div>
      <div id="view3d"></div>
    </>
  );
};

export default BaseDemo;
