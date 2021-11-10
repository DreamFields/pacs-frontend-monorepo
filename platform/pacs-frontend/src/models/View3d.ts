/*
 * @Author: linkenzone
 * @Date: 2021-07-25 23:34:16
 * @Descripttion: Do not edit
 */
import type { Reducer } from 'umi';
import { Effect } from 'umi';
import { message } from 'antd';
// import { ModifyInGroupInfo } from '@/services/global';
// import { InGroupInfoDataType } from './data';

export interface StateType {
  type: string;
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    // modifyInGroupInfo: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'View3d',

  state: {
    type: 'volume',
  },

  effects: {
    // *modifyInGroupInfo({ payload }, { call }) {
    //   const data = yield call(ModifyInGroupInfo, payload);
    //   if (data) {
    //     message.success('修改入组信息成功！');
    //   }
    // },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    // clearSignature(state) {
    //   return { ...state, signature: undefined };
    // },
  },
};

export default Model;
