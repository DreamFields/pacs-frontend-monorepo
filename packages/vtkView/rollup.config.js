/*
 * @Author: linkenzone
 * @Date: 2021-07-05 17:44:17
 * @Descripttion: Do not edit
 */

import typescript from 'rollup-plugin-typescript2';

import { nodeResolve } from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import cleaner from 'rollup-plugin-cleaner';
import json from '@rollup/plugin-json';

// import babel from 'rollup-plugin-babel';
// import resolve from 'rollup-plugin-node-resolve';

import commonjs from '@rollup/plugin-commonjs';

// const override = { compilerOptions: { declaration: false } };

// TODO 这个包的体积有点太大了，得想办法进行优化

export default [
  {
    input: './src/index.ts',
    output: [
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
      {
        file: 'dist/umd/vtkView.js',
        format: 'umd',
        exports: 'named',
        name: 'VtkViewJS',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    ],
    // 添加externs
    // 告诉rollup不要将react打包，而作为外部依赖
    external: ['react', 'react-dom'],
    plugins: [
      json(),
      // resolve(),
      nodeResolve({
        // include: 'node_modules/**',
        // don't rely on node builtins for web
        preferBuiltins: false,
        browser: true,
      }),
      postcss({
        modules: true,
        minimize: true,
        extensions: ['.less', '.css'],
        use: ['less'],
        extract: 'style.css', // 输出路径
      }),
      ,
      typescript({
        tsconfig: 'tsconfig.json',
        useTsconfigDeclarationDir: true,
        check: false,
      }),
      // babel(),
      terser(),
      commonjs({ transformMixedEsModules: true }),
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
