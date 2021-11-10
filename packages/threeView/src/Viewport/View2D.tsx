/* eslint-disable no-plusplus */
/* eslint-disable no-restricted-properties */
/* eslint-disable @typescript-eslint/no-invalid-this */
/* eslint-disable react-hooks/exhaustive-deps */
/*
 * @Author: linkenzone
 * @Date: 2021-07-22 22:59:57
 * @Descripttion: Do not edit
 */
/* eslint-disable no-bitwise */

import React, { useRef, useState, useEffect, useContext } from 'react';
import { observer } from 'mobx-react';
// import { getDicomSeriesImageData } from '../io/DicomLoader';
import ImageArray from '../store/ImageArray';
import type { measurementType } from './constants';
import { ToolType, viewType, initImgState } from './constants';

import Regions from './tools/Regions';
import Arrows from './tools/Arrows';
import Rulers from './tools/Rulers';
import LabelText from './tools/LabelText';

import { useResizeDetector } from 'react-resize-detector';

import { Layout, Slider, Spin } from 'antd';

import { Layer, Stage, Image, Text } from 'react-konva';
import Konva from 'konva';
import { ColorTable, lookUpTable } from '../util/colorTable';
import { rotateMatrix, relativeZoom } from '../util/transform';
import { clamp } from '../util/clamp';

import View2DState from '../store/View2DState';
import type { DicomViewInfo } from './ui/Overlay';
import Overlay from './ui/Overlay';
import styles from './style.less';
import { Content } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';

import getLut from './rendering/getLut';

type View2DProps = {
  type?: string;
  uuid?: string;
};
type Position = {
  x?: number;
  y?: number;
};

const LARGE_NUMBER = 1073741823;
let lut: number[] = [];

