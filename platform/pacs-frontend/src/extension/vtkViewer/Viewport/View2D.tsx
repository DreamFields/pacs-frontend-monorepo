/*
 * @Author: linkenzone
 * @Date: 2021-06-30 10:56:34
 * @Descripttion: Do not edit
 */
import '@kitware/vtk.js/favicon';
import React, { useState, useEffect, useRef, useContext } from 'react';
import vtkWidgetManager from '@kitware/vtk.js/Widgets/Core/WidgetManager';
import { vtkViewContext } from '../context/vtkViewContext';
import { resize2DCameraToFit } from '../utils/resize2DCamera';

import { proxyManager } from '../config/proxyManager';
import { ANNOTATIONS, VIEW_ORIENTATIONS } from './constants';

const containerStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  backgroundColor: 'black',
  zIndex: 0,
};

const viewContainer: React.CSSProperties = {
  minWidth: '0',
  minHeight: '0',
  position: 'relative',
};

const ROTATION_STEP = 2;

type View2DProps = {
  viewType: string;
};

const View2D: React.FC<View2DProps> = (props) => {
  const { viewType } = props;
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

  const createView2D = () => {
    // 2d_x
    const container = vtkContainerRef.current;
    const view_2d = proxyManager.createProxy('Views', 'View2D');
    view_2d.setContainer(container);

    const { axis, orientation, viewUp } = VIEW_ORIENTATIONS[viewType];
    view_2d.updateOrientation(axis, orientation, viewUp);

    view_2d.setBackground(0, 0, 0, 0);
    view_2d.setPresetToOrientationAxes('default');

    if (!view_2d.getReferenceByName('widgetManager')) {
      const widgetManager = vtkWidgetManager.newInstance();
      // workaround for view not yet being mounted
      widgetManager.set({ useSvgLayer: false }, false, true);
      widgetManager.setRenderer(view_2d.getRenderer());
      widgetManager.setCaptureOn({ MOUSE_MOVE: 0, MOUSE_RELEASE: 1 });
      view_2d.set({ widgetManager }, true);

      widgetManager.setUseSvgLayer(true);
      if (!widgetManager.getPickingEnabled()) {
        widgetManager.disablePicking();
      }
    }

    view_2d.resize();

    context.current = {
      view: view_2d,
    };
  };

  const render = () => {
    if (context.current.view ?? false) {
      const { view } = context.current;

      const representations = proxyManager.getRepresentation(source, view);
      view.resize();
      view.setCornerAnnotations(ANNOTATIONS, true);

      const { extent, spacing } = source.getDataset().get();
      const extentWithSpacing = extent.map(
        (e: number, i: number) => e * spacing[Math.floor(i / 2)],
      );
      resize2DCameraToFit(view, 0, 1, extentWithSpacing);
      proxyManager.render(view);

      global.representations = representations;
    }
  };

  useEffect(() => {
    console.log('proxyManager');
    if (proxyManager !== null) {
      createView2D();
    }
  }, [proxyManager]);

  useEffect(() => {
    console.log('render');
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

export default View2D;
