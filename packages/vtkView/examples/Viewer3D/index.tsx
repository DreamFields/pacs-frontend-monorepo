/*
 * @Author: linkenzone
 * @Date: 2021-07-20 13:53:35
 * @Descripttion: Do not edit
 */
import Viewer3D from '../../src/Viewer/Viewer3D';
import FpsMonitor from '../../src/Viewer/ui/FpsMonitor';
import VolumeController from '../../src/Viewer/ui/VolumeController';
import IsoValue from '../../src/Viewer/ui/IsoValue';
import { Button } from 'antd';
import { useState } from 'react';

// 有 ww 和 WL 的数据: b5981569-302c412a-6ced2c80-fd877f65-933991a4
// 6c1df2fa-9ccb6202-68731ddc-b0e7ab52-d1a1e9e5
// 1c45fb55-795f38d0-b9e4abd2-1d1fbc32-50a17af1
// 没有 ww 和 WL 的数据: 8619bc02-9c96e795-d7830b47-cb01a5df-d581b379

const Demo: React.FC<any> = (props) => {
  const [type, setType] = useState('contour');

  return (
    <>
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
            <div style={{ width: '50%', height: '600px' }}>
              <Viewer3D
                uuid="b5981569-302c412a-6ced2c80-fd877f65-933991a4"
                style={{ width: '100%', height: '100%' }}
                type="contour"
              />
            </div>

            <div>
              <FpsMonitor
                style={{ width: '300px', height: '150px', margin: '0', backgroundColor: 'red' }}
              />
              <IsoValue />
            </div>
          </>
        ) : (
          <>
            <div style={{ width: '50%', height: '600px' }}>
              <Viewer3D
                uuid="b5981569-302c412a-6ced2c80-fd877f65-933991a4"
                style={{ width: '100%', height: '100%' }}
                type="volume"
              />
            </div>

            <div>
              <FpsMonitor
                style={{ width: '300px', height: '150px', margin: '0', backgroundColor: 'red' }}
              />
              <VolumeController />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Demo;
