/*
 * @Author: linkenzone
 * @Date: 2021-06-28 14:23:17
 * @Descripttion: Do not edit
 */

import '@kitware/vtk.js/favicon';

import axios from 'axios';
import readImageDICOMFileSeries from 'itk/readImageDICOMFileSeries';

import React, { useState, useEffect, useRef } from 'react';

import vtkITKHelper from '@kitware/vtk.js/Common/DataModel/ITKHelper';
import vtkProxyManager from '@kitware/vtk.js/Proxy/Core/ProxyManager';
import proxyConfiguration from './proxyManagerConfiguration';

import vtkWidgetManager from '@kitware/vtk.js/Widgets/Core/WidgetManager';

import { getDicomSeriesImageData } from '@/extension/vtkViewer';

const URL_PER = 'http://27.17.30.150:20083';

function resize2DCameraToFit(view, lookAxis, viewUpAxis, bounds) {
  const camera = view.getCamera();
  const lengths = [bounds[1] - bounds[0], bounds[3] - bounds[2], bounds[5] - bounds[4]];
  const [w, h] = view.getOpenglRenderWindow().getSize();
  let bw;
  let bh;
  /* eslint-disable prefer-destructuring */
  if (lookAxis === 0 && viewUpAxis === 1) {
    bw = lengths[2];
    bh = lengths[1];
  } else if (lookAxis === 0 && viewUpAxis === 2) {
    bw = lengths[1];
    bh = lengths[2];
  } else if (lookAxis === 1 && viewUpAxis === 0) {
    bw = lengths[2];
    bh = lengths[0];
  } else if (lookAxis === 1 && viewUpAxis === 2) {
    bw = lengths[0];
    bh = lengths[2];
  } else if (lookAxis === 2 && viewUpAxis === 0) {
    bw = lengths[1];
    bh = lengths[0];
  } else if (lookAxis === 2 && viewUpAxis === 1) {
    bw = lengths[0];
    bh = lengths[1];
  }
  /* eslint-enable prefer-destructuring */
  const viewAspect = w / h;
  const boundsAspect = bw / bh;
  let scale = 0;
  if (viewAspect >= boundsAspect) {
    scale = bh / 2;
  } else {
    scale = bw / 2 / viewAspect;
  }
  camera.setParallelScale(scale);
}

