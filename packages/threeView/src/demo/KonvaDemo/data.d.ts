/*
 * @Author: Meng Tian
 * @Date: 2021-07-13 21:59:30
 * @Description: Do not edit
 */
export interface ImgProps {
  // 画布的大小，尺寸
  StageWidth: number= 800;
  StageHeight: number=600;
  StageScale: number=1;

  // 图片的尺寸
  imageWidth: number;
  imageHeight: number;

  // 图片的坐标
  imageX: number=0;
  imageY: number=0;

  // 图片数量
  maxIndex: number=10;

  // 当前图片下标
  imgIndex: number=0;

  // 图片数据
  imgData: any;
}
