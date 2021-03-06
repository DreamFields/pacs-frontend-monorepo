/*
 * @Descripttion: Do not edit
 * @Author: linkenzone
 * @Date: 2021-03-23 22:57:37
 */
import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { Responsive } from 'react-grid-layout';
import { useResizeDetector } from 'react-resize-detector';
import { Button, Switch } from 'antd';

import style from './style.less';
import TopToolbar from './TopToolbar';
import ImgViewer from './ImgViewer';
import LeftToolbar from './LeftToolbar';
import RightToolbar from './RightToolbar';
// 引入 样式
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useIntl } from 'umi';

type ViewerProps = {
  initialLayout?: any;
};

const Viewer: React.FC<ViewerProps> = (props) => {
  // 国际化配置
  const intl = useIntl();

  const Contents = {
    top: (
      <>
        <div className={`${style.layout_items_header} rgl-drag-zone`}>
          {intl.formatMessage({
            id: 'viewer.Top-toolbar',
          })}
        </div>
        <TopToolbar />
      </>
    ),
    left: (
      <>
        <div className={`${style.layout_items_header} rgl-drag-zone`}>
          {intl.formatMessage({
            id: 'viewer.Left-toolbar',
          })}
        </div>
        <LeftToolbar />
      </>
    ),
    right: (
      <>
        <div className={`${style.layout_items_header} rgl-drag-zone`}>
          {intl.formatMessage({
            id: 'viewer.Right-toolbar',
          })}
        </div>
        <RightToolbar />
      </>
    ),
    img: (
      <>
        <div className={`${style.layout_items_header} rgl-drag-zone`}>
          {intl.formatMessage({
            id: 'viewer.Image-viewer',
          })}
        </div>
        <ImgViewer />
      </>
    ),
  };

  const { initialLayout } = props;
  const [layouts, setLayouts] = useState<any>(undefined);
  // 布局的开启状态
  const [layoutState, setLayoutState] = useState({ top: true, left: true, right: true });
  const [currentBreakpoint, setCurrentBreakpoint] = useState('lg');
  const { width, height, ref } = useResizeDetector();

  useEffect(() => {
    setLayouts({ lg: initialLayout });
    return () => {};
  }, [initialLayout]);

  useEffect(() => {
    // console.log('Viewer: width:', width);
    // console.log('Viewer: height:', height);
    return () => {};
  }, [width, height]);

  /**
   * @description: 生成布局中的 Dow 元素
   * @Param:
   */
  const generateDOM = () => {
    if (!layouts) return <></>;
    return _.map(layouts[currentBreakpoint], (item: any) => {
      return (
        <div
          key={item.i}
          className={item.i === 'img' ? style.layout_items_viewer : style.layout_items}
        >
          {Contents[item.i]}
        </div>
      );
    });
  };

  /**
   * @description: 切换layout的关闭，开启状态
   * @Param:
   * @param {boolean} state
   * @param {any} layout
   * @param {boolean} top 是否从顶部插入？
   */
  const SwitchLayout = (state: boolean, layout: any, top?: boolean) => {
    let _layouts;
    if (state) {
      if (top) {
        for (const item of layouts[currentBreakpoint]) {
          if (item.y === 0) {
            item.y += 1;
          }
        }
      }
      _layouts = {
        ...layouts,
        [currentBreakpoint]: [...layouts[currentBreakpoint], layout],
      };
    } else {
      if (top) {
        for (const item of layouts[currentBreakpoint]) {
          if (item.y === 1) {
            item.y += -1;
          }
        }
      }
      _layouts = {
        ...layouts,
        [currentBreakpoint]: layouts[currentBreakpoint].filter(({ i }: any) => i !== layout.i),
      };
    }
    setLayoutState({ ...layoutState, [layout.i]: state });
    setLayouts(_layouts);
  };

  return (
    <div style={{ backgroundColor: '#1b2436' }}>
      {/* <div style={{ backgroundColor: '#1b2436', padding: '8px', color: 'white' }}>
        <div>
          顶部工具栏{' '}
          <Switch
            checked={layoutState.top}
            onChange={(e) => {
              SwitchLayout(e, initialLayout[0], true);
            }}
          />
        </div>

        <div>
          左侧工具栏{' '}
          <Switch
            checked={layoutState.left}
            onChange={(e) => {
              SwitchLayout(e, initialLayout[1]);
            }}
          />
        </div>

        <div>
          右侧工具栏{' '}
          <Switch
            checked={layoutState.right}
            onChange={(e) => {
              SwitchLayout(e, initialLayout[2]);
            }}
          />
        </div>
      </div> */}

      <div style={{ padding: '8px' }} ref={ref}>
        <Responsive
          width={width || 0}
          className="layout"
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          isBounded={true}
          rowHeight={100}
          verticalCompact={true}
          compactType="horizontal"
          draggableHandle=".rgl-drag-zone"
          margin={[4, 4]}
          // WidthProvider option
          measureBeforeMount={false}
          onLayoutChange={(_layout: any, _layouts: any) => {
            // console.log('onLayoutChange _layout', _layout);
            // console.log('onLayoutChange _layouts', _layouts);
            setLayouts(_layouts);
          }}
          resizeHandles={['se']}
          resizeHandle={(resizeHandleAxis: any) => {
            // console.log('resizeHandleAxis', resizeHandleAxis);
            if (resizeHandleAxis === 'e') {
              return (
                <div
                  className={style.custom_resizable_handle}
                  style={{ bottom: '50%', transform: 'rotate(0deg)', cursor: 'ew-resize' }}
                ></div>
              );
            }
            return <div className={style.custom_resizable_handle}></div>;
          }}
        >
          {generateDOM()}
        </Responsive>
      </div>
    </div>
  );
};

Viewer.defaultProps = {
  initialLayout: [
    { i: 'top', x: 0, y: 0, w: 12, h: 1, static: true, resizeHandles: [] },
    { i: 'left', x: 0, y: 1, w: 2, h: 8 },
    { i: 'right', x: 10, y: 1, w: 3, h: 8 },
    { i: 'img', x: 2, y: 1, w: 7, h: 8 },
  ],
};

export default Viewer;
