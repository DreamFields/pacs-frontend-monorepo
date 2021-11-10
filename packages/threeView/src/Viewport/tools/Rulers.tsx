/*
 * @Author: Meng Tian
 * @Date: 2021-07-18 11:11:43
 * @Description: Do not edit
 */
import React, { useEffect } from 'react';
import { Layer, Arrow, Line, Text, Group, Label, Ring, Tag } from 'react-konva';
// import { ImgRegionToolDataType } from './data';

interface RulersProps {
  activeView: string;
  rulers?: any[];
  setImgRegionTool?: (payload: any) => void;
  imagePos?: { x: number | undefined; y: number | undefined };
  rulerAttribute: { strokeWidth: number; fontSize: number };
  onClick: (e: any) => void;
  nowSliceNum: number; // 当前的图片下标
}

const Rulers: React.FC<RulersProps> = (props) => {
  const { activeView, rulers, imagePos, rulerAttribute, onClick, nowSliceNum } = props;

  return (
    // <Layer ref={layerRef}>
    <Group x={imagePos?.x} y={imagePos?.y}>
      {rulers?.map((ruler) => {
        // console.log('遍历rulers-', ruler);
        if (ruler.sliceNum === nowSliceNum && ruler.viewType === activeView)
          return (
            <React.Fragment key={ruler.id}>
              <Line
                pointerAtBeginning
                id={ruler.id.toString()}
                name="ruler"
                points={ruler.data.flatMap((p: any) => [p.x, p.y])}
                stroke="#e9e216"
                strokeWidth={rulerAttribute.strokeWidth}
                onClick={onClick}
              />
              <Ring
                x={ruler.data[0].x}
                y={ruler.data[0].y}
                innerRadius={8}
                outerRadius={10}
                fill="yellow"
                stroke="#e9e216"
                strokeWidth={rulerAttribute.strokeWidth * 0.3}
              />
              <Ring
                x={ruler.data[ruler.data.length - 1].x}
                y={ruler.data[ruler.data.length - 1].y}
                innerRadius={8}
                outerRadius={10}
                fill="#e9e216"
                stroke="#e9e216"
                strokeWidth={rulerAttribute.strokeWidth * 0.3}
              />
              <Label
                x={(ruler.data[0].x + ruler.data[ruler.data.length - 1].x) / 2}
                y={(ruler.data[0].y + ruler.data[ruler.data.length - 1].y) / 2}
              >
                <Text
                  text={ruler.labelText}
                  fontSize={rulerAttribute.fontSize}
                  fontStyle="normal"
                  align="center"
                  fontFamily="Calibri"
                  stroke="#e9e216" // 描边颜色
                  strokeWidth={rulerAttribute.strokeWidth * 0.3}
                />
              </Label>
            </React.Fragment>
          );
        return <React.Fragment></React.Fragment>;
      })}
    </Group>
    // </Layer>
  );
};

export default Rulers;
