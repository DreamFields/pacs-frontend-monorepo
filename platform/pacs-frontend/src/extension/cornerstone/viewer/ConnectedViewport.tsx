/*
 * @Descripttion: Do not edit
 * @Author: linkenzone
 * @Date: 2021-04-02 14:41:11
 */
import React, { useEffect, useState } from 'react';
import CornerstoneViewport from 'react-cornerstone-viewport';
import { useResizeDetector } from 'react-resize-detector';
import type { Dispatch } from 'dva';
import { connect } from 'dva';
import type { StateType } from '@/models/cornerstone/model';
import style from './style.less';
// import cornerstone from 'cornerstone-core';
// import cornerstoneTools from 'cornerstone-tools';
import LoadingIndicator from './LoadingIndicator';

type ViewportProps = {
  dispatch: Dispatch;
  ImgViewer2D: StateType;
};

const Viewport: React.FC<ViewportProps> = (props) => {
  const { ImgViewer2D, dispatch } = props;
  const { width, height, ref } = useResizeDetector();
  const [GridLayoutItems, setGridLayoutItems] = useState<number[]>([]);
  const [activeViewportIndex, setActiveViewportIndex] = useState(1);

  useEffect(() => {
    console.log('ImgViewer: width:', width);
    console.log('ImgViewer: height:', height);

    // 销毁的时候
    return () => {};
  }, [width, height]);

  useEffect(() => {
    console.log('ImgViewer2D:', ImgViewer2D);

    // 生成坐标
    return () => {};
  }, [ImgViewer2D]);

  useEffect(() => {
    const _nums = ImgViewer2D.GridLayout.x * ImgViewer2D.GridLayout.y;

    const _list = [];

    // eslint-disable-next-line no-plusplus
    for (let i = 1; i <= _nums; i++) {
      _list.push(i);
    }

    setGridLayoutItems(_list);

    // 生成坐标
    return () => {};
  }, [ImgViewer2D.GridLayout]);

  useEffect(() => {
    // dispatch({
    //   type: 'ImgViewer2D/fetchSeries',
    //   payload: { series: 'd0f89989-863713bc-81eebe9c-b44a3a1f-593aabe4' },
    // });

    return () => {
      dispatch({
        type: 'ImgViewer2D/save',
        payload: { cornerstoneElement: null },
      });
    };
  }, []);

  return (
    <div style={{ display: 'flex', height: '100%', flexWrap: 'wrap' }} ref={ref}>
      {ImgViewer2D.imageIds && ImgViewer2D.imageIds.length > 0
        ? GridLayoutItems.map((viewportIndex) => (
            <CornerstoneViewport
              key={viewportIndex}
              tools={ImgViewer2D?.tools}
              imageIds={ImgViewer2D?.imageIds}
              imageIdIndex={ImgViewer2D?.imageIdIndex}
              activeTool={ImgViewer2D?.activeTool}
              style={{
                minWidth: (width ?? 0) / ImgViewer2D.GridLayout.x,
                height: (height ?? 0) / ImgViewer2D.GridLayout.y,
                flex: '1',
              }}
              isStackPrefetchEnabled={true}
              loadIndicatorDelay={5}
              loadingIndicatorComponent={LoadingIndicator}
              className={
                GridLayoutItems.length > 1 && activeViewportIndex === viewportIndex
                  ? style.viewport_wrapper_active
                  : style.viewport_wrapper
              }
              setViewportActive={() => {
                setActiveViewportIndex(viewportIndex);
              }}
              resizeRefreshMode="throttle"
              onElementEnabled={(elementEnabledEvt: any) => {
                const cornerstoneElement = elementEnabledEvt.detail.element;

                dispatch({
                  type: 'ImgViewer2D/save',
                  payload: { cornerstoneElement },
                });

                // cornerstoneElement.addEventListener(
                //   cornerstoneTools.EVENTS.MEASUREMENT_ADDED,
                //   (action: any) => {
                //     console.log('action', action);
                //     OHIF.measurements.MeasurementHandlers.onAdded(action);
                //   },
                // );

                // Wait for image to render, then invert it
                // cornerstoneElement.addEventListener(
                //   'cornerstoneimagerendered',
                //   (imageRenderedEvent) => {
                //     cornerstoneTools.addToolForElement(cornerstoneElement, HelloWorldMouseTool);
                //   },
                // );
              }}
            />
          ))
        : null}
    </div>
  );
};

const mapStateToProps = ({ ImgViewer2D }: { ImgViewer2D: StateType }) => {
  return {
    ImgViewer2D,
  };
};

const ConnectedViewport = connect(mapStateToProps)(Viewport);

// export { connectedViewer };

export default ConnectedViewport;
