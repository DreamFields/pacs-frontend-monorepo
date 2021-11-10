/*
 * @Author: Meng Tian
 * @Date: 2021-07-25 11:20:20
 * @Description: 用于显示标注文本，预期效果：相对于标注的位置会不断改变
 */
import React from 'react';
import { Text, Group, Label } from 'react-konva';
import {ToolType} from '../constants'

interface LabelTextProps {
  activeView: string,
  measurement?: any[];
  setImgRegionTool?: (payload: any) => void;
  imagePos?: { x: number | undefined; y: number | undefined };
  regionAttribute: { strokeWidth: number; fontSize: number };
  onClick: (e: any) => void;
  nowSliceNum: number; // 当前的图片下标
}

const LabelText: React.FC<LabelTextProps> = (props) => {

  const { activeView,measurement, imagePos, regionAttribute, nowSliceNum } = props;

  return (
      <Group x={imagePos?.x} y={imagePos?.y}>
        {measurement?.map((item) => {
          if (item.sliceNum === nowSliceNum && item.viewType===activeView)
            return (
              <React.Fragment key={item.id}>
                <Label
                  x={item.data[0].x}
                  y={item.data[0].y}
                >
                  <Text
                    // ref={el => (itemsRef.current[index] = el)}
                    text={item.labelType===ToolType.RULER?'':item.labelText}
                    fontSize={regionAttribute.fontSize}
                    fontStyle="normal"
                    // width={regionAttribute.fontSize * 6.7}
                    align="center"
                    fontFamily="Calibri"
                    stroke="#e9e216" // 描边颜色
                    strokeWidth={regionAttribute.strokeWidth*0.3}
                  />
                </Label>
              </React.Fragment>
            );
          return <React.Fragment></React.Fragment>;
        })}
      </Group>
  );
};

export default LabelText;
