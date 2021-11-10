/*
 * @Author: linkenzone
 * @Date: 2021-06-30 11:04:12
 * @Descripttion: Do not edit
 */
import axios from 'axios';
import axiosRetry from 'axios-retry';
import initCornerstone from '@/extension/cornerstone/utils/initCornerstone';

console.log('初始化 Cornerstone...');

initCornerstone();

// console.log('配置 axios 全局重新连接次数...');

// axiosRetry(axios, {
//   retries: 3, // number of retries
//   retryDelay: (retryCount) => {
//     console.log(`retry attempt: ${retryCount}`);
//     return retryCount * 2000; // time interval between retries
//   },
// });
