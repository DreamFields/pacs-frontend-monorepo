/*
 * @Author: linkenzone
 * @Date: 2021-07-19 10:56:12
 * @Descripttion: Do not edit
 */
import { Viewer3D, FpsMonitorUi, VolumeControllerUi, IsoValueUi } from 'rayplus-vtkview';

import { Button, InputNumber, Spin } from 'antd';
import { useState } from 'react';

// 有 ww 和 WL 的数据: b5981569-302c412a-6ced2c80-fd877f65-933991a4
// 6c1df2fa-9ccb6202-68731ddc-b0e7ab52-d1a1e9e5
// 1c45fb55-795f38d0-b9e4abd2-1d1fbc32-50a17af1
// 没有 ww 和 WL 的数据: 8619bc02-9c96e795-d7830b47-cb01a5df-d581b379

// 测试数据2 c6f47218-346f1920-f2fa54ea-34b5459a-3f0b9aca (无法解析的数据？)

const Demo: React.FC<any> = (props) => {
  const [type, setType] = useState('volume');

  return (
    <div style={{ padding: '12px', maxHeight: '800px' }}>
      <Button
        onClick={() => {
          setType('contour');
        }}
      >
        contour
      </Button>
      <Button
        onClick={() => {
          setType('volume');
        }}
      >
        volume
      </Button>

      <div style={{ display: 'flex' }}>
        {type === 'contour' ? (
          <>
            <div style={{ width: '50%', height: '500px' }}>
              <Viewer3D
                uuid="c6f47218-346f1920-f2fa54ea-34b5459a-3f0b9aca"
                style={{ width: '100%', height: '100%' }}
                type="contour"
              />
            </div>

            <div>
              <FpsMonitorUi />
              <IsoValueUi />
            </div>
          </>
        ) : (
          <>
            <div style={{ width: '50%', height: '500px' }}>
              <Viewer3D
                uuid="c6f47218-346f1920-f2fa54ea-34b5459a-3f0b9aca"
                style={{ width: '100%', height: '100%' }}
                type="volume"
              />
            </div>

            <div>
              <FpsMonitorUi />
              <VolumeControllerUi />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Demo;