const View2D: React.FC<View2DProps> = observer((props) => {
  // useResizeDetector
  const { width: containerWidth, height: containerHeight, ref: containerRef } = useResizeDetector();

  // cached canvas
  const cacheCanvas = document.createElement('canvas');

  // 获取node
  const stageRef: any = useRef(); // 整个stage
  const imgLayerRef: any = useRef(); // stage下的layer，存放image、标注形状、标注文字
  const imageRef: any = useRef(); // 图片数据层
  const magnifyRef: any = useRef(); // 放大镜
  //   const labelTextRef: any = useRef(); // 标注文字层
  //   const textLayerRef: any = useRef(); // 固定图片信息层

  const stageParentRef: any = useRef(); // 整个stage

  const context: any = useRef(); // 上下文

  /* ------API整理-------
    整个stage位置不会改变
    imgLayerRef.current.x()得到该节点的左上角x坐标
    */

  // const [stageWidth, setStageWidth] = useState(0);
  // const [stageHeight, setStageHeight] = useState(0);

  const [imgCanvas, setimgCanvas] = useState(undefined);
  const [magnifyCanvas, setMagnifyCanvas] = useState(undefined);

  const [sliceNum, setSliceNum] = useState(1);
  const sliceNumRef = useRef(1);

  const [maxSliceNum, setMaxSliceNum] = useState(1);

  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);
  const [textInfo, setTextInfo] = useState<DicomViewInfo>({});

  const [isFirstAuto, setisFirstAuto] = useState(true); // 是否是第一次自适应，即第一次加载

  // const viewType = ['Saggital', 'Coronal', 'Transverse']; // 视图的类型

  const [activeView, setactiveView] = useState(undefined); // 当前激活的视图
  const [mouseLocation, setMouseLocation] = useState<Position>({ x: 0, y: 0 });
  const { type, uuid } = props;

  const store = ImageArray;
  const view2DState = View2DState;

  // 获取窗宽和窗位
  const { windowLevel, windowWidth } = view2DState.stageState;

  const { loading } = store;

  const ToImgRelativePosition = ({ x, y }: any) => {
    // const { imageWidth, imageHeight } = context.current;
    // const { imageWidth, imageHeight } = view2DState.stageState;
    if (view2DState.stageState) {
      return { x: x - imgWidth, y: y - imgHeight };
    }
    return { x: 0, y: 0 };
  };

  const getRelativePointerPosition = (node: any) => {
    // console.log('函数内的node', node);
    // 该函数将返回相对于所传递节点的指针位置;
    const transform = node.getAbsoluteTransform().copy();

    // 为了检测相对位置，我们需要进行逆变换
    transform.invert();

    // 获取指针(鼠标或触摸)位置
    const pos = node.getStage().getPointerPosition();

    // 现在我们求相对点
    return transform.point(pos);
  };

  /**
   * @description: 将图片移动到中心
   * @Param:
   * @param {any} param1
   */

  const ImgToCenter = ({ imageWidth, imageHeight, StageWidht, StageHeight }: any) => {
    return { x: (StageWidht - imageWidth) / 2, y: (StageHeight - imageHeight) / 2 };
  };

  /**
   * @return {*}
   */
  const render = (num: number) => {
    // 获取窗宽和窗位
    const { windowLevel: wl, windowWidth: ww } = view2DState.stageState;

    console.time('前置数据');
    const {
      dataArray,
      pixelArray_x,
      pixelArray_y,
      rescaleSlope,
      rescaleIntercept,
      boxSize,
      xDim,
      yDim,
      zDim,
    } = store;
    // 改换为实际尺寸
    let wScreen = xDim;
    let hScreen = yDim;
    let imgPixels = null;
    let p = 0;
    // 根据dicom数据尺寸和视角，调整窗口
    if (type === viewType[0]) {
      const yzRatio = boxSize.y / boxSize.z;
      const newHScreen = Math.floor(wScreen / yzRatio);
      if (newHScreen > hScreen) {
        wScreen = Math.floor(hScreen * yzRatio);
      } else {
        hScreen = newHScreen;
      }
    } else if (type === viewType[1]) {
      const xzRatio = boxSize.x / boxSize.z;
      const newHScreen = Math.floor(wScreen / xzRatio);
      if (newHScreen > hScreen) {
        wScreen = Math.floor(hScreen * xzRatio);
      } else {
        hScreen = newHScreen;
      }
    } else {
      const xyRatio = boxSize.x / boxSize.y;
      const newHScreen = Math.floor(wScreen / xyRatio);
      if (newHScreen > hScreen) {
        wScreen = Math.floor(hScreen * xyRatio);
      } else {
        hScreen = newHScreen;
      }
    }
    hScreen = hScreen > 0 ? hScreen : 1;
    const numPixels = wScreen * hScreen;
    imgPixels = new Uint8ClampedArray(numPixels * 4);
    console.timeEnd('前置数据');

    // TODO 这个地方在实际渲染的时候很慢，需要优化
    console.time('图片生成');

    // num 序号需要减1
    num -= 1;

    console.log('wScreen', wScreen);
    console.log('hScreen', hScreen);
    console.log('num', num);

    let canvasImageDataIndex = 0;
    let storedPixelDataIndex = 0;

    // 生成像素
    while (storedPixelDataIndex < numPixels) {
      let x = 0;
      let y = 0;
      let z = 0;
      if (type === viewType[0]) {
        x = num;
        y = storedPixelDataIndex % wScreen;
        z = storedPixelDataIndex / wScreen;
        y = Math.floor(y * (yDim / wScreen));
        z = Math.floor(z * (zDim / hScreen));
      } else if (type === viewType[1]) {
        x = storedPixelDataIndex % wScreen;
        y = num;
        z = storedPixelDataIndex / wScreen;
        x = Math.floor(x * (xDim / wScreen));
        z = Math.floor(z * (zDim / hScreen));
      } else {
        x = storedPixelDataIndex % wScreen;
        y = storedPixelDataIndex / wScreen;
        z = num;
        x = Math.floor(x * (xDim / wScreen));
        y = Math.floor(y * (yDim / hScreen));
      }

      const pos = x + y * store.xDim + z * store.xDim * store.yDim;

      // const valScaled = dataArray[pos] * rescaleSlope + rescaleIntercept;
      // let val = Math.floor(((valScaled - wl + ww / 2) * 255) / ww);
      // val = val >= 0 ? val : 0;
      // val = val < 255 ? val : 255;

      // todo 每次读表都会重新计算结果，可以建立一个0-255的映射缓存
      // const rgb = lookUpTable(val, view2DState.stageState.colorTableIndex);

      // p = index * 4;
      // imgPixels[p] = rgb.r;
      // imgPixels[p + 1] = rgb.g;
      // imgPixels[p + 2] = rgb.b;
      // imgPixels[p + 3] = 255;

      const pixelValue = lut[dataArray[pos]];
      imgPixels[canvasImageDataIndex++] = pixelValue;
      imgPixels[canvasImageDataIndex++] = pixelValue;
      imgPixels[canvasImageDataIndex++] = pixelValue;
      imgPixels[canvasImageDataIndex++] = 255;
      storedPixelDataIndex++;
    }

    // for (let i = 0; i < numPixels; i += 1) {
    //   generatePixel(i);
    // }

    console.timeEnd('图片生成');

    console.time('图片显示');
    cacheCanvas.width = wScreen;
    cacheCanvas.height = hScreen;
    const ctxCanvas = cacheCanvas.getContext('2d');
    /* Uint8ClampedArray（8位无符号整型固定数组） 类型化数组表示一个由值固定在0-255区间的8位无符号整型组成的数组 */
    const iData = new ImageData(new Uint8ClampedArray(imgPixels), wScreen, hScreen);

    ctxCanvas.putImageData(iData, 0, 0);

    setimgCanvas(cacheCanvas);
    stageRef.current.batchDraw();

    setImgWidth(wScreen);
    setImgHeight(hScreen);
    view2DState.setStateByView(type, { imageWidth: wScreen, imageHeight: hScreen });
    console.timeEnd('图片显示');

    return { imgW: wScreen, imgH: hScreen };
  };

  /**
   * @description: 旋转layer
   * @param {any} layer 全局layerRef
   * @param {*} rotate 旋转角度，逆时针-，顺时针+
   * @return {*}
   */
  const rotateLayer = (layer: any, rotate) => {
    const box = layer.findOne('Image').getClientRect();
    // 问题出在box上，得到的是一个包括img的最小水平矩形
    /* console.log('旋转前的（x，y）', layer.x(), layer.y());
    console.log('box', box);
    console.log('旋转前的ratate',view2DState.stageState[type].rotation) */
    const center = {
      x: box.x + box.width / 2,
      y: box.y + box.height / 2,
    };
    // console.log('旋转中心点', center);
    const newPos = rotateMatrix(layer.x(), layer.y(), center, rotate);
    // console.log('新的（x，y）', newPos);
    layer.to({
      x: newPos.x,
      y: newPos.y,
      rotation: (view2DState.stageState[type].rotation + rotate + 360) % 360,
      duration: 0,
    });
    layer.batchDraw();
  };

  /**
   * @description: 将layer放缩为原来的scaleBy倍
   * @param {any} layer
   * @param {any} scaleBy
   * @param {number} duration
   * @return {*}
   */
  const zoomLayer = (layer: any, scaleBy: any, duration: number) => {
    // 获取鼠标的坐标
    const pointer = stageRef.current.getPointerPosition();
    // console.log('鼠标坐标', pointer);

    // console.log('当前的（x，y）', layer.x(), layer.y());

    const finalPos = relativeZoom(layer.x(), layer.y(), pointer, scaleBy);

    // 原来的缩放倍数
    const oldScaleX = layer.scaleX();
    const oldScaleY = layer.scaleY();

    // 缩小倍数最小为0.1
    // const newScale = Math.max(0.1, oldScale * scaleBy);
    // console.log('原来的缩放倍数：', oldScaleX, oldScaleY);
    // console.log('新的缩放倍数：',newScale)
    // if(uiState.isFlipHorizontal||uiState.isFlipVertical) return;

    // 关键要得到layer的x,y，相对于stageRef的坐标
    layer.to({
      x: finalPos.x,
      y: finalPos.y,
      scaleX: oldScaleX * scaleBy,
      scaleY: oldScaleY * scaleBy,
      duration,
    });

    // 更新 stage
    layer.batchDraw();

    // uiState.changeScale(newScale);
  };

  /**
   * @description: 工具类型改变时，根据相应状态修改layerRef，只监听翻转和旋转四种工具
   * @param {string} toolType
   * @param {any} layer
   * @return {*}
   */
  const changeLayer = (toolType: string, layer: any) => {
    switch (toolType) {
      case ToolType.FLIP_HORIZONTAL: {
        const box = layer.findOne('Image').getClientRect();
        // 当前图片的中心点
        const center = {
          x: box.x + box.width / 2,
          y: box.y + box.height / 2,
        };

        // 中心点绕stage的(x,y)逆时针旋转
        const newCenter = rotateMatrix(
          center.x,
          center.y,
          { x: layer.x(), y: layer.y() },
          -view2DState.stageState[type].rotation,
        );

        // 水平对称点
        const horizontalPos = {
          x: 2 * newCenter.x - layer.x(),
          y: layer.y(),
        };

        // 将水平对称点绕原来的stage的(x,y)顺时针旋转回来
        const finalPos = rotateMatrix(
          horizontalPos.x,
          horizontalPos.y,
          { x: layer.x(), y: layer.y() },
          view2DState.stageState[type].rotation,
        );

        layer.to({
          x: finalPos.x,
          y: finalPos.y,
          scaleX: -1 * layer.scaleX(),
          scaleY: layer.scaleY(),
          duration: 0,
        });

        // 更新 stage
        layer.batchDraw();

        // 更新state
        view2DState.setStateByView(type, {
          isFlipHorizontal: !view2DState.stageState[type].isFlipHorizontal,
        });
        break;
      }
      case ToolType.FLIP_VERTICAL: {
        const box = layer.findOne('Image').getClientRect();
        // 当前图片的中心点
        const center = {
          x: box.x + box.width / 2,
          y: box.y + box.height / 2,
        };

        // 中心点绕stage的(x,y)逆时针旋转
        const newCenter = rotateMatrix(
          center.x,
          center.y,
          { x: layer.x(), y: layer.y() },
          -view2DState.stageState[type].rotation,
        );

        // 垂直对称点
        const horizontalPos = {
          x: layer.x(),
          y: 2 * newCenter.y - layer.y(),
        };

        // 将水平对称点绕原来的stage的(x,y)顺时针旋转回来
        const finalPos = rotateMatrix(
          horizontalPos.x,
          horizontalPos.y,
          { x: layer.x(), y: layer.y() },
          view2DState.stageState[type].rotation,
        );

        layer.to({
          x: finalPos.x,
          y: finalPos.y,
          scaleX: layer.scaleX(),
          scaleY: -1 * layer.scaleY(),
          duration: 0,
        });
        // 更新 stage
        layer.batchDraw();

        // 更新state
        view2DState.setStateByView(type, {
          isFlipVertical: !view2DState.stageState[type].isFlipVertical,
        });
        break;
      }
      case ToolType.CLOCKWISE_ROTATION: {
        rotateLayer(layer, view2DState.stageState.rotationStep);
        /* view2DState.setStageState({
          type:
            (view2DState.stageState[type].rotation + view2DState.stageState.rotationStep + 360) % 360,
        }); */
        view2DState.setStateByView(type, {
          rotation:
            (view2DState.stageState[type].rotation + view2DState.stageState.rotationStep + 360) %
            360,
        });
        break;
      }
      case ToolType.CONTRO_CLOCKWISE_ROTATION: {
        rotateLayer(layer, -view2DState.stageState.rotationStep);
        view2DState.setStateByView(type, {
          rotation:
            (view2DState.stageState[type].rotation - view2DState.stageState.rotationStep + 360) %
            360,
        });
        break;
      }
      default:
        break;
    }
  };

  // const checkSize = () => {
  //   const container = stageParentRef.current;
  //   const width = container.offsetWidth;
  //   const height = container.offsetHeight;
  //   setStageWidth(width);
  //   setStageHeight(height);
  //   console.log('resize!!', stageWidth, stageHeight);
  // };

  const reRender = () => {
    render(sliceNumRef.current);
    console.log('reSize, reRender!', sliceNum, sliceNumRef.current);
  };

  const renderMagnify = (e) => {
    const canvas = document.createElement('canvas');

    // The magnifyTool class is used to find the canvas later on
    // Make sure position is absolute so the canvas can follow the mouse / touch
    canvas.classList.add(styles.magnifyTool);
    canvas.style.position = 'absolute';
    canvas.style.display = 'none';

    const magnifySize = Math.min(100, imgCanvas.width, imgCanvas.height);
    const magnificationLevel = 2;
    canvas.width = magnifySize;
    canvas.height = magnifySize;
    // 获取相对坐标
    const canvasLocation = getRelativePointerPosition(imageRef.current);
    console.log('before location', canvasLocation);
    // canvasLocation.x -= imageRef.current.x();
    // canvasLocation.y -= imageRef.current.y();
    console.log('imageLocation:', imageRef.current.x(), imageRef.current.y());
    console.log('after location', canvasLocation);
    // Constrain drag movement to zoomed image boundaries
    canvasLocation.x = clamp(
      (magnifySize * 0.5) / magnificationLevel,
      imgCanvas.width - (magnifySize * 0.5) / magnificationLevel,
      canvasLocation.x,
    );
    canvasLocation.y = clamp(
      (magnifySize * 0.5) / magnificationLevel,
      imgCanvas.height - (magnifySize * 0.5) / magnificationLevel,
      canvasLocation.y,
    );

    const copyFrom = {
      x: canvasLocation.x - (0.5 * magnifySize) / magnificationLevel,
      y: canvasLocation.y - (0.5 * magnifySize) / magnificationLevel,
    };

    copyFrom.x = Math.max(copyFrom.x, 0);
    copyFrom.y = Math.max(copyFrom.y, 0);

    console.log('copyFrom:', copyFrom);
    const magnifyContext = canvas.getContext('2d');
    magnifyContext.setTransform(1, 0, 0, 1, 0, 0);

    // magnifyContext.putImageData(
    //   imgCanvas
    //     .getContext('2d')
    //     .getImageData(
    //       copyFrom.x,
    //       copyFrom.y,
    //       magnifySize / magnificationLevel,
    //       magnifySize / magnificationLevel,
    //     ),
    //   0,
    //   0,
    // );
    // magnifyContext.scale(2, 2);
    magnifyContext.drawImage(
      imgCanvas,
      copyFrom.x,
      copyFrom.y,
      magnifySize / magnificationLevel,
      magnifySize / magnificationLevel,
      0,
      0,
      magnifySize,
      magnifySize,
    );
    // magnifyContext.clearRect(0, 0, magnifySize, magnifySize);
    // Place the magnification tool at the same location as the pointer

    // const magnifyPosition = {
    //   top: Math.max(canvasLocation.y - 0.5 * magnifySize, 0),
    //   left: Math.max(canvasLocation.x - 0.5 * magnifySize, 0),
    // };
    const magnifyPosition = {
      top: canvasLocation.y - 0.5 * magnifySize,
      left: canvasLocation.x - 0.5 * magnifySize,
    };

    // Get full magnifier dimensions with borders
    // const magnifierBox = canvas.getBoundingClientRect();
    //
    // // Constrain magnifier to canvas boundaries
    // magnifyPosition.top = Math.min(magnifyPosition.top, imgCanvas.height - magnifierBox.height);
    // magnifyPosition.left = Math.min(magnifyPosition.left, imgCanvas.width - magnifierBox.width);
    // canvas.style.top = `${magnifyPosition.top}px`;
    // canvas.style.left = `${magnifyPosition.left}px`;
    // canvas.style.display = 'block';
    setMagnifyCanvas(canvas);

    const mR = magnifyRef.current;
    mR.x(magnifyPosition.left + imageRef.current.x());
    mR.y(magnifyPosition.top + imageRef.current.y());
  };

  const destroyMagnifyCanvas = () => {
    console.log('magnifyCanvas', magnifyCanvas);
    console.log('context', magnifyCanvas.getContext('2d'));
    setMagnifyCanvas(undefined);
    magnifyRef.current.draw();
  };

  /**
   * @description: 限制图片显示范围
   * @param {any} stage
   * @param {any} newAttrs
   * @return {*}
   */
  const limitAttributes = (stage: any, newAttrs: any) => {
    const box = stage.findOne('Image').getClientRect();
    const minX = -box.width + stage.width() / 2;
    const maxX = stage.width() / 2;

    const x = Math.max(minX, Math.min(newAttrs.x, maxX));

    const minY = -box.height + stage.height() / 2;
    const maxY = stage.height() / 2;

    const y = Math.max(minY, Math.min(newAttrs.y, maxY));

    const scale = Math.max(0.05, newAttrs.scale);

    return { x, y, scale };
  };

  // #region 事件
  const onStageWheel = (e: any) => {
    view2DState.setToolType(ToolType.ZOOM);
    e.evt.preventDefault();
    if (e.evt.deltaY > 0) {
      zoomLayer(imgLayerRef.current, 0.8, 0.1);
    } else {
      zoomLayer(imgLayerRef.current, 1.2, 0.1);
    }
  };

  const onStageMouseUp = (e: any) => {
    if (activeView !== type) {
      return;
    }

    // 将鼠标设置为未按下状态
    view2DState.setStageState({ mouseDown: false });

    // TODO 后面请把代码调整到switch中
    switch (view2DState.toolType) {
      case ToolType.CHANGE_WWWL:
        console.log('调节窗宽窗位松开');
        break;
      default:
        break;
    }

    if (view2DState.toolType === ToolType.REGIONS && view2DState.measureState.isDrawing) {
      const regions = view2DState.measureState.measurement.filter(
        (val) => val.labelType === ToolType.REGIONS,
      );
      console.log('原来的', view2DState.measureState.measurement);
      const lastRegion = {
        ...regions[regions.length - 1],
      };
      const lastRegionIndex = view2DState.measureState.measurement.findIndex(
        (val) => val.id === lastRegion.id,
      );
      // 如果不足3个点，则删除
      if (lastRegion.data.length < 3) {
        view2DState.updateMeasureByIndex(lastRegionIndex, undefined);
      } else {
        // 每10个点进行采样
        let points = [lastRegion.data[0]];
        for (let i = 10; i < lastRegion.data.length; i += 10) {
          points = points.concat(lastRegion.data[i]);
        }
        lastRegion.data = points;
        // 更新最后一个区域
        view2DState.updateMeasureByIndex(lastRegionIndex, lastRegion);
        view2DState.setMeasureState({
          isDrawing: false,
          maxId: view2DState.measureState.maxId + 1,
        });
      }
    } else if (view2DState.toolType === ToolType.ARROWS && view2DState.measureState.isDrawing) {
      view2DState.setMeasureState({
        isDrawing: false,
        maxId: view2DState.measureState.maxId + 1,
      });
    } else if (view2DState.toolType === ToolType.RULER && view2DState.measureState.isDrawing) {
      view2DState.setMeasureState({
        isDrawing: false,
        maxId: view2DState.measureState.maxId + 1,
      });
    } else if (view2DState.toolType === ToolType.MAGNIFY) {
      if (magnifyCanvas) {
        destroyMagnifyCanvas();
      }
    }
    console.log('添加后的标记信息', view2DState.measureState.measurement);
  };

  const onStageonMouseDown = (e: any) => {
    // #region
    /* 
    console.log('真实的鼠标坐标', stageRef.current.getPointerPosition());
    console.log('当前stage的（x，y）', stageRef.current.x(), stageRef.current.y());
    console.log('相对于stage的鼠标位置：', getRelativePointerPosition(e.target.getStage()));
    console.log('当前layer的（x，y）', imgLayerRef.current.x(), imgLayerRef.current.y());
    console.log('相对于layer的鼠标位置：', getRelativePointerPosition(imgLayerRef.current));
    console.log('当前img的（x，y）', imageRef.current.x(), imageRef.current.y());
    console.log(
      'imgLayerRef获取当前图片的box',
      imgLayerRef.current.findOne('Image').getClientRect(),
    );
    console.log(
      '相对于Image的鼠标位置：',
      getRelativePointerPosition(imgLayerRef.current.findOne('Image')),
    );
    console.log('相对于imgRef的鼠标位置：', getRelativePointerPosition(imageRef.current));
    console.log('view2DState.stageState[type].imageX,Y',view2DState.stageState[type].imageX,view2DState.stageState[type].imageY)
    if (activeView !== type) {
      return;
    } */
    // #endregion

    // 激活状态下响应翻转和旋转
    changeLayer(view2DState.toolType, imgLayerRef.current);

    // console.log('onStageonMouseDown', e);
    // 将鼠标设置为按下状态
    view2DState.setStageState({ mouseDown: true });

    // TODO 后面请把代码调整到switch中
    switch (view2DState.toolType) {
      case ToolType.CHANGE_WWWL:
        console.log('调节窗宽窗位按下');
        break;
      case ToolType.REGIONS:
        {
          view2DState.setMeasureState({ isDrawing: true });

          // const point = stageRef.current.getPointerPosition()
          // 获取相对坐标
          // let point = getRelativePointerPosition(imgLayerRef.current);
          let point = getRelativePointerPosition(imgLayerRef.current.findOne('Image'));
          // 获取相对于图片的坐标
          // point = ToImgRelativePosition(point);

          const region: measurementType = {
            // eslint-disable-next-line no-plusplus
            viewType: type,
            id: view2DState.measureState.maxId + 1,
            labelType: ToolType.REGIONS,
            sliceNum, // 设置该区域所属图片的下标
            labelText: `New Region${view2DState.measureState.maxId + 1}`,
            data: [point],
          };
          // console.log('当前绘制的region', region);
          view2DState.setMeasureState({
            measurement: view2DState.measureState.measurement.concat([region]),
          });
          // console.log('之后的的regions', view2DState.measureState.measurement);
        }
        break;
      case ToolType.ARROWS:
        {
          view2DState.setMeasureState({ isDrawing: true });
          // 获取相对坐标
          // let point = getRelativePointerPosition(imgLayerRef.current);
          let point = getRelativePointerPosition(imgLayerRef.current.findOne('Image'));
          // 获取相对于图片的坐标
          // point = ToImgRelativePosition(point);
          console.log('获取相对于图片的坐标并保存', point);

          const arrow: measurementType = {
            // eslint-disable-next-line no-plusplus
            viewType: type,
            id: view2DState.measureState.maxId + 1,
            labelType: ToolType.ARROWS,
            sliceNum, // 设置该区域所属图片的下标
            labelText: `New Arrow${view2DState.measureState.maxId + 1}`,
            data: [point],
          };
          // console.log('temp arrow', arrow);
          view2DState.setMeasureState({
            measurement: view2DState.measureState.measurement.concat([arrow]),
          });
        }
        break;
      case ToolType.RULER:
        {
          view2DState.setMeasureState({ isDrawing: true });
          // 获取相对坐标
          // let point = getRelativePointerPosition(imgLayerRef.current);
          let point = getRelativePointerPosition(imgLayerRef.current.findOne('Image'));
          // 获取相对于图片的坐标
          // point = ToImgRelativePosition(point);

          const ruler: measurementType = {
            // eslint-disable-next-line no-plusplus
            viewType: type,
            id: view2DState.measureState.maxId + 1,
            labelType: ToolType.RULER,
            sliceNum, // 设置该区域所属图片的下标
            labelText: 'ruler',
            data: [point],
          };
          // console.log('temp arrow', arrow);
          view2DState.setMeasureState({
            measurement: view2DState.measureState.measurement.concat([ruler]),
          });
        }
        break;
      case ToolType.MAGNIFY:
        renderMagnify(e);
        break;
      default:
        break;
    }
  };

  const onStageonMouseMove = (e: any) => {
    if (activeView !== type) {
      return;
    }

    // 获取相对坐标
    const _point = getRelativePointerPosition(imageRef.current);
    setMouseLocation(_point);

    // TODO 后面请把代码调整到switch中
    switch (view2DState.toolType) {
      case ToolType.CHANGE_WWWL:
        // 如果鼠标被按下，这个方法才触发
        if (view2DState.stageState.mouseDown) {
          // console.log('调节窗宽窗位移动', e.evt);
          // 获取 增量
          const widowWidthPlus = e.evt.movementX;
          const widowLevelPlus = -e.evt.movementY;
          const newWindowWidth = view2DState.stageState.windowWidth + widowWidthPlus;
          const newwindowLevel = view2DState.stageState.windowLevel + widowLevelPlus;
          // 设置新的窗宽和窗位
          view2DState.setStageState({
            windowWidth: newWindowWidth > 1 ? newWindowWidth : 1,
            windowLevel: newwindowLevel > -32768 ? newwindowLevel : -32768,
          });
        }
        break;
      default:
        break;
    }

    // console.log('onStageonMouseDown', e);
    if (view2DState.toolType === ToolType.REGIONS && view2DState.measureState.isDrawing) {
      const regions = view2DState.measureState.measurement.filter(
        (val) => val.labelType === ToolType.REGIONS,
      );
      // console.log('原来的', view2DState.measureState.measurement);
      const lastRegion = {
        ...regions[regions.length - 1],
      };
      const lastRegionIndex = view2DState.measureState.measurement.findIndex(
        (val) => val.id === lastRegion.id,
      );

      // let point = stageRef.current.getPointerPosition();

      // 获取相对坐标
      // let point = getRelativePointerPosition(imgLayerRef.current);
      let point = getRelativePointerPosition(imgLayerRef.current.findOne('Image'));
      // 获取相对于图片的坐标
      // point = ToImgRelativePosition(point);
      // 得到最终的最后一个区域
      lastRegion.data = lastRegion.data.concat([point]);
      // 删除原来的最后一个区域并更新
      view2DState.updateMeasureByIndex(lastRegionIndex, lastRegion);
      // console.log('更新后的', view2DState.measureState.measurement);
    } else if (view2DState.toolType === ToolType.ARROWS && view2DState.measureState.isDrawing) {
      const arrows = view2DState.measureState.measurement.filter(
        (val) => val.labelType === ToolType.ARROWS,
      );
      const lastArrow = {
        ...arrows[arrows.length - 1],
      };
      const lastArrowIndex = view2DState.measureState.measurement.findIndex(
        (val) => val.id === lastArrow.id,
      );
      // console.log('lastArrowIndex', lastArrowIndex);
      // 获取相对坐标
      // let point = getRelativePointerPosition(imgLayerRef.current);
      let point = getRelativePointerPosition(imgLayerRef.current.findOne('Image'));
      // 获取相对于图片的坐标
      // point = ToImgRelativePosition(point);
      // 得到最终的最后一个箭头
      if (lastArrow.data.length > 1) {
        // 如果箭头已经包含两个点，就删除原来的第二个点
        lastArrow.data.splice(lastArrow.data.length - 1, 1); // 如果是删除，则返回的是被删除的元素！
      }
      lastArrow.data = lastArrow.data.concat([point]);
      // 删除原来的最后一个箭头并更新
      view2DState.updateMeasureByIndex(lastArrowIndex, lastArrow);
    } else if (view2DState.toolType === ToolType.RULER && view2DState.measureState.isDrawing) {
      const rulers = view2DState.measureState.measurement.filter(
        (val) => val.labelType === ToolType.RULER,
      );
      const lastRuler = {
        ...rulers[rulers.length - 1],
      };
      const lastRulerIndex = view2DState.measureState.measurement.findIndex(
        (val) => val.id === lastRuler.id,
      );
      // console.log('lastRulerIndex', lastRulerIndex);
      // 获取相对坐标
      // let point = getRelativePointerPosition(imgLayerRef.current);
      let point = getRelativePointerPosition(imgLayerRef.current.findOne('Image'));
      // 获取相对于图片的坐标
      // point = ToImgRelativePosition(point);
      // 得到最终的最后一个标尺
      if (lastRuler.data.length > 1) {
        // 如果标尺已经包含两个点，就删除原来的第二个点
        lastRuler.data.splice(lastRuler.data.length - 1, 1); // 如果是删除，则返回的是被删除的元素！
      }
      lastRuler.data = lastRuler.data.concat([point]);
      // 计算距离，保存到labelText中
      // eslint-disable-next-line no-restricted-properties
      // const pixelLen=Math.sqrt(Math.pow(lastRuler.data[0].x-lastRuler.data[1].x,2)+Math.pow(lastRuler.data[0].y-lastRuler.data[1].y,2)).toFixed(2)
      const { pixelSpacing, zDim } = store;
      let realLen: string = '';
      // const totalHeight = zDim * pixelSpacing.z;
      // console.log('totalHeight', totalHeight);
      // console.log('imgHeight', imgHeight);
      // console.log('imgWidth', imgWidth);
      // console.log('该视图下的信息', view2DState.stageState[type]);
      const wScreen = view2DState.stageState[type].imageWidth;
      const hScreen = view2DState.stageState[type].imageHeight;
      const xwDivide = store.xDim / wScreen;
      const ywDivide = store.yDim / wScreen;
      const yhDivide = store.yDim / hScreen;
      const zhDivide = store.zDim / hScreen;
      if (type === viewType[0]) {
        realLen = Math.sqrt(
          Math.pow(pixelSpacing.y * ywDivide * (lastRuler.data[0].x - lastRuler.data[1].x), 2) +
            Math.pow(pixelSpacing.z * zhDivide * (lastRuler.data[0].y - lastRuler.data[1].y), 2),
        ).toFixed(2);
      } else if (type === viewType[1]) {
        realLen = Math.sqrt(
          Math.pow(pixelSpacing.x * xwDivide * (lastRuler.data[0].x - lastRuler.data[1].x), 2) +
            Math.pow(pixelSpacing.z * zhDivide * (lastRuler.data[0].y - lastRuler.data[1].y), 2),
        ).toFixed(2);
      } else {
        realLen = Math.sqrt(
          Math.pow(pixelSpacing.x * xwDivide * (lastRuler.data[0].x - lastRuler.data[1].x), 2) +
            Math.pow(pixelSpacing.y * yhDivide * (lastRuler.data[0].y - lastRuler.data[1].y), 2),
        ).toFixed(2);
      }
      lastRuler.labelText = ''.concat(realLen, 'mm');

      // 删除原来的最后一个标尺并更新
      view2DState.updateMeasureByIndex(lastRulerIndex, lastRuler);
    } else if (view2DState.toolType === ToolType.MAGNIFY) {
      if (magnifyCanvas) {
        renderMagnify(e);
      }
    }
  };

  const onStageonMouseLeave = (e: any) => {
    if (view2DState.toolType === ToolType.MAGNIFY) {
      if (magnifyCanvas) {
        destroyMagnifyCanvas();
      }
    }
  };

  const delLabel = (e) => {
    // 清除标注功能
    if (view2DState.toolType === ToolType.CLEAR) {
      // console.log('e.target.attrs.id', e.target.attrs.id);
      // console.log('typeof id',typeof e.target.attrs.id)
      const delId = parseInt(e.target.attrs.id, 10);
      const delIndex = view2DState.measureState.measurement.findIndex((val) => val.id === delId);
      console.log('清除前', view2DState.measureState.measurement);
      console.log('delIndex', delIndex);
      view2DState.updateMeasureByIndex(delIndex, null);
      console.log('清除后', view2DState.measureState.measurement);
    }
  };
  // #endregion

  const init = () => {
    // 设置一个默认的窗宽和窗位

    const { WW, WL, dataArray, rescaleSlope, rescaleIntercept } = store;

    console.log('rescaleSlope', rescaleSlope);
    console.log('rescaleIntercept', rescaleIntercept);

    // 获取最大和最小值
    let maxVal = -LARGE_NUMBER;
    let minVal = +LARGE_NUMBER;
    for (let i = 0; i < dataArray.length; i++) {
      const valData = dataArray[i];
      minVal = valData < minVal ? valData : minVal;
      maxVal = valData > maxVal ? valData : maxVal;
    }
    maxVal = maxVal - minVal > 0 ? maxVal : maxVal + 1;

    console.log('maxVal', maxVal);
    console.log('minVal', minVal);

    const image = {
      maxPixelValue: maxVal,
      minPixelValue: minVal,
      slope: rescaleSlope,
      intercept: rescaleIntercept,
    };
    const viewport = {
      voi: { windowWidth: WW || maxVal - minVal, windowCenter: WL || (maxVal - minVal) / 2 },
      invert: false,
      modalityLUT: null,
      voiLUT: null,
    };

    console.time('lut生成');

    const {
      lutArray,
      windowWidth: _windowWidth,
      windowCenter: _windowCenter,
    } = getLut(image, viewport, false);
    lut = lutArray;
    view2DState.setStageState({ windowWidth: _windowWidth, windowLevel: _windowCenter });

    console.timeEnd('lut生成');

    console.log('lut:', lut);

    // // 尝试从 imageArray 获取
    // if ((WW ?? false) && (WL ?? false)) {
    //   view2DState.setStageState({ windowWidth: WW, windowLevel: WL });
    // } else {
    //   // 如果不存在的时候，算最大和最小值

    //   // get maximum value from slices (but only for given serie : hash)
    //   // 来源: med3web
    //   // src\demo\engine\loaders\LoaderDicom.js
    //   let maxVal = -LARGE_NUMBER;
    //   let minVal = +LARGE_NUMBER;
    //   // eslint-disable-next-line no-plusplus
    //   for (let i = 0; i < dataArray.length; i++) {
    //     const valData = dataArray[i] * rescaleSlope + rescaleIntercept;
    //     minVal = valData < minVal ? valData : minVal;
    //     maxVal = valData > maxVal ? valData : maxVal;
    //   }
    //   maxVal = maxVal - minVal > 0 ? maxVal : maxVal + 1;

    //   const _ww = maxVal - minVal;
    //   const _wl = Math.floor((maxVal - minVal) / 2);

    //   console.log('maxVal', maxVal);
    //   console.log('minVal', minVal);

    //   view2DState.setStageState({ windowWidth: _ww, windowLevel: _wl });
    // }
  };

  // #region 副作用
  useEffect(() => {
    // window.addEventListener('resize', checkSize);
    // window.addEventListener('resize', reRender);
    // 设置背景颜色
    const stage = stageRef.current;
    stage.container().style.backgroundColor = '#3f436b';
    // stage.container().style.width = '100%';
    // stage.container().style.height = '100%';
    // checkSize();
    const container = containerRef.current;

    return () => {
      // window.removeEventListener('resize', checkSize);
      // window.removeEventListener('resize', reRender);
      console.log('清理状态...');
      // 清理状态
      view2DState.setStateByView(type, initImgState);
      // 清除上一次的渲染
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, []);

  // loading 结束后，算ww和wl
  useEffect(() => {
    console.log('loading', loading);
    if (loading === false) {
      init();
    }
  }, [loading]);

  useEffect(() => {
    console.log('loading', loading);
    console.log('containerWidth', containerWidth);
    console.log('containerHeight', containerHeight);
    // 需要等待 containerWidth 和 containerHeight 长度获取之后再进行渲染
    if (loading === false && containerWidth && containerHeight && isFirstAuto) {
      // 初始化一些基本参数
      init();
      console.log('uiState', view2DState);
      const { imgW, imgH } = render(sliceNum); // 得到图片的真实大小
      // 加载完毕，将图片移动到中心并自适应
      const _stageWidth = stageRef.current.width();
      const _StageHeight = stageRef.current.height();
      // console.log('imageWidth,imageHeight', imgW, imgH);
      // console.log(
      //   'imgLayerRef获取当前图片的box',
      //   imgLayerRef.current.findOne('Image').getClientRect(),
      // );
      let scale = 1;
      // 获取新的缩放倍数
      if (imgW > _stageWidth || imgH > _StageHeight) {
        scale = Math.min(_stageWidth / imgW, _StageHeight / imgH);
      }
      // 获取新的img在imgLayer中的位置
      const { x, y } = ImgToCenter({
        imageWidth: imgW,
        imageHeight: imgH,
        StageWidht: _stageWidth / scale,
        StageHeight: _StageHeight / scale,
      });
      imgLayerRef.current.x(0);
      imgLayerRef.current.y(0);
      imgLayerRef.current.scaleX(scale);
      imgLayerRef.current.scaleY(scale);
      imgLayerRef.current.batchDraw();
      const imageEl = imageRef.current;

      imageEl.x(x);
      imageEl.y(y);

      view2DState.setStateByView(type, {
        imageWidth: imgW,
        imageHeight: imgH,
        imageX: x,
        imageY: y,
        StageScale: scale,
      });

      // setisFirstAuto(false)
    }
    /* else{
      // 加载完毕，将图片移动到中心并自适应
      const _stageWidth = stageRef.current.width();
      const _StageHeight = stageRef.current.height();
      const imgW = view2DState.stageState[type].imageWidth
      const imgH = view2DState.stageState[type].imageHeight
      let scale = 1;
      // 获取新的缩放倍数
      if (imgW > _stageWidth || imgH > _StageHeight) {
        scale = Math.min(_stageWidth / imgW, _StageHeight / imgH);
      }
      // 获取新的img在imgLayer中的位置
      const { x, y } = ImgToCenter({
        imageWidth: imgW,
        imageHeight: imgH,
        StageWidht: _stageWidth / scale,
        StageHeight: _StageHeight / scale,
      });
      const imageEl = imageRef.current;

      // // 修改标注信息的位置
      // const deltX=x-imageEl.x();
      // const deltY=y-imageEl.y();
      // console.log("位置改变量：deltX，deltY",deltX,deltY)
      // const old={...view2DState.measureState.measurement}
      // console.log('old',old)
      // view2DState.updateLabelPoints(deltX,deltY)
      // const newData={...view2DState.measureState.measurement}
      // console.log('new',newData)

      imageEl.x(x);
      imageEl.y(y);

      view2DState.setStateByView(type, {
        imageWidth: imgW,
        imageHeight: imgH,
        imageX: x,
        imageY: y,
        StageScale: scale,
      });
    } */
  }, [loading, containerWidth, containerHeight]);

  //  type 发生改变时
  useEffect(() => {
    if (type && loading === false) {
      if (type === 'Coronal') {
        setMaxSliceNum(store.yDim);
      } else if (type === 'Saggital') {
        setMaxSliceNum(store.xDim);
      } else {
        setMaxSliceNum(store.zDim);
      }
    }
  }, [type, loading]);

  // ww wl 发生改变时触发重新渲染
  useEffect(() => {
    if (loading === false && containerWidth && containerHeight) {
      reRender();

      // 重新生成 lut

      const { dataArray, rescaleSlope, rescaleIntercept } = store;
      console.log('rescaleSlope', rescaleSlope);
      console.log('rescaleIntercept', rescaleIntercept);

      // 获取最大和最小值
      let maxVal = -LARGE_NUMBER;
      let minVal = +LARGE_NUMBER;
      for (let i = 0; i < dataArray.length; i++) {
        const valData = dataArray[i];
        minVal = valData < minVal ? valData : minVal;
        maxVal = valData > maxVal ? valData : maxVal;
      }
      maxVal = maxVal - minVal > 0 ? maxVal : maxVal + 1;

      console.log('maxVal', maxVal);
      console.log('minVal', minVal);

      const image = {
        maxPixelValue: maxVal,
        minPixelValue: minVal,
        slope: rescaleSlope,
        intercept: rescaleIntercept,
      };
      const viewport = {
        voi: { windowWidth: windowLevel, windowCenter: windowWidth },
        invert: false,
        modalityLUT: null,
        voiLUT: null,
      };

      console.time('lut生成');

      const {
        lutArray,
        windowWidth: _windowWidth,
        windowCenter: _windowCenter,
      } = getLut(image, viewport, false);

      console.timeEnd('lut生成');

      lut = lutArray;
      // view2DState.setStageState({ windowWidth: _windowWidth, windowLevel: _windowCenter });
      console.log('lut:', lut);
    }
  }, [windowLevel, windowWidth]);

  useEffect(() => {
    if (loading === false && containerWidth && containerHeight) {
      console.log('sliceNum', sliceNum);
      render(sliceNum);
    }
  }, [sliceNum, view2DState.stageState.colorTableIndex]);

  // 监听工具类型发生改变
  useEffect(() => {
    // 重置图片
    if (view2DState.toolType === ToolType.IMG_RESET) {
      console.log('重置图片');
      imgLayerRef.current.to({
        x: 0,
        y: 0,
        scaleX: view2DState.stageState[type].StageScale,
        scaleY: view2DState.stageState[type].StageScale,
        rotation: 0,
        duration: 0,
      });

      // 更新 stage
      imgLayerRef.current.batchDraw();

      // 更新store
      view2DState.setStateByView(type, {
        rotation: 0, // 当前顺时针旋转角度

        isFlipHorizontal: false, // 是否是水平翻转状态

        isFlipVertical: false, // 是否是垂直翻转状态
      });
    }
    // 重置标注信息
    if (view2DState.toolType === ToolType.TOOL_RESET) {
      console.log('重置标注信息');
      view2DState.clearAllMeasures();
    }
  }, [view2DState.toolType]);

  // 文本赋值
  useEffect(() => {
    const {
      WW,
      WL,
      seriesNumber,
      patientId,
      patientName,
      patientBirthDate,
      institutionName,
      pixelSpacing,
      dataArray,
      xDim,
      yDim,
      zDim,
    } = store;
    const textTmp: DicomViewInfo = {};
    let x;
    let y;
    let z;
    if (type === viewType[0]) {
      x = sliceNum;
      y = mouseLocation.x;
      z = mouseLocation.y;
    } else if (type === viewType[1]) {
      x = mouseLocation.x;
      y = sliceNum;
      z = mouseLocation.y;
    } else {
      x = mouseLocation.x;
      y = mouseLocation.y;
      z = sliceNum;
    }
    x = Math.floor(x);
    y = Math.floor(y);
    z = Math.floor(z);
    const pos = x + y * xDim + z * xDim * yDim;

    textTmp.sliceNumber = sliceNum;
    textTmp.maxSliceNumber = maxSliceNum;
    textTmp.windowCenter = WL;
    textTmp.windowWidth = WW;
    textTmp.pixelSpacing = pixelSpacing.x;
    textTmp.sliceThickness = pixelSpacing.z;
    textTmp.patientId = patientId;
    textTmp.patientName = patientName;
    textTmp.patientBirthDate = patientBirthDate;
    textTmp.instructionName = institutionName;
    textTmp.seriesNumber = seriesNumber;
    textTmp.mouseX = Math.floor(mouseLocation.x);
    textTmp.mouseY = Math.floor(mouseLocation.y);
    // if (dataArray) {
    //   const dataView = new DataView(dataArray.buffer);
    //   textTmp.pixelHU = dataView.getInt16(pos, true);
    //   // textTmp.pixelHU = dataArray[pos].getInt16();
    // }

    // console.log('textInfo', textTmp);
    setTextInfo(textTmp);
  }, [sliceNum, maxSliceNum, store, mouseLocation]);

  // #endregion

  return (
    <Layout
      style={{
        width: '100%',
        height: '100%',
        borderWidth: '2px',
        borderColor: 'red',
      }}
    >
      <Layout>
        <Content style={{ width: 'calc(100% - 20px)', height: '100%', position: 'relative' }}>
          {/* 显示病患信息 */}
          <Overlay
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              color: '#cde',
              zIndex: 1,
            }}
            info={textInfo}
          />

          <div style={{ zIndex: 0, width: '100%', height: '100%' }} ref={containerRef}>
            <Spin
              spinning={loading}
              size="large"
              tip="DICOM 文件读取中..."
              wrapperClassName={styles.custom_spin}
              style={{ fontSize: '18px', zIndex: 2 }}
            >
              <div
                ref={stageParentRef}
                style={{
                  width: '100%',
                  height: '100%',
                }}
              >
                <Stage
                  width={containerWidth}
                  height={containerHeight}
                  ref={stageRef}
                  onWheel={onStageWheel}
                  // 鼠标进入时激活该视图
                  onMouseEnter={() => {
                    setactiveView(type);
                  }}
                  onMouseDown={onStageonMouseDown}
                  onMouseMove={onStageonMouseMove}
                  onMouseUp={onStageMouseUp}
                  onMouseLeave={onStageonMouseLeave}
                >
                  <Layer ref={imgLayerRef} draggable={view2DState.toolType === ToolType.IMG_MOVE}>
                    <Image ref={imageRef} image={imgCanvas}></Image>
                    <Image ref={magnifyRef} image={magnifyCanvas}></Image>
                    <Regions
                      key={type}
                      activeView={activeView}
                      onClick={delLabel}
                      nowSliceNum={sliceNum}
                      regions={view2DState.measureState.measurement.filter(
                        (val) => val.labelType === ToolType.REGIONS,
                      )}
                      imagePos={{
                        x: view2DState.stageState[type].imageX,
                        y: view2DState.stageState[type].imageY,
                      }}
                      regionAttribute={{
                        strokeWidth: view2DState.measureState
                          ? view2DState.measureState.strokeWidth
                          : 2,
                        fontSize: view2DState.measureState
                          ? view2DState.measureState.textFontSize
                          : 20,
                      }}
                    />
                    <Arrows
                      activeView={activeView}
                      onClick={delLabel}
                      nowSliceNum={sliceNum}
                      arrows={view2DState.measureState.measurement.filter(
                        (val) => val.labelType === ToolType.ARROWS,
                      )}
                      imagePos={{
                        x: view2DState.stageState[type].imageX,
                        y: view2DState.stageState[type].imageY,
                      }}
                      regionAttribute={{
                        strokeWidth: view2DState.measureState
                          ? view2DState.measureState.strokeWidth
                          : 2,
                        fontSize: view2DState.measureState
                          ? view2DState.measureState.textFontSize
                          : 20,
                      }}
                    />
                    <Rulers
                      activeView={activeView}
                      onClick={delLabel}
                      nowSliceNum={sliceNum}
                      rulers={view2DState.measureState.measurement.filter(
                        (val) => val.labelType === ToolType.RULER,
                      )}
                      imagePos={{
                        x: view2DState.stageState[type].imageX,
                        y: view2DState.stageState[type].imageY,
                      }}
                      rulerAttribute={{
                        strokeWidth: view2DState.measureState
                          ? view2DState.measureState.strokeWidth
                          : 2,
                        fontSize: view2DState.measureState
                          ? view2DState.measureState.textFontSize
                          : 20,
                      }}
                    />
                    <LabelText
                      onClick={() => {}}
                      activeView={activeView}
                      nowSliceNum={sliceNum}
                      measurement={view2DState.measureState.measurement}
                      imagePos={{
                        x: view2DState.stageState[type].imageX,
                        y: view2DState.stageState[type].imageY,
                      }}
                      regionAttribute={{
                        strokeWidth: view2DState.measureState
                          ? view2DState.measureState.strokeWidth
                          : 2,
                        fontSize: view2DState.measureState
                          ? view2DState.measureState.textFontSize
                          : 20,
                      }}
                    />
                  </Layer>
                </Stage>
              </div>
            </Spin>
          </div>
        </Content>

        <Sider width={20}>
          <div style={{ height: '95%', margin: '10px 0 0' }}>
            <Slider
              vertical
              reverse
              style={{ margin: 'auto' }}
              min={1}
              max={maxSliceNum}
              value={sliceNum}
              onChange={(value) => {
                setSliceNum(value);
                sliceNumRef.current = value;
              }}
            />
          </div>
        </Sider>
      </Layout>
    </Layout>
  );
});

export default View2D;
