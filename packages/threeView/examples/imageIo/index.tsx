/*
 * @Author: linkenzone
 * @Date: 2021-07-11 09:48:46
 * @Descripttion: Do not edit
 */
import View2D from '../../src/Viewport/View2D';

import LeftToolBar from '../../src/Viewport/ui/LeftToolsBar';
import ImageLoader from '../../src/util/ImageLoader';

// 有 ww 和 WL 的数据: b5981569-302c412a-6ced2c80-fd877f65-933991a4
// 6c1df2fa-9ccb6202-68731ddc-b0e7ab52-d1a1e9e5
// 1c45fb55-795f38d0-b9e4abd2-1d1fbc32-50a17af1
// 没有 ww 和 WL 的数据: 8619bc02-9c96e795-d7830b47-cb01a5df-d581b379
// 测试数据2 c6f47218-346f1920-f2fa54ea-34b5459a-3f0b9aca (无法解析的数据？)
// 问题数据 bfd34afd-f97a9f7c-c0551428-93a0c48a-0285c8ce

const Demo: React.FC<any> = (props) => {
  return (
    <div style={{ display: 'flex', height: '90vh' }}>
      <div style={{ width: '300px', height: '100%', backgroundColor: '#4a4a4a' }}>
        <LeftToolBar width={300} />
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
          {/* <ImageLoader uuid="b5981569-302c412a-6ced2c80-fd877f65-933991a4"></ImageLoader> */}
          <div style={{ minHeight: 0, minWidth: 0, border: '1px solid black' }}>
            <View2D type="Saggital" />
          </div>

          <div style={{ minHeight: 0, minWidth: 0, border: '1px solid black' }}>
            <View2D type="Coronal" />
          </div>

          <div style={{ minHeight: 0, minWidth: 0, border: '1px solid black' }}>
            <View2D type="Transverse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
