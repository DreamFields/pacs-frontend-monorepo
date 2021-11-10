/*
 * @Author: linkenzone
 * @Date: 2021-07-07 10:42:21
 * @Descripttion: Do not edit
 */
import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import cleaner from 'rollup-plugin-cleaner';
import { string } from 'rollup-plugin-string';
import babel from '@rollup/plugin-babel';

// 目前来看 好像只需要打包esm的格式
// 其他的格式日后再说

export default [
  {
    input: './src/index.ts',
    output: [
      // ECMAScript Module，现在使用的模块方案，使用 import export 来管理依赖。
      // 由于它们只能写在所有表达式外面，所以打包器可以轻易做到分析依赖以及 Tree-Shaking。
      {
        dir: 'dist/esm',
        // file: 'dist/index.js',
        format: 'esm',
        exports: 'named',
        // sourcemap: true,
        // 添加globals
        preserveModules: true,
        preserveModulesRoot: 'src',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
      // Universal Module Definition，同时兼容 CJS 和 AMD，并且支持直接在前端用 <script src="lib.umd.js"></script> 的方式加载。
      // 现在还在广泛使用，不过可以想象 ESM 和 IIFE 逐渐代替它。
      // {
      //   file: 'dist/umd/three-view.js',
      //   format: 'umd',
      //   exports: 'named',
      //   name: 'ThreeViewJS',
      //   globals: {
      //     react: 'React',
      //     'react-dom': 'ReactDOM',
      //   },
      // },
      // CommonJS，只能在 NodeJS 上运行，使用 require("module") 读取并加载模块。
      // 缺点：不支持浏览器，执行后才能拿到依赖信息，
      // 由于用户可以动态 require（例如 react 根据开发和生产环境导出不同代码 的写法），无法做到提前分析依赖以及 Tree-Shaking 。
      // {
      //   file: 'dist/cjs/three-view.js',
      //   format: 'cjs',
      //   globals: {
      //     react: 'React',
      //     'react-dom': 'ReactDOM',
      //   },
      // },
    ],
    // 添加externs
    // 指出应将哪些模块视为外部模块
    external: ['react', 'react-dom', 'fs', 'react-color'],
    plugins: [
      // 使用Node解析算法定位模块，用于使用node_modules中的第三方模块
      nodeResolve({
        // include: 'node_modules/**',
        // don't rely on node builtins for web
        preferBuiltins: false,
        browser: true,
        // jsnext: true,
      }),
      postcss({
        modules: true, // 使用 CSS modules
        minimize: true, // 压缩 css
        extensions: ['.less', '.css'], // 选择处理的文件类型
        use: ['less'], // 使用 loader
        extract: 'style.css', // 输出路径
      }),
      ,
      typescript({
        tsconfig: 'tsconfig.json',
        useTsconfigDeclarationDir: true,
        check: false, //禁用代码检查
      }),
      // babel({
      //   extensions: ['.js', '.jsx', '.ts', '.tsx'],
      //   include: ['src/**/*'],
      //   exclude: 'node_modules/**',
      //   babelHelpers: 'runtime',
      // }),
      // Rollup插件，最小化生成的es包。使用terser。
      terser(),
      // 一个Rollup插件，可以将CommonJS模块转换为ES6，这样它们就可以包含在Rollup包中
      commonjs({
        // 同时支持 import 和 require
        transformMixedEsModules: true,
      }),
      // 将文本文件转换为模块
      string({
        // Required to be specified
        include: ['**/*.vert', '**/*.frag'],
        // Undefined by default
        exclude: ['**/index.html'],
      }),
      // 在重新构建之前清理目录的rollup插件。
      cleaner({
        targets: ['./dist/'],
      }),
    ],
    // 告诉 rollup 哪些不报错
    onwarn: function (warning) {
      // Skip certain warnings
      // should intercept ... but doesn't in some rollup versions
      if (warning.code === 'THIS_IS_UNDEFINED') {
        return;
      }

      if (warning.code !== 'CIRCULAR_DEPENDENCY') {
        // rollupWarn(warning);
        console.warn(warning);
      }
      // console.warn everything else
      // console.warn(warning.message);
    },
  },
];
