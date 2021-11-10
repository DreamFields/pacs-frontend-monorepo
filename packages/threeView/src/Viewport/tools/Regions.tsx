/*
 * @Author: Meng Tian
 * @Date: 2021-07-18 11:11:43
 * @Description: Do not edit
 */
import React, { useEffect } from 'react';
import { Layer, Line, Text, Rect, Circle, Group, Label, Tag } from 'react-konva';
import type { measurementType } from '../constants';

interface RegionsProps {
  activeView: string;
  regions?: measurementType[];
  setImgRegionTool?: (payload: any) => void;
  imagePos?: { x: number | undefined; y: number | undefined };
  regionAttribute: { strokeWidth: number; fontSize: number };
  onClick: (e: any) => void;
  nowSliceNum: number; // 当前的图片下标
}

const Regions: React.FC<RegionsProps> = (props) => {
  const layerRef: any = React.useRef(null);

  const { activeView, regions, imagePos, regionAttribute, onClick, nowSliceNum } = props;

  return (
    // <Layer ref={layerRef}>
    <Group x={imagePos?.x} y={imagePos?.y}>
      {regions?.map((region) => {
        // console.log('遍历regions-', region);
        if (region.sliceNum === nowSliceNum && region.viewType===activeView)
          return (
            <React.Fragment key={region.id}>
              <Line
                id={region.id.toString()}
                name="region"
                points={region.data.flatMap((p: any) => [p.x, p.y])}
                stroke="#e9e216"
                dash={[regionAttribute.strokeWidth * 2, regionAttribute.strokeWidth]}
                strokeWidth={regionAttribute.strokeWidth}
                closed // 线条是否封闭
                onClick={onClick}
              />
              {/* <Label
                x={region.data[region.data.length - 1].x}
                y={region.data[region.data.length - 1].y}
              >
                <Text
                  // ref={el => (itemsRef.current[index] = el)}
                  text={region.labelText}
                  fontSize={regionAttribute.fontSize}
                  // fill="blach" // 填充颜色
                  fontStyle="normal"
                  // width={regionAttribute.fontSize * 6.7}
                  align="center"
                  fontFamily="Calibri"
                  stroke="#e9e216" // 描边颜色
                  strokeWidth={regionAttribute.strokeWidth * 0.3}
                  // padding={10}
                />
              </Label> */}
            </React.Fragment>
          );
        return <React.Fragment></React.Fragment>;
      })}
    </Group>
    // </Layer>
  );
};

export default Regions;
