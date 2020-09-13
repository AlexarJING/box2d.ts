import typescript from "rollup-plugin-typescript2";

export default {
  input: "unit-test.ts",
  output: {
    file: "./dist/unit-test.umd.js",
    name: "unit_test",
    format: "umd"
  },
  plugins: [
    typescript({ clean: true, tsconfigOverride: { compilerOptions: { target: "ES2015", module: "ES2015", declaration: false } } }),
  ]
};
