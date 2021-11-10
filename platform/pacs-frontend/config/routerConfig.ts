/*
 * @Descripttion: 路由配置
 * @Author: linkenzone
 * @Date: 2020-09-04 00:20:59
 * 路由配置 : https://umijs.org/zh-CN/docs/routing
 */

export default [
  {
    path: '/',
    component: '@/layouts/HeaderLayout',
    routes: [
      {
        path: '/test',
        component: '@/pages/index.tsx',
      },
      // 三维部分

      {
        path: '/3d',
        component: '@/pages/3d',
      },
      // {
      //   path: '/3d/SliceDemo',
      //   component: '@/pages/3d/SliceDemo',
      // },
      // {
      //   path: '/3d/SurfaceDemo',
      //   component: '@/pages/3d/SurfaceDemo',
      // },
      // {
      //   path: '/3d/VolumeDemo',
      //   component: '@/pages/3d/VolumeDemo',
      // },
      // 影像文件管理

      {
        path: '/ImageFileManagment',
        component: '@/pages/ImageFileManagment',
      },

      {
        path: '/',
        component: '@/pages/ImageFileManagment/AllPatients',
      },

      {
        path: '/Patient',
        component: '@/pages/ImageFileManagment/Patient',
      },

      {
        path: '/Study',
        component: '@/pages/ImageFileManagment/Study',
      },

      {
        path: '/Series',
        component: '@/pages/ImageFileManagment/Series',
      },

      {
        path: '/Instance',
        component: '@/pages/ImageFileManagment/Instance',
      },
      
      // ======================================
      // 刘珂学长部分
      {
        path: '/PreviewImage',
        component: '@/pages/previewImage',
      },
      {
        path: '/Detect',
        component: '@/pages/detect',
      },
      // ======================================

      // 基础阅片
      {
        path: '/Viewer',
        component: '@/pages/threeViewer',
      },

      // 文件上传
      {
        path: '/Upload',
        component: '@/pages/Upload',
      },

      // 测试权限系统

      {
        path: '/admin',
        name: 'admin',
        component: '@/pages/admin',
        access: 'adminRouteFilter', // 会调用 src/access.ts 中返回的 adminRouteFilter 进行鉴权
      },

      // 404 代码

      {
        component: '404',
      },
    ],
  },
];
