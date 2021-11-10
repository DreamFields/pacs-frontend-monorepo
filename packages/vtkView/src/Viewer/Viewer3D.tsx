/*
 * @Author: linkenzone
 * @Date: 2021-07-19 10:18:05
 * @Descripttion: Do not edit
 */
import type { CSSProperties } from 'react';
import { useRef } from 'react';
import React, { useState, useEffect } from 'react';
import vtkColorTransferFunction from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction';
import vtkPiecewiseFunction from '@kitware/vtk.js/Common/DataModel/PiecewiseFunction';
import vtkVolume from '@kitware/vtk.js/Rendering/Core/Volume';
import vtkVolumeMapper from '@kitware/vtk.js/Rendering/Core/VolumeMapper';
import vtkGenericRenderWindow from '@kitware/vtk.js/Rendering/Misc/GenericRenderWindow';
import vtkAxesActor from '@kitware/vtk.js/Rendering/Core/AxesActor';
import vtkOrientationMarkerWidget from '@kitware/vtk.js/Interaction/Widgets/OrientationMarkerWidget';
import vtkInteractiveOrientationWidget from '@kitware/vtk.js/Widgets/Widgets3D/InteractiveOrientationWidget';
import vtkWidgetManager from '@kitware/vtk.js/Widgets/Core/WidgetManager';

import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkImageMarchingCubes from '@kitware/vtk.js/Filters/General/ImageMarchingCubes';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';

import * as vtkMath from '@kitware/vtk.js/Common/Core/Math';
import { observer } from 'mobx-react';

import { Spin } from 'antd';

import { getImageDataFromServer } from './io/DicomLoader';
import Viewer3dStore from './store/Viewer3dStore';

import { useResizeDetector } from 'react-resize-detector';

import styles from './style.less';

type Viewer3dProps = {
  uuid?: string;
  style?: CSSProperties;
  store: any;
  type: 'contour' | 'volume';
};

const majorAxis = (vec3, idxA, idxB) => {
  const axis = [0, 0, 0];
  const idx = Math.abs(vec3[idxA]) > Math.abs(vec3[idxB]) ? idxA : idxB;
  const value = vec3[idx] > 0 ? 1 : -1;
  axis[idx] = value;
  return axis;
};

