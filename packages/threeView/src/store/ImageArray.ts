/*
 * @Author: linkenzone
 * @Date: 2021-07-13 11:02:39
 * @Descripttion: Do not edit
 */

import { observable, computed, action, makeObservable } from 'mobx';

class ImageArrayModel {
  constructor() {
    // 这个函数可以捕获已经存在的对象属性并且使得它们可观察。
    makeObservable(this);
  }

  id = Math.random();
  // 图片的类型
  @observable imageType = 'Uint16Array';
  // 图片宽度
  @observable xDim = 0;
  // 图片高度
  @observable yDim = 0;
  // 图片的层数
  @observable zDim = 0;
  // 数据大小
  @observable dataSize = 0;
  // 数据
  @observable dataArray = null;
  // 多截面数据
  @observable pixelArray_x = null;
  @observable pixelArray_y = null;

  // rescaleSlope
  @observable rescaleSlope = 1;
  // rescaleIntercept
  @observable rescaleIntercept = 0;

  // ----------
  // 从服务器中获取的 窗宽 WW 和 窗位 WL，不用于实际的渲染中
  // ----------
  @observable WW = 1;
  @observable WL = 0;

  // 窗口尺寸
  @observable boxSize = {
    x: 250,
    y: 250,
    z: 480,
  };
  // 像素间距
  @observable pixelSpacing = {
    x: 1.0,
    y: 1.0,
    z: 1.0,
  };
  // 病人名字
  @observable patientName;
  // 病人id
  @observable patientId;
  // 病人出生日期
  @observable patientBirthDate;
  // 机构名字
  @observable institutionName;
  // 序列号
  @observable seriesNumber;

  // 加载
  @observable loading = true;

  // @computed imageTypeChanged() {
  //   console.log('computed imageType', this.imageType);
  // }
  @action
  changeImageType() {
    console.log('改变imageType的状态');
    this.imageType = 'Uint8Array';
  }

  @action generate(width: any, high: any, size: any, rawData: any) {
    console.log('生成一个 ImageArray');

    this.xDim = width;
    this.yDim = high;
    this.zDim = size;

    this.dataSize = this.xDim * this.yDim * this.zDim;
    this.dataArray = rawData;
  }

  // 生成多截面数据
  @action generateSection(pixelArray_x: any, pixelArray_y: any) {
    console.log('生成多截面数据');
    this.pixelArray_x = pixelArray_x;
    this.pixelArray_y = pixelArray_y;
  }

  @action changeLevel(ww: any, wl: any) {
    this.WL = wl;
    this.WW = ww;
  }

  @action changeRescale(rescaleSlope: any, rescaleIntercept: any) {
    this.rescaleSlope = rescaleSlope;
    this.rescaleIntercept = rescaleIntercept;
  }

  @action changeBoxSize(value: { x: number; y: number; z: number }) {
    this.boxSize = value;
  }

  @action changePixelSpacing(value: { x: number; y: number; z: number }) {
    this.pixelSpacing = value;
  }

  @action setPatientId(value) {
    this.patientId = value;
  }

  @action setPatientName(value) {
    this.patientName = value;
  }

  @action setInstitutionName(value) {
    this.institutionName = value;
  }

  @action setSeriesNumber(value) {
    this.seriesNumber = value;
  }

  @action setPatientBirthDate(value) {
    this.patientBirthDate = value;
  }

  @action changeLoading(loading: boolean) {
    this.loading = loading;
  }
}

export default new ImageArrayModel();
