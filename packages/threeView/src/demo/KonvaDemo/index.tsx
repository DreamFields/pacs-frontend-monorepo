/*
 * @Author: Meng Tian
 * @Date: 2021-07-12 17:54:57
 * @Description: Do not edit
 */
import React, { useEffect, useRef, useState } from 'react';

import { getDicomSeriesImageData } from '../../io/OrthancDicomLoader';
import ImageArray from '../../store/ImageArray';
import { observer } from 'mobx-react';

import { Slider } from 'antd';
import 'antd/dist/antd.css'; // antd的样式需要额外引入（umi框架会自动把样式处理因此不用引入）

import { Stage, Layer } from 'react-konva';

type KonvaDemoProps = {
  store: any;
  uuid: string;
};

const KonvaDemo: React.FC<KonvaDemoProps> = observer((props) => {
  const container = useRef(null); // 根据图片信息绘制canvas
  const stageRef: any = useRef(); // 保存全局stage

  const [imgIndex, setimgIndex] = useState(0); // 当前图片下标
  const [maxIndex, setmaxIndex] = useState<number>(); // 图片个数
  // const [imgData, setimgData] = useState(undefined); // img数据（数组形式）
  const [imgScale, setimgScale] = useState(1.0); // 缩放倍数
  const [imgPos, setimgPos] = useState({
    // 图片位置
    imageX: 0,
    imageY: 0,
  });
  const [mouseDown, setmouseDown] = useState(false); // 鼠标是否按下

  const { store, uuid } = props;

  const setKonva = (imgIdx, imgX, imgY) => {
    const numPixels = store.xDim * store.yDim;
    const imgPixels = new Uint8Array(numPixels * 4);

    const { WW, WL, dataArray, rescaleSlope, rescaleIntercept } = store;

    console.log('WW', WW);
    console.log('WL', WL);

    console.log('rescaleSlope', rescaleSlope);
    console.log('rescaleIntercept', rescaleIntercept);

    // const offset = numPixels * imgIdx;

    if (WW !== null && WL !== null) {
      let p = 0;
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < numPixels; i++, p += 4) {
        // NewValue = (RawPixelValue * RescaleSlope) + RescaleIntercept
        // U = m*SV + b

        // 这里的 x y z对应的是屏幕坐标
        const x = i % store.xDim;
        const y = Math.floor(i / store.xDim);
        const z = imgIdx;
        let pos = 0;

        pos = x + y * store.yDim + z * store.xDim * store.yDim;

        const valScaled = dataArray[pos] * rescaleSlope + rescaleIntercept;

        let val = Math.floor(((valScaled - WL + WW / 2) * 255) / WW);

        val = val >= 0 ? val : 0;
        val = val < 255 ? val : 255;

        imgPixels[p] = val;
        imgPixels[p + 1] = val;
        imgPixels[p + 2] = val;
        imgPixels[p + 3] = 255;
      }
    }

    console.log('imgPixels', imgPixels);

    const ctx = container.current.getContext('2d');
    if (ctx) {
      const iData = new ImageData(new Uint8ClampedArray(imgPixels), 512, 512);
      ctx.putImageData(iData, imgX, imgY, 0, 0, 512, 512);
    }

    /*  const ctx = container.current.getContext('2d');
    if (ctx) {
      const iData = new ImageData(new Uint8ClampedArray(resArray[imgIndex]), 512, 512);
      ctx.putImageData(iData, imgX, imgY);
    } */
  };

  const getImageData = async () => {
    // b5981569-302c412a-6ced2c80-fd877f65-933991a4
    // b5981569-302c412a-6ced2c80-fd877f65-933991a4
    const res = await getDicomSeriesImageData(uuid);
    if (res) {
      setKonva(0, imgPos.imageX, imgPos.imageY);
      setmaxIndex(store.zDim);
    }
  };

  useEffect(() => {
    getImageData();
  }, []);

  // 滑块响应事件
  function sliderOnChange(value) {
    stageRef.current.clear();
    console.log('onChange-imgIndex: ', imgIndex);
    setimgIndex(value);
    setKonva(imgIndex, imgPos.imageX, imgPos.imageY);
  }

  // 缩放：鼠标滚动事件
  const zoomStage = (stage: any, scaleBy: any, duration: number) => {
    stageRef.current.clear();
    // console.log('缩放倍数：',scaleBy)
  };

  const moveImg = (stage: any) => {
    if (mouseDown) {
      // 获取当前指针坐标
      const pointer = stage.getPointerPosition();
      setimgPos({
        imageX: imgPos.imageX + (pointer.x - stageRef.current.mousePointer.x),
        imageY: imgPos.imageY + (pointer.y - stageRef.current.mousePointer.y),
      });
      
      stage.clear();
      setKonva(imgIndex, imgPos.imageX, imgPos.imageY);
      // 设置全局stage
      stageRef.current.mousePointer = pointer;
    }
  };

  return (
    <>
      <div style={{ paddingTop: 20, paddingLeft: 20, width: 640 }}>
        <div
          id="header-nav"
          style={{ padding: 12, width: 640, border: '1px solid #d9d9d9', marginBottom: 10 }}
        >
          <Slider
            step={1}
            style={{ width: 600, height: 20 }}
            min={1}
            max={maxIndex}
            onChange={sliderOnChange}
            onAfterChange={(value) => {
              setimgIndex(value);
            }}
          />
        </div>
        <div id="main_window" style={{ display: 'block' }}>
          <div id="konva" style={{ border: '1px solid #d9d9d9' }}>
            <Stage
              ref={stageRef}
              width={600}
              height={800}
              onWheel={(e: any) => {
                e.evt.preventDefault();
                if (e.evt.deltaY > 0) {
                  zoomStage(e.target, 0.8, 0.1);
                } else {
                  zoomStage(e.target, 1.2, 0.1);
                }
              }}
              onMouseDown={(e) => {
                setmouseDown(true);
                stageRef.current.mousePointer = e.target.getStage().getPointerPosition();
                // console.log('onMouseDown-imgIndex', imgIndex);
              }}
              onMouseMove={(e) => {
                moveImg(e.target);
              }}
              onMouseUp={(e) => {
                setmouseDown(false);
              }}
            >
              <Layer ref={container}></Layer>
            </Stage>
          </div>
        </div>
      </div>
    </>
  );
});

const KonvaDemoConnected: React.FC<any> = observer((props) => {
  return <KonvaDemo store={ImageArray} uuid={props.uuid}></KonvaDemo>;
});

export default KonvaDemoConnected;
