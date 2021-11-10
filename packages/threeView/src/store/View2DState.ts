/*
 * @Author: Meng Tian
 * @Date: 2021-07-15 17:49:04
 * @Description: Do not edit
 * 弃用
 */

import { observable, computed, action, makeObservable, autorun } from 'mobx';
import { ColorTable } from '../util/colorTable';
import { measurementType, viewType, initImgState } from '../Viewport/constants';

class View2DState {
  constructor() {
    makeObservable(this);
  }

  /* @observable toolState = {
    toolType: '', // 工具类型

    rotateActive: '' ,// 旋转工具激活的视图

    isRegionsActive: false, // 是否激活画笔功能

    isArrowActive: false, // 是否激活箭头功能

    isClearActive: false, // 是否激活清除标记功能
  }; */
  @observable toolType = ''; // 工具类型

  @observable stageState = {
    rotationStep: 30, // 旋转步长

    Saggital: Object(initImgState),

    Coronal: Object(initImgState),

    Transverse: Object(initImgState),

    colorTableIndex: ColorTable.BW_LINEAR.val, // 当前伪彩选择

    // ----------
    // 实际渲染的时候，采用的窗宽和窗位
    // ----------
    windowWidth: 0,
    windowLevel: 0,

    // ----------
    // 鼠标是否已经按下
    // ----------
    mouseDown: false,
  };

  // @observable imageState: measurementType[];

  @observable measureState = {
    isDrawing: false, // 当前标注工具是否正在绘制

    measurement: [], // 标注信息，类型为measurementType的列表

    strokeWidth: 2, // 描边粗细

    textFontSize: 20, // 字体大小

    maxId: 0, // 当前标注个数
  };

  @action setToolType(type: string) {
    this.toolType = type;
  }
  @action setStageState(payload) {
    console.log('payload', payload);
    this.stageState = { ...this.stageState, ...payload };
  }
  @action setMeasureState(payload) {
    this.measureState = { ...this.measureState, ...payload };
  }

  // 跟据下标更新数组
  @action updateMeasureByIndex(index, newElement) {
    if (newElement) this.measureState.measurement.splice(index, 1, newElement);
    else this.measureState.measurement.splice(index, 1);
  }

  // 根据视图的类型设置相应的属性值
  @action setStateByView(view, payload) {
    this.stageState[view] = { ...this.stageState[view], ...payload };
  }

  // 标注重置，清空所有的标注信息和标尺信息
  @action clearAllMeasures() {
    this.measureState.measurement=[]
  }

  /* // 根据deltX，deltY更新标注信息
  @action updateLabelPoints(deltX: number, deltY: number) {
    for (let i = 0; i < this.measureState.measurement.length; i++) {
      for (let j = 0; j < this.measureState.measurement[i].data.length; j++) {
        this.measureState.measurement[i].data[j].x+=deltX
        this.measureState.measurement[i].data[j].y+=deltY
      }
    }
  } */
}

export default new View2DState();
