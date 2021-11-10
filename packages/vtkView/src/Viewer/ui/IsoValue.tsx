/*
 * @Author: linkenzone
 * @Date: 2021-07-21 12:58:16
 * @Descripttion: Do not edit
 */
import type { CSSProperties } from 'react';
import { useState } from 'react';
import { useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import { Slider, InputNumber, Spin } from 'antd';

import Viewer3dStore from '../store/Viewer3dStore';

type IsoValueProps = {
  style?: CSSProperties;
  store: any;
};

const IsoValue: React.FC<IsoValueProps> = observer((props) => {
  const { style, store } = props;
  const { renderWindow, marchingCube, isoValue } = store;

  const [_isoValue, setIsoValue] = useState(0);

  const updateIsoValue = (e) => {
    setIsoValue(e);
    Viewer3dStore.changeIsoValue(e);

    marchingCube.setContourValue(e);
    renderWindow.render();
  };

  useEffect(() => {
    if (isoValue) {
      setIsoValue(isoValue);
    }
  }, [isoValue]);

  return (
    <>
      {renderWindow && marchingCube ? (
        <div style={style}>
          <span style={{ lineHeight: '32px', paddingRight: '8px', fontSize: '18px' }}>Iso: </span>
          <Slider
            style={{ width: '150px' }}
            min={0}
            max={1}
            onChange={updateIsoValue}
            value={typeof _isoValue === 'number' ? _isoValue : 0}
            step={0.01}
          />
          <InputNumber
            min={0}
            max={999}
            style={{ margin: '0 16px', width: '80px' }}
            step={0.01}
            value={typeof _isoValue === 'number' ? _isoValue : 0}
            onChange={updateIsoValue}
          />
        </div>
      ) : (
        <Spin>
          <div style={style}></div>
        </Spin>
      )}
    </>
  );
});

IsoValue.defaultProps = {
  style: { width: '320px', height: '32px', display: 'flex' },
};

const IsoValueConnected: React.FC<any> = observer((props) => {
  return <IsoValue store={Viewer3dStore} {...props}></IsoValue>;
});

export default IsoValueConnected;
