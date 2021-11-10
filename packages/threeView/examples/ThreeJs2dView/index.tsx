/*
 * @Author: linkenzone
 * @Date: 2021-10-08 14:20:30
 * @Descripttion: Do not edit
 */
// 有 ww 和 WL 的数据: b5981569-302c412a-6ced2c80-fd877f65-933991a4
// 6c1df2fa-9ccb6202-68731ddc-b0e7ab52-d1a1e9e5
// 1c45fb55-795f38d0-b9e4abd2-1d1fbc32-50a17af1
// 没有 ww 和 WL 的数据: 8619bc02-9c96e795-d7830b47-cb01a5df-d581b379

// b5981569-302c412a-6ced2c80-fd877f65-933991a4
// bfd34afd-f97a9f7c-c0551428-93a0c48a-0285c8ce

// 大数据
// d423f22c-33405061-8507ee8f-c313d5fc-ba887144

import { ImageLoader } from '../../src';

import View2D from './view2d';

const Demo: React.FC<any> = (props) => {
  return (
    <>
      <ImageLoader uuid="6c1df2fa-9ccb6202-68731ddc-b0e7ab52-d1a1e9e5" />
      <h1>threejs 2D View</h1>

      <div style={{ display: 'flex', height: '90vh' }}>
        <div style={{ width: '300px', height: '100%', backgroundColor: '#4a4a4a' }}>
          <div style={{ width: '300px', backgroundColor: 'white' }} />
        </div>

        <div style={{ width: '100%', height: '100%', backgroundColor: '#313131' }}>
          <div
            style={{
              width: '100%',
              height: '90vh',
              display: 'grid',
              gridColumnGap: '2px',
              gridRowGap: '2px',
              gridTemplateRows: '1fr 1fr',
              gridTemplateColumns: '1fr 1fr',
            }}
          >
            <div style={{ minHeight: 0, minWidth: 0, border: '1px solid black' }}>
              <View2D type={0} />
            </div>

            <div style={{ minHeight: 0, minWidth: 0, border: '1px solid black' }}>
              <View2D type={1} />
            </div>

            <div style={{ minHeight: 0, minWidth: 0, border: '1px solid black' }}>
              <View2D type={2} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Demo;
