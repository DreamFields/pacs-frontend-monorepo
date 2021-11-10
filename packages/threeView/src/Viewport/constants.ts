/*
 * @Author: Meng Tian
 * @Date: 2021-07-17 10:36:28
 * @Description: Do not edit
 */
export const ToolType = {
  // -----------view2dTool-----------
  IMG_MOVE: 'IMG_MOVE', // 移动
  IMG_AUTO: 'IMG_AUTO', // 自适应
  IMG_RESET: 'IMG_RESET', // 重置
  FLIP_HORIZONTAL: 'FLIP_HORIZONTAL', // 水平翻转
  FLIP_VERTICAL: 'FLIP_VERTICAL', // 垂直翻转
  CLOCKWISE_ROTATION: 'CLOCKWISE_ROTATION', // 顺时针旋转
  CONTRO_CLOCKWISE_ROTATION: 'CONTRO_CLOCKWISE_ROTATION', // 逆时针旋转
  MAGNIFY: 'MAGNIFY', // 放大镜
  CHANGE_WWWL: 'CHANGE_WWWL', // 调节窗宽窗位
  ZOOM:'ZOOM', // 缩放

  // -----------measureTool-----------
  REGIONS: 'REGIONS', // 画笔
  ARROWS: 'ARROWS', // 箭头
  RULER: 'RULER',
  CLEAR: 'CLEAR', // 清除标记
  TOOL_RESET:'TOOL_RESET', // 工具复原，清除掉所有的标注和标尺信息
};

export const ToolTypeMap = {
  view2dTool: {
    IMG_MOVE: { val: 'IMG_MOVE', text: '移动', isCheck: true },
    IMG_RESET: { val: 'IMG_RESET', text: '重置', isCheck: false },
    FLIP_HORIZONTAL: { val: 'FLIP_HORIZONTAL', text: '水平翻转', isCheck: true },
    FLIP_VERTICAL: { val: 'FLIP_VERTICAL', text: '垂直翻转', isCheck: true },
    CLOCKWISE_ROTATION: { val: 'CLOCKWISE_ROTATION', text: '顺时旋转', isCheck: true },
    CONTRO_CLOCKWISE_ROTATION: { val: 'CONTRO_CLOCKWISE_ROTATION', text: '逆时旋转', isCheck: true },
    MAGNIFY: { val: 'MAGNIFY', text: '放大镜', isCheck: true },
    CHANGE_WWWL: { val: 'CHANGE_WWWL', text: '调节窗宽窗位', isCheck: true },
  },
  measureTool: {
    REGIONS: { val: 'REGIONS', text: '画笔', isCheck: true },
    ARROWS: { val: 'ARROWS', text: '箭头', isCheck: true },
    RULER: { val: 'RULER', text: '标尺', isCheck: true },
    CLEAR: { val: 'CLEAR', text: '清除', isCheck: true },
    TOOL_RESET: { val: 'TOOL_RESET', text: '复原', isCheck: true },
  },
};

export type measurementType = {
  viewType: string; // 视图的类型
  id: number; // 标注信息id
  labelType: string; // 标注类型：region、arrow、ruler...
  sliceNum: number; // 所属图片的下标
  labelText: string; // 标注名
  data: any; // 标注数据
};

interface initImgType {
  StageWidth?: number; // 画布的大小
  StageHeight?: number;

  StageScale?: number; // 默认缩放倍数

  imageWidth?: number; // 图片的尺寸
  imageHeight?: number;

  imageX?: number; // 图片的坐标
  imageY?: number;

  rotation: number; // 当前顺时针旋转角度

  isFlipHorizontal: boolean; // 是否是水平翻转状态

  isFlipVertical: boolean; // 是否是垂直翻转状态
}

export const initImgState: initImgType = {
  StageWidth: 0, // 画布的大小
  StageHeight: 0,

  StageScale: 1, // 默认缩放倍数

  imageWidth: 0, // 图片的尺寸
  imageHeight: 0,

  imageX: 0, // 图片的坐标
  imageY: 0,

  rotation: 0, // 当前顺时针旋转角度

  isFlipHorizontal: false, // 是否是水平翻转状态

  isFlipVertical: false, // 是否是垂直翻转状态
};

// 视图的类型
export const viewType = ['Saggital', 'Coronal', 'Transverse'];
