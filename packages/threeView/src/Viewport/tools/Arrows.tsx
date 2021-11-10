/*
 * @Author: Meng Tian
 * @Date: 2021-07-18 11:11:43
 * @Description: Do not edit
 */
import React, { useEffect } from 'react';
import { Layer, Arrow, Text, Group, Label, Tag } from 'react-konva';
// import { ImgRegionToolDataType } from './data';

interface ArrowsProps {
  activeView: string;
  arrows?: any[];
  setImgRegionTool?: (payload: any) => void;
  imagePos?: { x: number | undefined; y: number | undefined };
  regionAttribute: { strokeWidth: number; fontSize: number };
  onClick: (e: any) => void;
  nowSliceNum: number; // 当前的图片下标
}

const Arrows: React.FC<ArrowsProps> = (props) => {

  const { activeView, arrows, imagePos, regionAttribute, onClick, nowSliceNum } = props;

  return (
    // <Layer ref={layerRef}>
    <Group x={imagePos?.x} y={imagePos?.y}>
    {/* <Group x={0} y={0}> */}
      {arrows?.map((arrow) => {
        // console.log('遍历arrows-', arrow);
        if (arrow.sliceNum === nowSliceNum && arrow.viewType === activeView)
          return (
            <React.Fragment key={arrow.id}>
              <Arrow
                // pointerAtBeginning
                id={arrow.id.toString()}
                name="arrow"
                points={arrow.data.flatMap((p: any) => [p.x, p.y])}
                stroke="#e9e216"
                // dash={[regionAttribute.strokeWidth * 2, regionAttribute.strokeWidth]} // 用于设置虚线
                strokeWidth={regionAttribute.strokeWidth}
                onClick={onClick}
              />
            </React.Fragment>
          );
        return <React.Fragment></React.Fragment>;
      })}
    </Group>
    // </Layer>
  );
};

export default Arrows;
