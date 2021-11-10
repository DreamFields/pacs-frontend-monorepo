/*
 * @Author: linkenzone
 * @Date: 2021-05-13 17:15:33
 * @Descripttion: Do not edit
 */
import type { Reducer, Effect } from 'umi';

import { customTools, services } from '@/extension/cornerstone';

const test_imageIds = [
  // 'http://27.17.30.150:20083/instances/cc42f528-26cb736f-57488590-b7d478ff-96cf0913/preview',
  // 'dicomweb://s3.amazonaws.com/lury/PTCTStudy/1.3.6.1.4.1.25403.52237031786.3872.20100510032220.7.dcm',
  // 'dicomweb://s3.amazonaws.com/lury/PTCTStudy/1.3.6.1.4.1.25403.52237031786.3872.20100510032220.8.dcm',
  // 'dicomweb://s3.amazonaws.com/lury/PTCTStudy/1.3.6.1.4.1.25403.52237031786.3872.20100510032220.9.dcm',
  // 'dicomweb://s3.amazonaws.com/lury/PTCTStudy/1.3.6.1.4.1.25403.52237031786.3872.20100510032220.10.dcm',
  // 'dicomweb://s3.amazonaws.com/lury/PTCTStudy/1.3.6.1.4.1.25403.52237031786.3872.20100510032220.11.dcm',
  // 'dicomweb://s3.amazonaws.com/lury/PTCTStudy/1.3.6.1.4.1.25403.52237031786.3872.20100510032220.12.dcm',
];

export type StateType = {
  GridLayout: { x: number; y: number };
  activeTool: string;
  series: string;
  imageIds: any[];
  imageIdIndex: number;
  imageQuality: number;
  cornerstoneElement: any;
  tools: any;
};

/**
 * @description: 初始状态
 */
const initialState = {
  GridLayout: { x: 1, y: 1 },
  activeTool: 'Wwwc',
  cornerstoneElement: null,
  series: 'd0f89989-863713bc-81eebe9c-b44a3a1f-593aabe4',
  tools: [
    // Mouse
    {
      name: 'Wwwc',
      mode: 'active',
      modeOptions: { mouseButtonMask: 1 },
    },
    {
      name: 'Zoom',
      mode: 'active',
      modeOptions: { mouseButtonMask: 2 },
    },
    {
      name: 'Pan',
      mode: 'active',
      modeOptions: { mouseButtonMask: 4 },
    },

    // General 基础工具
    'DragProbe',
    'Magnify',
    'Rotate',
    'WwwcRegion',
    'StackScroll',

    // 标注工具

    'Length',
    'Angle',
    'Bidirectional',
    'FreehandRoi',
    'Eraser',
    'CircleRoi',

    // 自定义工具
    {
      name: 'HelloWorld',
      mode: 'active',
      toolClass: customTools.HelloWorldTool,
      props: { name: 'HelloWorld' },
    },

    // Scroll
    { name: 'StackScrollMouseWheel', mode: 'active' },

    // Touch
    // { name: 'PanMultiTouch', mode: 'active' },
    // { name: 'ZoomTouchPinch', mode: 'active' },
    // { name: 'StackScrollMultiTouch', mode: 'active' },
    // 双击适配窗口工具
    // { name: 'DoubleTapFitToWindow', mode: 'active' },
  ],
  imageIds: [],
  imageIdIndex: 0,
  imageQuality: 100,
};

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetchSeries: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
    reset: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'ImgViewer2D',

  state: initialState,

  effects: {
    *fetchSeries({ payload }, { call, put, select }) {
      const data = yield call(services.FetchInstances, payload);

      const imageQuality = yield select((state: any) => {
        return state.ImgViewer2D.imageQuality;
      });

      if (data) {
        const imageIds = [];

        if (data.length > 0) {
          console.log('data', data);
          // eslint-disable-next-line guard-for-in
          for (const index in data) {
            imageIds.push(
              `http://27.17.30.150:20083/instances/${data[index].ID}/rendered?quality=${imageQuality}`,

              // `wadouri:http://27.17.30.150:20083/instances/${data[index].ID}/file`,

              // `wadouri:http://27.17.30.150:20083/instances/${data[index].ID}/file`,
            );
            // http://27.17.30.150:20083/instances/${item.ID}/preview?quality=100
            // https://demo.orthanc-server.com/instances/{id}/frames/{frame}/rendered
            // https://demo.orthanc-server.com/instances/{id}/image-int16
          }
        }
        yield put({
          type: 'save',
          payload: {
            imageIds,
            imageIdIndex: 0,
          },
        });
      }
    },
  },

  reducers: {
    /**
     * @description: 储存配置
     * @Param:
     * @param {*} state
     * @param {*} param2
     */
    save(state, { payload }) {
      return { ...state, ...payload };
    },

    /**
     * @description: 初始化
     * @Param:
     */
    reset() {
      return initialState;
    },
  },
};

export default Model;
