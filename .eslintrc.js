/*
 * @Author: linkenzone
 * @Date: 2021-05-21 16:30:28
 * @Descripttion: eslint 配置文件
 */

const path = require("path");

module.exports = {
  // settings: {
  //   react: {
  //     version: "detect",
  //   },
  // },
  extends: [require.resolve("@umijs/fabric/dist/eslint")],
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
    REACT_APP_ENV: true,
  },
  // 可以适当禁用部分规则
  rules: {
    "no-param-reassign": 0,
    "no-restricted-syntax": 0,
    "no-underscore-dangle": 0,
    "import/no-unresolved": 0,
    "@typescript-eslint/naming-convention": 0,
  },
};
