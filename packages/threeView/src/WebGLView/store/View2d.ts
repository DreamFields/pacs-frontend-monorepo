/*
 * @Author: linkenzone
 * @Date: 2021-11-03 15:04:42
 * @Descripttion:
 * 保存 view 窗口状态
 */

import { observable, computed, action, makeObservable } from 'mobx';

import * as CONSTANTS from '../constants';

// MOBX 的语法参考：
// https://zh.mobx.js.org/enabling-decorators.html

// 代码结构参考
// https://github.com/mobxjs/mobx-react-boilerplate
// https://codesandbox.io/s/concepts-principles-il8lt?file=/src/index.js

class View2d {
  constructor(orientation: number) {
    // 捕获已经存在的对象属性并且使得它们可观察。
    makeObservable(this);
    this.id = View2d.generateId();
    // 初始化设置 orientation
    this.setOrientation(orientation);
  }
  // 生成一个元素的 id，只读
  readonly id: number; // e.g: 0.9251345999667706

  // --- UI 元素 ---
  // 窗宽和窗位
  @observable windowWidth = 0;
  @observable windowLevel = 0;
  // 阈值
  @observable lowerThreshold = 0;
  @observable upperThreshold = 0;
  // 反色
  @observable interpolation = false;
  // lut TODO:数据格式还未定
  @observable lut = undefined;
  // index 代表当前截面的深度
  @observable index = 0;

  @observable orientation = CONSTANTS.Coronal;

  // --- THREE 元素 ---

  static nextId = 1;
  static generateId() {
    return this.nextId++;
  }

  @action setOrientation(orientation: number) {
    this.orientation = orientation;
  }
}

export default View2d;
