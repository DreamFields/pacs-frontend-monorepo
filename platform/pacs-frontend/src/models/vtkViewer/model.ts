// /*
//  * @Author: linkenzone
//  * @Date: 2021-06-30 14:22:29
//  * @Descripttion: Do not edit
//  */
// import type { Reducer, Effect } from 'umi';

// import vtkProxyManager from '@kitware/vtk.js/Proxy/Core/ProxyManager';

// import proxyConfiguration from '@/extension/vtkViewer/config/proxyManagerConfiguration';

// export type StateType = {
//   proxyManager: any;
// };

// /**
//  * @description: 初始状态
//  */
// const initialState = {
//   proxyManager: vtkProxyManager.newInstance({ proxyConfiguration }),
// };

// export interface ModelType {
//   namespace: string;
//   state: StateType;
//   effects: {};
//   reducers: {
//     save: Reducer<StateType>;
//     reset: Reducer<StateType>;
//   };
// }

// const Model: ModelType = {
//   namespace: 'vtkViewer',

//   state: initialState,

//   effects: {},

//   reducers: {
//     /**
//      * @description: 储存配置
//      * @Param:
//      * @param {*} state
//      * @param {*} param2
//      */
//     save(state, { payload }) {
//       return { ...state, ...payload };
//     },

//     /**
//      * @description: 初始化
//      * @Param:
//      */
//     reset() {
//       return initialState;
//     },
//   },
// };

// export default Model;
