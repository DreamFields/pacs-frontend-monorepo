/*
 * @Descripttion: 默认的项目的配置文件
 * @Author: linkenzone
 * @Date: 2020-09-04 00:20:42
 * 配置文件文档 : https://umijs.org/config/
 */

import { defineConfig } from 'umi';
import { join } from 'path';
import routerConfig from './routerConfig';
import proxy from './proxy';
// import chainWebpack from './chainWebpack';

const path = require('path');

// process.env包含着关于系统环境的信息
// 该变量代表当前应用所处环境的具体名称。如 dev、test、pre、prod 等
const { REACT_APP_ENV } = process.env;

export default defineConfig({
  nodeModulesTransform: {
    // 设置 node_modules 目录下依赖文件的编译方式
    type: 'none', // 默认是 all，全部编译
  },
  copy: [
    //   // 设置要复制到输出目录的文件或文件夹
    {
      from: path.join('../../node_modules', 'itk', 'WebWorkers'),
      to: path.join('itk', 'WebWorkers'),
    },
    {
      from: path.join('../../node_modules', 'itk', 'ImageIOs'),
      to: path.join('itk', 'ImageIOs'),
    },
    //   {
    //     from: path.join('node_modules', 'itk', 'MeshIOs'),
    //     to: path.join('itk', 'MeshIOs'),
    //   },
    //   {
    //     from: path.join('node_modules', 'itk', 'PolyDataIOs'),
    //     to: path.join('itk', 'PolyDataIOs'),
    //   },
  ],
  publicPath: '/', // 配置 webpack 的 publicPath
  // history: { type: 'hash' }, // 使用hash路由
  hash: true, // 配置是否让生成的文件包含 hash 后缀
  mock: false, // 关闭mock
  routes: routerConfig, // 导入路由
  dynamicImport: {
    // 是否启用按需加载
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  locale: {
    // 国际化插件，用于解决 i18n 问题
    default: 'zh-CN', // default zh-CN
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  // theme: {
  //   // 配置主题，实际上是配 less 变量
  //   'primary-color': '#39bbdb',
  // },
  dva: {
    // 开启 dva
    hmr: true, // 是否启用 dva model 的热更新
    // disableModelsReExport: true,
    // lazyLoad: true,
  },
  // antd: {
  //   // antd 配置
  //   // 开启暗色主题
  //   // dark: true,
  //   // 开启紧凑主题
  //   // compact: true,
  // },
  title: false, // 配置标题
  proxy: proxy[REACT_APP_ENV || 'dev'], // 配置代理 proxy 配置仅在 dev 时生效。
  // chainWebpack, // 导入 webpack 的配置
  // esbuild: {}, // 使用 esbuild 作为压缩器,试验性功能，可能有坑，但效果拔群。
  ignoreMomentLocale: true, // 忽略 moment 的 locale 文件，用于减少尺寸
  openAPI: [
    // http://localhost:3020/umi/plugin/openapi 进入
    // 列表第一个请不要改 projectName ，否则必定报错
    {
      requestLibPath: "import request from '@/utils/request'",
      schemaPath: join(__dirname, 'api.json'),
      mock: false,
      // projectName: 'mips_api',
    },

    {
      requestLibPath: "import { request } from 'umi'",
      schemaPath: 'https://gw.alipayobjects.com/os/antfincdn/CA1dOm%2631B/openapi.json',
      mock: false,
      projectName: 'swagger',
    },
  ],
});
