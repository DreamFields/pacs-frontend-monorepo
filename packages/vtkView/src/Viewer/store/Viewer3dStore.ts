/*
 * @Author: linkenzone
 * @Date: 2021-07-20 14:31:50
 * @Descripttion: Do not edit
 */
import { observable, action, makeObservable } from 'mobx';

class Viewer3dModel {
  constructor() {
    // 这个函数可以捕获已经存在的对象属性并且使得它们可观察。
    makeObservable(this);
  }

  id = Math.random();
  // 数据
  @observable imageData = null;
  // type
  @observable type = 'contour';
  // renderWindow
  @observable.ref renderWindow = null;
  // actor
  @observable.ref actor = null;
  // marchingCube
  @observable.ref marchingCube = null;
  // ISO value
  @observable.ref isoValue = 0;

  @action changeImageData(imageData: any) {
    this.imageData = imageData;
  }

  @action changeRenderData(actor: any, renderWindow: any) {
    this.actor = actor;
    this.renderWindow = renderWindow;
  }

  @action changeMarchingCube(marchingCube: any) {
    this.marchingCube = marchingCube;
  }

  @action changeIsoValue(isoValue: number) {
    this.isoValue = isoValue;
  }

  @action changeType(type: string) {
    this.type = type;
  }
}

export default new Viewer3dModel();
