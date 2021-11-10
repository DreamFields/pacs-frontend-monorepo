/*
 * @Author: Meng Tian
 * @Date: 2021-11-09 21:05:45
 * @Description: Do not edit
 */
import type { Reducer, Effect } from 'umi';
import { message } from 'antd';
import { PreProcess } from './service';

export type StateType = {
  curPatientInfo: any;
  curStudyInfo: any;
  curSeriesInfo: any;
  curInstances: any;
  curHeaderKey: any[];
  curHeaderValue: any[];
  curDicom: any[];
  curDicomtags: any[];
  curDicomtagKey: any[];
  curDicomtagValue: any[];
  mainDicomKey: any[];
  mainDicomValue: any[];
  parentSeriesId: any;
};

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    preProcess: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'detect',

  state: {
    curPatientInfo: null,
    curStudyInfo: null,
    curSeriesInfo: null,
    curInstances: null,
    curHeaderKey: [],
    curHeaderValue: [],
    curDicom: [],
    curDicomtags: [],
    curDicomtagKey: [],
    curDicomtagValue: [],
    mainDicomKey: [],
    mainDicomValue: [],
    parentSeriesId: null,
  },

  effects: {
    *preProcess({ payload }, { call, put }) {
      // 当前 Instances 渲染左侧侧边栏
      const data = yield call(PreProcess, payload);
      console.log('model', data);
      yield put({
        type: 'save',
        payload: {},
      });
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
  },
};

export default Model;