const Viewer3D: React.FC<Viewer3dProps> = observer((props) => {
  const { uuid, style, store, type } = props;
  const context = useRef<any | null>(null);
  const container = useRef<any | null>(null);

  const { width: containerWidth, height: containerHeight, ref: containerRef } = useResizeDetector();

  const [loading, setLoading] = useState(true);

  const changeDir = (direction: any) => {
    const { camera, orientationWidget, widgetManager, renderWindow, renderer } = context.current;
    const focalPoint = camera.getFocalPoint();
    const position = camera.getPosition();
    const viewUp = camera.getViewUp();

    const distance = Math.sqrt(vtkMath.distance2BetweenPoints(position, focalPoint));
    camera.setPosition(
      focalPoint[0] + direction[0] * distance,
      focalPoint[1] + direction[1] * distance,
      focalPoint[2] + direction[2] * distance,
    );

    if (direction[0]) {
      camera.setViewUp(majorAxis(viewUp, 1, 2));
    }
    if (direction[1]) {
      console.log('majorAxis(viewUp, 0, 2)', majorAxis(viewUp, 0, 2));
      camera.setViewUp([0, 0, 1]);
    }
    if (direction[2]) {
      camera.setViewUp(majorAxis(viewUp, 0, 1));
    }

    orientationWidget.updateMarkerOrientation();
    widgetManager.enablePicking();

    renderer.resetCamera();
    renderer.resetCameraClippingRange();
    renderWindow.render();
  };

  const render = async () => {
    const imageData = await getImageDataFromServer(uuid);

    const view3d = container.current;

    const genericRenderWindow = vtkGenericRenderWindow.newInstance();
    genericRenderWindow.setContainer(view3d);
    genericRenderWindow.resize();

    const renderer = genericRenderWindow.getRenderer();
    const renderWindow = genericRenderWindow.getRenderWindow();
    renderWindow.getInteractor().setDesiredUpdateRate(15);

    const source = imageData;
    const mapper = vtkVolumeMapper.newInstance();
    const actor = vtkVolume.newInstance();

    const dataArray = source.getPointData().getScalars() || source.getPointData().getArrays()[0];
    const dataRange = dataArray.getRange();

    const lookupTable = vtkColorTransferFunction.newInstance();
    const piecewiseFunction = vtkPiecewiseFunction.newInstance();

    // Pipeline handling
    actor.setMapper(mapper);
    mapper.setInputData(source);
    renderer.addActor(actor);

    const axes = vtkAxesActor.newInstance();
    const orientationWidget = vtkOrientationMarkerWidget.newInstance({
      actor: axes,
      interactor: renderWindow.getInteractor(),
    });
    orientationWidget.setEnabled(true);
    orientationWidget.setViewportCorner(vtkOrientationMarkerWidget.Corners.BOTTOM_LEFT);
    orientationWidget.setViewportSize(0.1);
    orientationWidget.setMinPixelSize(100);
    orientationWidget.setMaxPixelSize(300);

    // 获取摄像机
    const camera = renderer.getActiveCamera();

    // ----------------------------------------------------------------------------
    // Widget manager
    // ----------------------------------------------------------------------------
    const widgetManager = vtkWidgetManager.newInstance();
    widgetManager.setRenderer(orientationWidget.getRenderer());

    const widget = vtkInteractiveOrientationWidget.newInstance();
    widget.placeWidget(axes.getBounds());
    widget.setBounds(axes.getBounds());
    widget.setPlaceFactor(1);

    const vw = widgetManager.addWidget(widget);

    context.current = {
      genericRenderWindow,
      camera,
      orientationWidget,
      widgetManager,
      renderWindow,
      renderer,
    };

    // Manage user interaction
    vw.onOrientationChange(({ up, direction, action, event }) => {
      console.log('direction', direction);
      changeDir(direction);
    });

    // Configuration
    // const sampleDistance =
    //   0.7 *
    //   Math.sqrt(
    //     source
    //       .getSpacing()
    //       .map((v) => v * v)
    //       .reduce((a, b) => a + b, 0),
    //   );
    // mapper.setSampleDistance(sampleDistance);
    // actor.getProperty().setRGBTransferFunction(0, lookupTable);
    // actor.getProperty().setScalarOpacity(0, piecewiseFunction);
    // actor.getProperty().setInterpolationTypeToFastLinear();
    // actor.getProperty().setInterpolationTypeToLinear();

    // For better looking volume rendering
    // - distance in world coordinates a scalar opacity of 1.0
    // actor
    //   .getProperty()
    //   .setScalarOpacityUnitDistance(
    //     0,
    //     vtkBoundingBox.getDiagonalLength(source.getBounds()) / Math.max(...source.getDimensions()),
    //   );
    // - control how we emphasize surface boundaries
    //  => max should be around the average gradient magnitude for the
    //     volume or maybe average plus one std dev of the gradient magnitude
    //     (adjusted for spacing, this is a world coordinate gradient, not a
    //     pixel gradient)
    //  => max hack: (dataRange[1] - dataRange[0]) * 0.05
    // actor.getProperty().setGradientOpacityMinimumValue(0, 0);
    // actor.getProperty().setGradientOpacityMaximumValue(0, (dataRange[1] - dataRange[0]) * 0.05);
    // // - Use shading based on gradient
    // actor.getProperty().setShade(true);
    // actor.getProperty().setUseGradientOpacity(0, true);
    // - generic good default
    // actor.getProperty().setGradientOpacityMinimumOpacity(0, 0.0);
    // actor.getProperty().setGradientOpacityMaximumOpacity(0, 1.0);
    // actor.getProperty().setAmbient(0.2);
    // actor.getProperty().setDiffuse(0.7);
    // actor.getProperty().setSpecular(0.3);
    // actor.getProperty().setSpecularPower(8.0);

    // genericRenderWindow.setResizeCallback(({ width, height }) => {
    //   // 2px padding + 2x1px boder + 5px edge = 14
    //   if (width > 414) {
    //     controllerWidget.setSize(400, 150);
    //   } else {
    //     controllerWidget.setSize(width - 14, 150);
    //   }
    //   controllerWidget.render();
    //   fpsMonitor.update();
    // });

    // First render
    renderer.getActiveCamera().set({ position: [0, -1, 0], viewUp: [0, 0, 1] });
    renderer.resetCamera();
    renderer.resetCameraClippingRange();
    renderWindow.render();

    global.camera = camera;
    global.actor = actor;
    global.renderWindow = renderWindow;
    global.renderer = renderer;

    setLoading(false);

    // 改变数据流
    store.changeRenderData(actor, renderWindow);
    store.changeType('volume');
  };

  const renderContour = async () => {
    const imageData = await getImageDataFromServer(uuid);

    const view3d = container.current;

    const genericRenderWindow = vtkGenericRenderWindow.newInstance();
    genericRenderWindow.setContainer(view3d);
    genericRenderWindow.resize();

    const renderer = genericRenderWindow.getRenderer();
    const renderWindow = genericRenderWindow.getRenderWindow();
    renderWindow.getInteractor().setDesiredUpdateRate(15);

    const source = imageData;

    const actor = vtkActor.newInstance();
    const mapper = vtkMapper.newInstance();
    const marchingCube = vtkImageMarchingCubes.newInstance({
      contourValue: 0.0,
      computeNormals: true,
      mergePoints: true,
    });

    actor.setMapper(mapper);
    mapper.setInputConnection(marchingCube.getOutputPort());
    marchingCube.setInputData(source);

    const dataRange = source.getPointData().getScalars().getRange();
    const firstIsoValue = Number(((dataRange[0] + dataRange[1]) / 3).toFixed(2));

    marchingCube.setContourValue(firstIsoValue);
    renderer.addActor(actor);
    renderer.getActiveCamera().set({ position: [0, -1, 0], viewUp: [0, 0, 1] });
    renderer.resetCamera();
    renderWindow.render();

    const axes = vtkAxesActor.newInstance();
    const orientationWidget = vtkOrientationMarkerWidget.newInstance({
      actor: axes,
      interactor: renderWindow.getInteractor(),
    });
    orientationWidget.setEnabled(true);
    orientationWidget.setViewportCorner(vtkOrientationMarkerWidget.Corners.BOTTOM_LEFT);
    orientationWidget.setViewportSize(0.1);
    orientationWidget.setMinPixelSize(100);
    orientationWidget.setMaxPixelSize(300);

    // 获取摄像机
    const camera = renderer.getActiveCamera();

    global.camera = camera;

    // ----------------------------------------------------------------------------
    // Widget manager
    // ----------------------------------------------------------------------------
    const widgetManager = vtkWidgetManager.newInstance();
    widgetManager.setRenderer(orientationWidget.getRenderer());

    const widget = vtkInteractiveOrientationWidget.newInstance();
    widget.placeWidget(axes.getBounds());
    widget.setBounds(axes.getBounds());
    widget.setPlaceFactor(1);

    const vw = widgetManager.addWidget(widget);
    // Manage user interaction
    vw.onOrientationChange(({ up, direction, action, event }) => {
      console.log('direction', direction);
      changeDir(direction);
    });

    setLoading(false);

    context.current = {
      genericRenderWindow,
      camera,
      orientationWidget,
      widgetManager,
      renderWindow,
      renderer,
    };

    console.log('firstIsoValue', firstIsoValue);

    // 改变数据流
    store.changeRenderData(actor, renderWindow);
    store.changeMarchingCube(marchingCube);
    store.changeIsoValue(firstIsoValue);
    store.changeType('contour');
  };

  useEffect(() => {
    setLoading(true);

    console.log('执行渲染');

    if (uuid ?? false) {
      if (type === 'contour') {
        renderContour();
      } else {
        render();
      }
    }

    const _container = container.current;

    return () => {
      console.log('清除数据');

      // 改变数据流
      store.changeRenderData(null, null);
      store.changeMarchingCube(null);
      store.changeIsoValue(null);
      // 清除上一次的渲染
      while (_container.firstChild) {
        _container.removeChild(_container.firstChild);
      }
    };
  }, [type, uuid]);

  useEffect(() => {
    if (context.current) {
      const { genericRenderWindow } = context.current;
      if (genericRenderWindow) {
        genericRenderWindow.resize();
      }
    }
  }, [containerHeight, containerWidth]);

  const finalStyle = {
    ...style,
    width: containerWidth,
    height: containerHeight,
  };

  return (
    // <Spin spinning={loading} size="large" tip="DICOM 文件读取中...">
    //   <div ref={container} style={style}></div>
    // </Spin>
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <Spin
        spinning={loading}
        size="large"
        tip="DICOM 文件读取中..."
        wrapperClassName={styles.custom_spin}
      >
        <div ref={container} style={finalStyle}></div>
      </Spin>
    </div>
  );
});

Viewer3D.defaultProps = {
  style: { height: '640px' },
};

type Viewer3DConnectedProps = {
  uuid: string;
  style?: CSSProperties;
  type: 'contour' | 'volume';
};

const Viewer3DConnected: React.FC<Viewer3DConnectedProps> = observer((props) => {
  return (
    <Viewer3D
      store={Viewer3dStore}
      {...props}
      // uuid={props.uuid}
      // style={props.style}
      // type={props.type}
    ></Viewer3D>
  );
});

export default Viewer3DConnected;
