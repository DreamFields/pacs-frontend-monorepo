/* eslint-disable prefer-destructuring */
/*
 * @Author: linkenzone
 * @Date: 2021-07-22 14:57:08
 * @Descripttion: 
 * daikon库 来做加载dicom的类
 * 但是这个库本身不完善，部分格式似乎不支持
 */

import daikon from '../../../lib/daikon';

/**
 * @description: daikon中需要使用的都在这个类中
 */
export default class DaikonImageHelper {
  // daikon 中的image 类型
  private image: any;

  /**
   * @description: 构建函数
   * @param {*}
   * @return {*}
   */
  constructor(dataFile?: DataView) {
    if (dataFile) {
      this.image = daikon.Series.parseImage(dataFile);
    }
  }

  /**
   * @description: 设置数据源
   * @param {DataView} dataFile
   * @return {*}
   */
  setDataFile(dataFile: DataView) {
    this.image = daikon.Series.parseImage(dataFile);
    // console.log('this.image', this.image);
  }

  /**
   * @description: x轴宽度
   * @param {*}
   * @return {*}
   */
  get cols(): number {
    return this.image ? this.image.getCols() : null;
  }

  /**
   * @description: y轴宽度
   * @param {*}
   * @return {*}
   */
  get rows(): number {
    return this.image ? this.image.getRows() : null;
  }

  /**
   * @description: 获取 bitsAllocated
   * @param {*}
   * @return {*}
   */
  get bitsAllocated(): number {
    return this.image ? this.image.getBitsAllocated() : null;
  }

  /**
   * @description: 获取 rawData
   * @param {*}
   * @return {*}
   */
  get rawData(): any {
    return this.image ? this.image.getRawData() : null;
  }

  /**
   * @description: 获取 samples per pixel
   * @param {*}
   * @return {*}
   */
  get samPerPixel(): number {
    const ind =
      daikon.Utils.dec2hex(daikon.Tag.TAG_SAMPLES_PER_PIXEL[0]) +
      daikon.Utils.dec2hex(daikon.Tag.TAG_SAMPLES_PER_PIXEL[1]);
    let samPerPixel = -1;
    const tagSamPerPix = this.image.tags[ind];
    if (tagSamPerPix !== undefined) {
      const { value } = tagSamPerPix;
      samPerPixel = value[0];
    }
    return samPerPixel;
  }

  /**
   * @description: 获取 pixelRepresentation
   * @param {*}
   * @return {*}
   */
  get pixelRepresentation(): number {
    const ind =
      daikon.Utils.dec2hex(daikon.Tag.TAG_PIXEL_REPRESENTATION[0]) +
      daikon.Utils.dec2hex(daikon.Tag.TAG_PIXEL_REPRESENTATION[1]);
    let pixelRepresentation = null;
    const tagPixRep = this.image.tags[ind];
    if (tagPixRep !== undefined) {
      pixelRepresentation = tagPixRep.value[0];
    }
    return pixelRepresentation;
  }

  /**
   * @description: 获取 window center
   * @param {*}
   * @return {*}
   */
  get windowCenter(): number {
    const ind =
      daikon.Utils.dec2hex(daikon.Tag.TAG_WINDOW_CENTER[0]) +
      daikon.Utils.dec2hex(daikon.Tag.TAG_WINDOW_CENTER[1]);
    const tagWinCen = this.image.tags[ind];
    let windowCenter = null;
    if (tagWinCen !== undefined) {
      windowCenter = tagWinCen.value[0];
    }
    return windowCenter;
  }

  /**
   * @description: 获取 window Width
   * @param {*}
   * @return {*}
   */
  get windowWidth(): number {
    const ind =
      daikon.Utils.dec2hex(daikon.Tag.TAG_WINDOW_WIDTH[0]) +
      daikon.Utils.dec2hex(daikon.Tag.TAG_WINDOW_WIDTH[1]);
    const tagWinWid = this.image.tags[ind];
    let windowWidth = null;
    if (tagWinWid !== undefined) {
      windowWidth = tagWinWid.value[0];
    }
    return windowWidth;
  }

