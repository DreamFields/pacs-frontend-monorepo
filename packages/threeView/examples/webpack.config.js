const path = require('path');

const outputPath = path.join(__dirname, '../web');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const entry = path.join(__dirname, '../examples/app.tsx');

const CopyPlugin = require('copy-webpack-plugin');

const htmlWebpackPlugin = new HtmlWebpackPlugin({
  template: path.join(__dirname, '../examples/index.html'),
  filename: './index.html',
});

module.exports = {
  mode: 'development',
  // 入口起点
  entry: { index: entry },

  // 可以通过配置 output 选项，告知 webpack 如何向硬盘写入编译文件。
  output: {
    path: outputPath,
    filename: '[name].bundle.js',
    // library: {
    //   name: 'reactButton',
    //   type: 'umd',
    // },
    // 清理 /dist
    clean: true,
  },

  // 此选项控制是否生成，以及如何生成 source map。
  devtool: 'source-map',

  // loader 用于对模块的源代码进行转换。loader 可以使你在 import 或 "load(加载)" 模块时预处理文件。
  module: {
    rules: [
      // less loader
      {
        test: /\.less$/,
        use: [
          // compiles Less to CSS
          // loader 从右到左（或从下到上）地取值(evaluate)/执行(execute)。
          {
            loader: 'style-loader', // creates style nodes from JS strings
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS
            options: {
              modules: {
                localIdentName: '[path][name]__[local]--[hash:base64:5]',
              },
            },
          },
          {
            loader: 'less-loader', // compiles Less to CSS
          },
        ],
      },

      // css
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },

      // ts tsx loader
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        // options: {
        //   useBabel: true,
        //   babelCore: "@babel/core", // needed for Babel v7
        // },
      },

      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },

      {
        test: /\.(glsl|vs|fs|vert|frag)$/,
        exclude: /node_modules/,
        use: ['raw-loader'],
      },

      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
      },

      {
        enforce: 'pre',
        test: /\.tsx?$/,
        use: 'source-map-loader',
      },
    ],
  },
  // 忽略报错
  ignoreWarnings: [/Failed to parse source map/],
  // 插件目的在于解决 loader 无法实现的其他事。
  plugins: [
    // HtmlWebpackPlugin 将生成一个 HTML 文件。
    htmlWebpackPlugin,
    new CopyPlugin({
      patterns: [
        {
          from: path.join(__dirname, 'assest', 'head256x256x109.zip'),
          to: path.join(__dirname, '../web', 'head256x256x109.zip'),
        },
        {
          from: path.join(__dirname, 'assest', 'textures'),
          to: path.join(__dirname, '../web', 'textures'),
        },
      ],
    }),
  ],
  // 这些选项能设置模块如何被解析。
  resolve: {
    // 尝试按顺序解析这些后缀名。如果有多个文件有相同的名字，但后缀名不同，webpack 会解析列在数组首位的后缀的文件 并跳过其余的后缀。
    extensions: ['.ts', '.tsx', '.js', '.json'],
    // 当正常解析失败时，重定向模块请求
    fallback: {
      fs: false,
      path: false,
      zlib: false,
    },
  },
  // 开发服务器(devServer)
  devServer: {
    host: 'localhost',
    port: 3001,
    // 告诉服务器内容的来源。仅在需要提供静态文件时才进行配置
    // contentBase: "./dist",
  },
  // externals: {
  //   react: "react",
  //   ReactDom: "react-dom",
  // },
};
