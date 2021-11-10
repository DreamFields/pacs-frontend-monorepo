/*
 * @Descripttion:
 * @Author: linkenzone
 * @Date: 2021-03-02 11:12:47
 */
/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */

export default {
  dev: {
    '/rbac': {
      target: 'rbac url',
      changeOrigin: true,
      pathRewrite: {
        '^/rbac': '',
      },
    },
    '/api': {
      target: 'http://27.17.30.150:20083',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
    },

    '/git': {
      target: 'https://github.com',
      changeOrigin: true,
      pathRewrite: {
        '^/git': '',
      },
    },

    '/orthanc': {
      target: 'http://27.17.30.150:20083',
      changeOrigin: true,
      pathRewrite: {
        '^/orthanc': '',
      },
    },

    '/web-viewer': {
      target: 'http://27.17.30.150:20083/web-viewer',
      changeOrigin: true,
      pathRewrite: {
        '^/web-viewer': '',
      },
    },
  },
  test: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
