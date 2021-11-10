/*
 * @Author: linkenzone
 * @Date: 2021-07-22 14:57:08
 * @Descripttion:
 * daikon库 来做加载dicom的类
 * 但是这个库本身不完善，部分格式似乎不支持
 */

import type { DataSet } from 'dicom-parser';
import dicomParser, { readFixedString } from 'dicom-parser';
import { convertBytes } from 'dicom-character-set';

const toHexString = (numberArray) => {
  return (
    numberArray[0].toString(16).padStart(4, '0') + numberArray[1].toString(16).padStart(4, '0')
  );
};

const arrayToTag = (numberArray) => {
  return `x${toHexString(numberArray)}`;
};

// metadata
const TAG_TRANSFER_SYNTAX = [0x0002, 0x0010];
const TAG_META_LENGTH = [0x0002, 0x0000];

// sublists
const TAG_SUBLIST_ITEM = [0xfffe, 0xe000];
const TAG_SUBLIST_ITEM_DELIM = [0xfffe, 0xe00d];
const TAG_SUBLIST_SEQ_DELIM = [0xfffe, 0xe0dd];

// image dims
const TAG_ROWS = [0x0028, 0x0010];
const TAG_COLS = [0x0028, 0x0011];
const TAG_ACQUISITION_MATRIX = [0x0018, 0x1310];
const TAG_NUMBER_OF_FRAMES = [0x0028, 0x0008];
const TAG_NUMBER_TEMPORAL_POSITIONS = [0x0020, 0x0105];

// voxel dims
const TAG_PIXEL_SPACING = [0x0028, 0x0030];
const TAG_SLICE_THICKNESS = [0x0018, 0x0050];
const TAG_SLICE_GAP = [0x0018, 0x0088];
const TAG_TR = [0x0018, 0x0080];
const TAG_FRAME_TIME = [0x0018, 0x1063];

// datatype
const TAG_BITS_ALLOCATED = [0x0028, 0x0100];
const TAG_BITS_STORED = [0x0028, 0x0101];
const TAG_PIXEL_REPRESENTATION = [0x0028, 0x0103];
const TAG_HIGH_BIT = [0x0028, 0x0102];
const TAG_PHOTOMETRIC_INTERPRETATION = [0x0028, 0x0004];
const TAG_SAMPLES_PER_PIXEL = [0x0028, 0x0002];
const TAG_PLANAR_CONFIG = [0x0028, 0x0006];
const TAG_PALETTE_RED = [0x0028, 0x1201];
const TAG_PALETTE_GREEN = [0x0028, 0x1202];
const TAG_PALETTE_BLUE = [0x0028, 0x1203];

// data scale
const TAG_DATA_SCALE_SLOPE = [0x0028, 0x1053];
const TAG_DATA_SCALE_INTERCEPT = [0x0028, 0x1052];
const TAG_DATA_SCALE_ELSCINT = [0x0207, 0x101f];
const TAG_PIXEL_BANDWIDTH = [0x0018, 0x0095];

// range
const TAG_IMAGE_MIN = [0x0028, 0x0106];
const TAG_IMAGE_MAX = [0x0028, 0x0107];
const TAG_WINDOW_CENTER = [0x0028, 0x1050];
const TAG_WINDOW_WIDTH = [0x0028, 0x1051];

// descriptors
const TAG_SPECIFIC_CHAR_SET = [0x0008, 0x0005];
const TAG_PATIENT_NAME = [0x0010, 0x0010];
const TAG_PATIENT_ID = [0x0010, 0x0020];
const TAG_STUDY_DATE = [0x0008, 0x0020];
const TAG_STUDY_TIME = [0x0008, 0x0030];
const TAG_STUDY_DES = [0x0008, 0x1030];
const TAG_IMAGE_TYPE = [0x0008, 0x0008];
const TAG_IMAGE_COMMENTS = [0x0020, 0x4000];
const TAG_SEQUENCE_NAME = [0x0018, 0x0024];
const TAG_MODALITY = [0x0008, 0x0060];

