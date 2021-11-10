/*
 * @Author: linkenzone
 * @Date: 2021-07-20 16:41:51
 * @Descripttion: Do not edit
 */
import type { CSSProperties } from 'react';
import { useState } from 'react';
import { useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import Viewer3dStore from '../store/Viewer3dStore';

import { Spin } from 'antd';

import vtkVolumeController from '@kitware/vtk.js/Interaction/UI/VolumeController';

type FpsMonitorProps = {
  style?: CSSProperties;
  store: any;
};

const VolumeController: React.FC<FpsMonitorProps> = observer((props) => {
  const { style, store } = props;
  const [loading, setLoading] = useState(true);

  const { renderWindow, actor, type } = store;

  const ContainerRef = useRef(null);

  const render = () => {
    if (!renderWindow && !actor) return;
    if (type !== 'volume') return;

    console.log('renderWindow ', renderWindow);
    console.log('actor ', actor);

    // Control UI
    const ControllerDom = ContainerRef.current;
    const controllerWidget = vtkVolumeController.newInstance({
      size: [400, 150],
      rescaleColorMap: true,
    });
    controllerWidget.setContainer(ControllerDom);
    controllerWidget.setupContent(renderWindow, actor, true);
    setLoading(false);
  };

  useEffect(() => {
    render();

    const _container = ContainerRef.current;

    return () => {
      setLoading(true);
      // 清除上一次的渲染
      while (_container.firstChild) {
        _container.removeChild(_container.firstChild);
      }
    };
  }, [renderWindow, actor, type]);

  return (
    <Spin spinning={loading}>
      <div style={style} ref={ContainerRef}></div>
    </Spin>
  );
});

VolumeController.defaultProps = {
  style: { width: '420px', height: '200px', position: 'relative' },
};

const VolumeControllerConnected: React.FC<any> = observer((props) => {
  return <VolumeController store={Viewer3dStore} {...props}></VolumeController>;
});

export default VolumeControllerConnected;
