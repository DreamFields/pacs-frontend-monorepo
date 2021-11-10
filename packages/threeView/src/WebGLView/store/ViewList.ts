/*
 * @Author: linkenzone
 * @Date: 2021-11-03 15:44:13
 * @Descripttion:
 *
 */

import { observable, computed, action, makeObservable } from 'mobx';

import View2d from './View2d';

import * as CONSTANTS from '../constants';

// MOBX 的语法参考：
// https://zh.mobx.js.org/enabling-decorators.html

// 代码结构参考
// https://github.com/mobxjs/mobx-react-boilerplate
// https://codesandbox.io/s/concepts-principles-il8lt?file=/src/index.js

class ViewList {
  // View2dList
  @observable ViewList = {
    Axial: null, // Z
    Coronal: null, // X
    Sagittal: null, // Y
    ThreeD: null, // 3d 窗口
  };

  // 当前激活的窗口
  @observable activeView: null | number = null;

  constructor() {
    // 捕获已经存在的对象属性并且使得它们可观察。
    makeObservable(this);

    // 初始化的时候创建3个种类的窗口
    this.create2dView();
  }

  // 创建三个种类的窗口
  @action
  create2dView() {
    this.ViewList = {
      Axial: new View2d(CONSTANTS.Axial),
      Coronal: new View2d(CONSTANTS.Coronal),
      Sagittal: new View2d(CONSTANTS.Sagittal),
      ThreeD: null,
    };
  }

  @action
  /**
   * @description: 激活某一个窗口，使它成为激活的状态
   * @param {number} orientation
   * @return {*}
   */
  activateView(type: number) {
    this.activeView = type;
  }

  // 使所有窗口处于未激活状态
  @action
  deactivateAll2dView() {
    this.activeView = null;
  }
}

// 单例
export default new ViewList();