// session ID
const TAG_FRAME_OF_REF_UID = [0x0020, 0x0052];
// study ID
const TAG_STUDY_UID = [0x0020, 0x000d];
// volume ID
const TAG_SERIES_DESCRIPTION = [0x0008, 0x103e];
const TAG_SERIES_INSTANCE_UID = [0x0020, 0x000e];
const TAG_SERIES_NUMBER = [0x0020, 0x0011];
const TAG_ECHO_NUMBER = [0x0018, 0x0086];
const TAG_TEMPORAL_POSITION = [0x0020, 0x0100];
// slice ID
const TAG_IMAGE_NUM = [0x0020, 0x0013];
const TAG_SLICE_LOCATION = [0x0020, 0x1041];
// orientation
const TAG_IMAGE_ORIENTATION = [0x0020, 0x0037];
const TAG_IMAGE_POSITION = [0x0020, 0x0032];
const TAG_SLICE_LOCATION_VECTOR = [0x0018, 0x2005];
// LUT shape
const TAG_LUT_SHAPE = [0x2050, 0x0020];
// pixel data
const TAG_PIXEL_DATA = [0x7fe0, 0x0010];

/**
 * @description: daikon中需要使用的都在这个类中
 */
export default class DicomParserHelper {
  // daikon 中的image 类型
  private dataSet: DataSet;

  /**
   * @description: 构建函数
   * @param {*}
   * @return {*}
   */
  constructor(byteArray?: Uint8Array) {
    if (byteArray) {
      this.dataSet = dicomParser.parseDicom(byteArray);
    }
  }

  /**
   * @description: 设置数据源
   * @param {DataView} dataFile
   * @return {*}
   */
  setDataFile(byteArray: Uint8Array) {
    try {
      this.dataSet = dicomParser.parseDicom(byteArray);
    } catch (err: any) {
      if (err.dataSet) {
        this.dataSet = err.dataSet;
      }
      console.log('err', err);
    }
    // console.log('this.image', this.image);
  }

  /**
   * @description: x轴宽度
   * @param {*}
   * @return {*}
   */
  get cols(): number {
    return this.dataSet ? this.dataSet.uint16(arrayToTag(TAG_COLS)) : null;
  }

  /**
   * @description: y轴宽度
   * @param {*}
   * @return {*}
   */
  get rows(): number {
    return this.dataSet ? this.dataSet.uint16(arrayToTag(TAG_ROWS)) : null;
  }

  /**
   * @description: 获取 bitsAllocated
   * @param {*}
   * @return {*}
   */
  get bitsAllocated(): number {
    return this.dataSet ? this.dataSet.uint16(arrayToTag(TAG_BITS_ALLOCATED)) : null;
  }

  /**
   * @description: 获取 rawData
   * @param {*}
   * @return {*}
   */
  get rawData(): any {
    if (!this.dataSet) {
      return null;
    }
    const pixelDataElement = this.dataSet.elements.x7fe00010;
    console.log('pixelDataElement', pixelDataElement);
    const pixelData = new Uint16Array(
      this.dataSet.byteArray.buffer,
      pixelDataElement.dataOffset,
      pixelDataElement.length / 2,
    );
    console.log('pixelData', pixelData);
    return pixelData;
  }

  /**
   * @description: 获取 samples per pixel
   * @param {*}
   * @return {*}
   */
  get samPerPixel(): number {
    const samPerPixel = this.dataSet.uint16(arrayToTag(TAG_SAMPLES_PER_PIXEL), 0);
    return samPerPixel;
  }

  /**
   * @description: 获取 pixelRepresentation
   * @param {*}
   * @return {*}
   */
  get pixelRepresentation(): number {
    const pixelRepresentation = this.dataSet.uint16(arrayToTag(TAG_PIXEL_REPRESENTATION), 0);
    return pixelRepresentation;
  }

  /**
   * @description: 获取 window center
   * @param {*}
   * @return {*}
   */
  get windowCenter(): number {
    const tagWinCen = this.dataSet.floatString(arrayToTag(TAG_WINDOW_CENTER), 0);
    return tagWinCen;
  }

