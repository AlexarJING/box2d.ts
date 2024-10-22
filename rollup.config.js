// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import dts from "rollup-plugin-dts";
import typescript from '@rollup/plugin-typescript';
// import typescript from '@rollup/plugin-typescript';

export default [
  // 主打包配置
  {
    input: 'src/index.ts',
    output: [
      {
        dir: 'dist',
        format: 'es', // 生成 mjs 文件
        entryFileNames: '[name].mjs'
      }
    ],
    // dir: {
    //   outDir: "dist"
    // },
    plugins: [
      typescript({outDir:"dist"}),
      resolve(),
      commonjs(),
    ]
  },
  // 类型定义生成配置
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist',
      format: 'es', // 生成 d.ts 文件
      entryFileNames: '[name].d.ts'
    },
    plugins: [
      dts({ insertTypesEntry: true })
    ],
  }
];