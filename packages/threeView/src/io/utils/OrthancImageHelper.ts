/*
 * @Author: Meng Tian
 * @Date: 2021-09-22 15:26:57
 * @Description: 利用Orthanc解析数据，但某些tags获取不到，或者需要特殊处理
 */

export default class OrthancImageHelper {
  private tagsData: any;
  private pixSrc: any;

  /**
   * @description: 构建函数
   * @param {*}
   * @return {*}
   */
  constructor(tagsData?: any, dataFile?: string) {
    if (tagsData) {
      this.tagsData = tagsData;
    }
    if (dataFile) {
      /* const buf = new TextEncoder().encode(dataFile);

      const ar16 = new Uint16Array(
        buf.buffer,
        buf.byteOffset,
        buf.byteLength / Uint16Array.BYTES_PER_ELEMENT,
      );
      this.pixSrc = ar16; */
      console.log('dataFile.length', dataFile.length);
      const buf = new ArrayBuffer(dataFile.length);
      const bufView = new Uint16Array(buf);
      for (let i = 0, strLen = dataFile.length; i < strLen; i++) {
        bufView[i] = dataFile.charCodeAt(i);
      }
      this.pixSrc = buf;
    }
  }

  /**
   * @description: 设置tags值
   * @param {any} tagsData
   * @return {*}
   */
  setTags(tagsData: any) {
    this.tagsData = tagsData;
  }

  /**
   * @description: 设置像素值
   * @param {string} pixStr
   * @return {*}
   */
  setPixels(pixStr: string) {
    // console.log(object)
    const buf = new ArrayBuffer(pixStr.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = pixStr.length; i < strLen; i++) {
      bufView[i] = pixStr.charCodeAt(i);
    }
    this.pixSrc = new Uint16Array(buf);
  }

  /**
   * @description: 得到像素值
   * @param {*}
   * @return {*}
   */
  get pixels(): any {
    return this.pixSrc;
  }

  /**
   * @description: x轴宽度
   * @param {*}
   * @return {*}
   */
  get cols(): number {
    return Number(this.tagsData['0028,0011'].Value);
  }

  /**
   * @description: y轴宽度
   * @param {*}
   * @return {*}
   */
  get rows(): number {
    return Number(this.tagsData['0028,0010'].Value);
  }

  /**
   * @description: 获取 bitsAllocated
   * @param {*}
   * @return {*}
   */
  get bitsAllocated(): number {
    return Number(this.tagsData['0028,0100'].Value);
  }

  /**
   * @description: 获取 samples per pixel
   * @param {*}
   * @return {*}
   */
  get samPerPixel(): number {
    return Number(this.tagsData['0028,0002'].Value);
  }

  /**
   * @description: 获取 pixelRepresentation
   * @param {*}
   * @return {*}
   */
  get pixelRepresentation(): number {
    return Number(this.tagsData['0028,0103'].Value);
  }

  /**
   * @description: 获取 window center
   * @param {*}
   * @return {*}
   */
  get windowCenter(): number {
    return Number(this.tagsData['0028,1050'].Value);
  }

  /**
   * @description: 获取 window Width
   * @param {*}
   * @return {*}
   */
  get windowWidth(): number {
    return Number(this.tagsData['0028,1051'].Value);
  }

  /**
   * @description: 获取 rescaleIntercept
   * @param {*}
   * @return {*}
   */
  get rescaleIntercept(): number {
    return Number(this.tagsData['0028,1052'] ? this.tagsData['0028,1052'].Value : null);
  }

  /**
   * @description: 获取 rescaleSlope
   * @param {*}
   * @return {*}
   */
  get rescaleSlope(): number {
    return Number(this.tagsData['0028,1053'] ? this.tagsData['0028,1053'].Value : null);
  }

  /**
   * @description: 获取 rescaleType
   * @param {*}
   * @return {*}
   */
  get rescaleType() {
    return Number(this.tagsData['0028,1054'] ? this.tagsData['0028,1054'].Value : null);
  }

  /**
   * @description: 获取 pixelSpacing
   * @param {*}
   * @return {*}
   */
  get pixelSpacing(): number[] {
    const str = this.tagsData['0028,0030'].Value;
    const res = Array(2);
    res[0] = Number(str.split('\\')[0]);
    res[1] = Number(str.split('\\')[1]);
    console.log('pixelSpacing', res);
    return res;
  }

  /**
   * @description: 获取 sliceThickness
   * @param {*}
   * @return {*}
   */
  get sliceThickness(): number {
    return Number(this.tagsData['0018,0050'].Value);
  }

  /**
   * @description: 获取 ImagePosition
   * @param {*}
   * @return {*}
   */
  get imagePosition(): number[] {
    const str = this.tagsData['0020,0032'].Value;
    const res = Array(3);
    res[0] = Number(str.split('\\')[0]);
    res[1] = Number(str.split('\\')[1]);
    res[2] = Number(str.split('\\')[2]);
    return res;
  }

  /**
   * @description: 获取 PatientId
   * @param {*}
   * @return {*}
   */
  get patientID(): number {
    return Number(this.tagsData['0010,0020'].Value);
  }

  /**
   * @description: 获取 PatientName
   * @param {*}
   * @return {*}
   */
  get patientName(): String {
    return this.tagsData['0010,0010'].Value;
  }

  /**
   * @description: 获取 IntitutionName
   * @param {*}
   * @return {*}
   */
  get institutionName(): String {
    return this.tagsData['0008,0080'].Value;
  }

  /**
   * @description: 获取 SeriesNumber
   * @param {*}
   * @return {*}
   */
  get seriesNumber(): number {
    return Number(this.tagsData['0020,0011'].Value);
  }

  /**
   * @description: 获取 PatientBirthDate
   * @param {*}
   * @return {*}
   */
  get patientBirthDate(): string {
    return this.tagsData['0010,0030'].Value;
  }
}