  /**
   * @description: 获取 window Width
   * @param {*}
   * @return {*}
   */
  get windowWidth(): number {
    const tagWinWid = this.dataSet.floatString(arrayToTag(TAG_WINDOW_WIDTH), 0);
    return tagWinWid;
  }

  /**
   * @description: 获取 rescaleIntercept
   * @param {*}
   * @return {*}
   */
  get rescaleIntercept(): number {
    const rescaleIntercept = this.dataSet.floatString(arrayToTag(TAG_DATA_SCALE_INTERCEPT), 0);
    return rescaleIntercept;
  }

  /**
   * @description: 获取 rescaleSlope
   * @param {*}
   * @return {*}
   */
  get rescaleSlope(): number {
    const rescaleSlope = this.dataSet.floatString(arrayToTag(TAG_DATA_SCALE_SLOPE), 0);
    return rescaleSlope;
  }

  /**
   * @description: 获取 rescaleType
   * @param {*}
   * @return {*}
   */
  get rescaleType() {
    const TAG_RESCALE_TYPE = [0x0028, 0x1054];
    const rescaleType = this.dataSet.string(arrayToTag(TAG_RESCALE_TYPE), 0) === 'HU';
    return rescaleType;
  }

  /**
   * @description: 获取 pixelSpacing
   * @param {*}
   * @return {*}
   */
  get pixelSpacing(): number[] {
    if (this.dataSet) {
      return [
        this.dataSet.floatString(arrayToTag(TAG_PIXEL_SPACING), 0),
        this.dataSet.floatString(arrayToTag(TAG_PIXEL_SPACING), 1),
      ];
    }
    return null;
  }

  /**
   * @description: 获取 sliceThickness
   * @param {*}
   * @return {*}
   */
  get sliceThickness(): number {
    if (this.dataSet) {
      return this.dataSet.floatString(arrayToTag(TAG_SLICE_THICKNESS), 0);
    }
    return null;
  }

  /**
   * @description: 获取 ImagePosition
   * @param {*}
   * @return {*}
   */
  get imagePosition(): number[] {
    if (this.dataSet) {
      return [
        this.dataSet.floatString(arrayToTag(TAG_IMAGE_POSITION), 0),
        this.dataSet.floatString(arrayToTag(TAG_IMAGE_POSITION), 1),
        this.dataSet.floatString(arrayToTag(TAG_IMAGE_POSITION), 2),
      ];
    }
    return null;
  }

  /**
   * @description: 获取 PatientId
   * @param {*}
   * @return {*}
   */
  get patientID(): number {
    if (this.dataSet) {
      return this.dataSet.intString(arrayToTag(TAG_PATIENT_ID), 0);
    }
    return null;
  }

  /**
   * @description: 获取 PatientName
   * @param {*}
   * @return {*}
   */
  get patientName(): String {
    if (this.dataSet) {
      return this.dataSet.string(arrayToTag(TAG_PATIENT_NAME), 0);
    }
    return null;
  }

  /**
   * @description: 获取 IntitutionName
   * @param {*}
   * @return {*}
   */
  get institutionName(): String {
    const TAG_INSTITUTION_NAME = [0x0008, 0x0080];
    const element = this.dataSet.elements[arrayToTag(TAG_INSTITUTION_NAME)];
    const byteArray = new Uint8Array(
      this.dataSet.byteArray.buffer,
      element.dataOffset,
      element.length,
    );
    return convertBytes(this.dataSet.string(arrayToTag(TAG_SPECIFIC_CHAR_SET)), byteArray);
  }

  /**
   * @description: 获取 SeriesNumber
   * @param {*}
   * @return {*}
   */
  get seriesNumber(): number {
    if (this.dataSet) {
      return this.dataSet.intString(arrayToTag(TAG_SERIES_NUMBER), 0);
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
    return this.dataSet.string(arrayToTag(TAG_BIRTH_DATE), 0).slice(0, 10);
  }
}
