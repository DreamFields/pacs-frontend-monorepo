/*
 * @Author: linkenzone
 * @Date: 2021-07-20 15:39:47
 * @Descripttion: Do not edit
 */

import vtkFPSMonitor from '@kitware/vtk.js/Interaction/UI/FPSMonitor';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import { useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import Viewer3dStore from '../store/Viewer3dStore';

import { Spin } from 'antd';

type FpsMonitorProps = {
  style?: CSSProperties;
  store: any;
};

const FpsMonitor: React.FC<FpsMonitorProps> = observer((props) => {
  const { style, store } = props;
  const { renderWindow } = store;

  const [loading, setLoading] = useState(true);

  const fpsMonitorContainerRef = useRef(null);

  const render = () => {
    if (!renderWindow) return;
    console.log('renderWindow ', renderWindow);

    const fpsMonitor = vtkFPSMonitor.newInstance();
    const container = fpsMonitorContainerRef.current;

    const fpsElm = fpsMonitor.getFpsMonitorContainer();
    // fpsElm.classList.add(style.fpsMonitor);
    fpsMonitor.setRenderWindow(renderWindow);
    fpsMonitor.setContainer(container);
    setLoading(false);
    fpsMonitor.update();
  };

  useEffect(() => {
    render();
    const _container = fpsMonitorContainerRef.current;
    return () => {
      setLoading(true);
      // 清除上一次的渲染
      while (_container.firstChild) {
        _container.removeChild(_container.firstChild);
      }
    };
  }, [renderWindow]);

  return (
    <Spin spinning={loading}>
      <div style={style} ref={fpsMonitorContainerRef}></div>
    </Spin>
  );
});

FpsMonitor.defaultProps = {
  style: { width: '380px', height: '180px' },
};

const FpsMonitorConnected: React.FC<any> = observer((props) => {
  return <FpsMonitor store={Viewer3dStore} {...props}></FpsMonitor>;
});

export default FpsMonitorConnected;