const BaseDemo: React.FC<unknown> = () => {
  const vtkContainerRef_3D = useRef(null);

  const vtkContainerRef_X = useRef(null);
  const vtkContainerRef_Y = useRef(null);
  const vtkContainerRef_Z = useRef(null);

  const getImages = async (id: string) => {
    const imageData = await getDicomSeriesImageData(id);

    const proxyManager = vtkProxyManager.newInstance({ proxyConfiguration });
    window.addEventListener('resize', proxyManager.resizeAllViews);

    const container = vtkContainerRef_3D.current;

    const view = proxyManager.createProxy('Views', 'ItkVtkView');

    view.setContainer(container);
    view.updateOrientation(1, -1, [0, 0, 1]);
    view.setBackground(0, 0, 0, 0);
    view.setPresetToOrientationAxes('default');

    if (!view.getReferenceByName('widgetManager')) {
      const widgetManager = vtkWidgetManager.newInstance();
      // workaround for view not yet being mounted
      widgetManager.set({ useSvgLayer: false }, false, true);
      widgetManager.setRenderer(view.getRenderer());
      widgetManager.setCaptureOn({ MOUSE_MOVE: 0, MOUSE_RELEASE: 1 });
      view.set({ widgetManager }, true);

      widgetManager.setUseSvgLayer(true);
      // workaround to disable picking if previously disabled
      if (!widgetManager.getPickingEnabled()) {
        widgetManager.disablePicking();
      }
    }

    // 2d_x
    const container_x = vtkContainerRef_X.current;
    const view_2d_x = proxyManager.createProxy('Views', 'View2D');
    view_2d_x.setContainer(container_x);
    view_2d_x.updateOrientation(0, 1, [0, 0, 1]);
    view_2d_x.setBackground(0, 0, 0, 0);
    view_2d_x.setPresetToOrientationAxes('default');

    if (!view_2d_x.getReferenceByName('widgetManager')) {
      const widgetManager = vtkWidgetManager.newInstance();
      // workaround for view not yet being mounted
      widgetManager.set({ useSvgLayer: false }, false, true);
      widgetManager.setRenderer(view_2d_x.getRenderer());
      widgetManager.setCaptureOn({ MOUSE_MOVE: 0, MOUSE_RELEASE: 1 });
      view_2d_x.set({ widgetManager }, true);

      widgetManager.setUseSvgLayer(true);
      if (!widgetManager.getPickingEnabled()) {
        widgetManager.disablePicking();
      }
    }

    // 2d_y
    const container_y = vtkContainerRef_Y.current;
    const view_2d_y = proxyManager.createProxy('Views', 'View2D');
    view_2d_y.setContainer(container_y);
    view_2d_y.updateOrientation(1, -1, [0, 0, 1]);
    view_2d_y.setBackground(0, 0, 0, 0);
    view_2d_y.setPresetToOrientationAxes('default');

    if (!view_2d_y.getReferenceByName('widgetManager')) {
      const widgetManager = vtkWidgetManager.newInstance();
      // workaround for view not yet being mounted
      widgetManager.set({ useSvgLayer: false }, false, true);
      widgetManager.setRenderer(view_2d_y.getRenderer());
      widgetManager.setCaptureOn({ MOUSE_MOVE: 0, MOUSE_RELEASE: 1 });
      view_2d_y.set({ widgetManager }, true);

      widgetManager.setUseSvgLayer(true);
      if (!widgetManager.getPickingEnabled()) {
        widgetManager.disablePicking();
      }
    }

    // 2d_z
    const container_z = vtkContainerRef_Z.current;
    const view_2d_z = proxyManager.createProxy('Views', 'View2D');
    view_2d_z.setContainer(container_z);
    view_2d_z.updateOrientation(2, -1, [0, -1, 0]);
    view_2d_z.setBackground(0, 0, 0, 0);
    view_2d_z.setPresetToOrientationAxes('default');

    // view_2d_z.focusTo();

    console.log('view_2d_z:', view_2d_z.getRenderer());
    const renderer = view_2d_z.getRenderer();
    const camera = view_2d_z.getCamera();

    global.camera = camera;
    global.renderer = renderer;
    global.view_2d_z = view_2d_z;
    global.imageData = imageData;

    if (!view_2d_z.getReferenceByName('widgetManager')) {
      const widgetManager = vtkWidgetManager.newInstance();
      // workaround for view not yet being mounted
      widgetManager.set({ useSvgLayer: false }, false, true);
      widgetManager.setRenderer(view_2d_z.getRenderer());
      widgetManager.setCaptureOn({ MOUSE_MOVE: 0, MOUSE_RELEASE: 1 });
      view_2d_z.set({ widgetManager }, true);

      widgetManager.setUseSvgLayer(true);
      if (!widgetManager.getPickingEnabled()) {
        widgetManager.disablePicking();
      }
    }

    const imageSource = proxyManager.createProxy('Sources', 'TrivialProducer', {
      name: 'Image',
    });
    imageSource.setInputData(imageData);

    proxyManager.createRepresentationInAllViews(imageSource);
    const imageRepresentation = proxyManager.getRepresentation(imageSource, view);

    const dataArray = imageData.getPointData().getScalars();

    console.log('dataArray.getName()', dataArray.getName());

    const lookupTableProxy = proxyManager.getLookupTable(dataArray.getName());
    if (dataArray.getNumberOfComponents() > 1) {
      lookupTableProxy.setPresetName('Grayscale');
    } else {
      lookupTableProxy.setPresetName('Viridis (matplotlib)');
    }
    const piecewiseFunction = proxyManager.getPiecewiseFunction(dataArray.getName());

    // Slices share the same lookup table as the volume rendering.
    const lut = lookupTableProxy.getLookupTable();
    const sliceActors = imageRepresentation.getActors();
    sliceActors.forEach((actor) => {
      actor.getProperty().setRGBTransferFunction(lut);
    });

    // view.setViewMode('Volume');

    proxyManager.resizeAllViews();

    const { extent, spacing } = imageData.get();
    const extentWithSpacing = extent.map((e, i) => e * spacing[Math.floor(i / 2)]);
    resize2DCameraToFit(view_2d_x, 0, 1, extentWithSpacing);
    resize2DCameraToFit(view_2d_y, 1, 0, extentWithSpacing);
    resize2DCameraToFit(view_2d_z, 2, 1, extentWithSpacing);

    proxyManager.renderAllViews();
  };

  useEffect(() => {
    getImages('bfd34afd-f97a9f7c-c0551428-93a0c48a-0285c8ce');
  }, []);

  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  };

  const viewContainer: React.CSSProperties = {
    minWidth: '0',
    minHeight: '0',
  };

  return (
    <div
      style={{
        height: '90vh',
        display: 'grid',
        gridColumnGap: '2px',
        gridRowGap: '2px',
        gridTemplateRows: '1fr 1fr',
        gridTemplateColumns: '1fr 1fr',
      }}
    >
      <div style={viewContainer}>
        <div ref={vtkContainerRef_X} style={containerStyle} />
      </div>

      <div style={viewContainer}>
        <div ref={vtkContainerRef_3D} style={containerStyle} />
      </div>

      <div style={viewContainer}>
        <div ref={vtkContainerRef_Y} style={containerStyle} />
      </div>

      <div style={viewContainer}>
        <div ref={vtkContainerRef_Z} style={containerStyle} />
      </div>
    </div>
  );
};

export default BaseDemo;
