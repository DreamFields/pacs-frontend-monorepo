/*
 * @Author: linkenzone
 * @Date: 2021-07-26 15:41:31
 * @Descripttion: Do not edit
 */
import type { Reducer } from 'umi';
import { Effect } from 'umi';
import { message } from 'antd';

export interface StateType {
  layout: number[];
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {};
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'ViewState',

  state: {
    layout: [1, 2, 3, 4],
  },

  effects: {},

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};

export default Model;
