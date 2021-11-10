/*
 * @Author: linkenzone
 * @Date: 2021-06-30 18:32:18
 * @Descripttion: Do not edit
 */
import '@kitware/vtk.js/favicon';
import React, { useState, useEffect, useRef, useContext } from 'react';
import vtkWidgetManager from '@kitware/vtk.js/Widgets/Core/WidgetManager';
import { vtkViewContext } from '../context/vtkViewContext';
import { resize2DCameraToFit } from '../utils/resize2DCamera';

import { proxyManager } from '../config/proxyManager';
import { VIEW_ORIENTATIONS } from './constants';

const containerStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  backgroundColor: 'grey',
  zIndex: 0,
};

const viewContainer: React.CSSProperties = {
  minWidth: '0',
  minHeight: '0',
  position: 'relative',
};

const ROTATION_STEP = 2;

type View2DProps = {};

const View3D: React.FC<View2DProps> = (props) => {
  const vtkContainerRef = useRef(null);

  const { source }: any = useContext(vtkViewContext);

  const context = useRef<any | null>(null);

  const rollLeft = () => {
    if (context.current ?? false) {
      const { view } = context.current;
      view.setAnimation(true, null);

      let count = 0;
      let intervalId: any = null;

      const rotate = () => {
        if (count < 90) {
          count += ROTATION_STEP;
          view.rotate(+ROTATION_STEP);
        } else {
          clearInterval(intervalId);
          view.setAnimation(false, null);
        }
      };

      intervalId = setInterval(rotate, 1);
    }
  };

  const rollRight = () => {
    if (context.current ?? false) {
      const { view } = context.current;
      view.setAnimation(true, null);

      let count = 0;
      let intervalId: any = null;

      const rotate = () => {
        if (count < 90) {
          count += ROTATION_STEP;
          view.rotate(-ROTATION_STEP);
        } else {
          clearInterval(intervalId);
          view.setAnimation(false, null);
        }
      };

      intervalId = setInterval(rotate, 1);
    }
  };

  const resetCamera = () => {
    if (context.current.view ?? false) {
      const { view } = context.current;

      view.resetCamera();
      view.resetOrientation();

      const { extent, spacing } = source.getDataset().get();
      const extentWithSpacing = extent.map(
        (e: number, i: number) => e * spacing[Math.floor(i / 2)],
      );

      resize2DCameraToFit(view, 0, 1, extentWithSpacing);
    }
  };

  const createView3D = () => {
    const view_3d = proxyManager.createProxy('Views', 'ItkVtkView');

    const container = vtkContainerRef.current;

    view_3d.setContainer(container);

    view_3d.updateOrientation(1, -1, [0, 0, 1]);
    view_3d.setBackground(0, 0, 0, 0);
    view_3d.setPresetToOrientationAxes('default');

    if (!view_3d.getReferenceByName('widgetManager')) {
      const widgetManager = vtkWidgetManager.newInstance();
      // workaround for view not yet being mounted
      widgetManager.set({ useSvgLayer: false }, false, true);
      widgetManager.setRenderer(view_3d.getRenderer());
      widgetManager.setCaptureOn({ MOUSE_MOVE: 0, MOUSE_RELEASE: 1 });
      view_3d.set({ widgetManager }, true);

      widgetManager.setUseSvgLayer(true);
      // workaround to disable picking if previously disabled
      if (!widgetManager.getPickingEnabled()) {
        widgetManager.disablePicking();
      }
    }

    view_3d.resize();

    context.current = {
      view: view_3d,
    };
  };

  const render = () => {
    if (context.current.view ?? false) {
      const { view } = context.current;
      const imageRepresentation = proxyManager.getRepresentation(source, view);

      const dataArray = source.getDataset().getPointData().getScalars();

      const lookupTableProxy = proxyManager.getLookupTable(dataArray.getName());
      if (dataArray.getNumberOfComponents() > 1) {
        lookupTableProxy.setPresetName('Grayscale');
      } else {
        lookupTableProxy.setPresetName('Viridis (matplotlib)');
      }
      const piecewiseFunction = proxyManager.getPiecewiseFunction(dataArray.getName());

      const lut = lookupTableProxy.getLookupTable();
      const sliceActors = imageRepresentation.getActors();
      sliceActors.forEach((actor) => {
        actor.getProperty().setRGBTransferFunction(lut);
      });

      view.resize();
      proxyManager.render(view);
    }
  };

  useEffect(() => {
    console.log('proxyManager in 3d');
    if (proxyManager !== null) {
      createView3D();
    }
  }, [proxyManager]);

  useEffect(() => {
    console.log('render3D');
    if (source !== null) {
      render();
    }
  }, [source]);

  return (
    <div style={viewContainer}>
      <div
        style={{
          position: 'absolute',
          zIndex: 1,
          right: '8px',
          top: '8px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <button
          onClick={() => {
            rollLeft();
          }}
        >
          Left
        </button>

        <button
          onClick={() => {
            rollRight();
          }}
        >
          Right
        </button>

        <button
          onClick={() => {
            resetCamera();
          }}
        >
          reset
        </button>
      </div>

      <div ref={vtkContainerRef} style={containerStyle} />
    </div>
  );
};

export default View3D;