  /**
   * @description: 获取 rescaleIntercept
   * @param {*}
   * @return {*}
   */
  get rescaleIntercept(): number {
    const ind =
      daikon.Utils.dec2hex(daikon.Tag.TAG_DATA_SCALE_INTERCEPT[0]) +
      daikon.Utils.dec2hex(daikon.Tag.TAG_DATA_SCALE_INTERCEPT[1]);
    const tagResInt = this.image.tags[ind];
    let rescaleIntercept = null;
    if (tagResInt !== undefined) {
      rescaleIntercept = tagResInt.value[0];
    }
    return rescaleIntercept;
  }

  /**
   * @description: 获取 rescaleSlope
   * @param {*}
   * @return {*}
   */
  get rescaleSlope(): number {
    const ind =
      daikon.Utils.dec2hex(daikon.Tag.TAG_DATA_SCALE_SLOPE[0]) +
      daikon.Utils.dec2hex(daikon.Tag.TAG_DATA_SCALE_SLOPE[1]);
    const tagResSlo = this.image.tags[ind];
    let rescaleSlope = null;
    if (tagResSlo !== undefined) {
      rescaleSlope = tagResSlo.value[0];
    }
    return rescaleSlope;
  }

  /**
   * @description: 获取 rescaleType
   * @param {*}
   * @return {*}
   */
  get rescaleType() {
    const TAG_RESCALE_TYPE = [0x0028, 0x1054];
    let rescaleType = null;
    const ind =
      daikon.Utils.dec2hex(TAG_RESCALE_TYPE[0]) + daikon.Utils.dec2hex(TAG_RESCALE_TYPE[1]);
    const tagResTyp = this.image.tags[ind];
    if (tagResTyp !== undefined) {
      if (tagResTyp.value !== null && tagResTyp.value[0] === 'HU') {
        rescaleType = true;
      }
    }
    return rescaleType;
  }

  /**
   * @description: 获取 pixelSpacing
   * @param {*}
   * @return {*}
   */
  get pixelSpacing(): number[] {
    if (this.image) {
      return this.image.getPixelSpacing();
    }
    return null;
  }

  /**
   * @description: 获取 sliceThickness
   * @param {*}
   * @return {*}
   */
  get sliceThickness(): number {
    if (this.image) {
      return this.image.getSliceThickness();
    }
    return null;
  }

  /**
   * @description: 获取 ImagePosition
   * @param {*}
   * @return {*}
   */
  get imagePosition(): number[] {
    if (this.image) {
      return this.image.getImagePosition();
    }
    return null;
  }

  /**
   * @description: 获取 PatientId
   * @param {*}
   * @return {*}
   */
  get patientID(): number {
    if (this.image) {
      return this.image.getPatientID();
    }
    return null;
  }

  /**
   * @description: 获取 PatientName
   * @param {*}
   * @return {*}
   */
  get patientName(): String {
    if (this.image) {
      return this.image.getPatientName();
    }
    return null;
  }

  /**
   * @description: 获取 IntitutionName
   * @param {*}
   * @return {*}
   */
  get institutionName(): String {
    const TAG_RESCALE_TYPE = [0x0008, 0x0080];
    let institutionName = null;
    const ind =
      daikon.Utils.dec2hex(TAG_RESCALE_TYPE[0]) + daikon.Utils.dec2hex(TAG_RESCALE_TYPE[1]);
    const tagRes = this.image.tags[ind];
    if (tagRes !== undefined) {
      institutionName = tagRes.value[0];
    }
    return institutionName;
  }

  /**
   * @description: 获取 SeriesNumber
   * @param {*}
   * @return {*}
   */
  get seriesNumber(): number {
    if (this.image) {
      return this.image.getSeriesNumber();
    }
    return null;
  }

  /**
   * @description: 获取 PatientBirthDate
   * @param {*}
   * @return {*}
   */
  get patientBirthDate(): string {
    // console.log('patientBirthDate---');
    const TAG_BIRTH_DATE = [0x0010, 0x0030];
    let birthDate = null;
    const ind = daikon.Utils.dec2hex(TAG_BIRTH_DATE[0]) + daikon.Utils.dec2hex(TAG_BIRTH_DATE[1]);
    const tagRes = this.image.tags[ind];
    // console.log('tagRes', tagRes);
    if (tagRes !== undefined && tagRes.value) {
      birthDate = tagRes.value[0].toISOString().slice(0, 10);
    }
    return birthDate;
  }
}
