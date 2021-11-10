/*
 * @Author: Meng Tian
 * @Date: 2021-07-16 16:56:06
 * @Description: 左侧工具栏
 */
import React, { useState, useEffect, useContext, Fragment } from 'react';
import { ToolType, ToolTypeMap } from '../constants';
import { Button, List, Input, Select, Menu, Switch } from 'antd';
import { ColorTable } from '../../util/colorTable';
import { observer } from 'mobx-react';

import View2DState from '../../store/View2DState';

import ToolButton from './component/ToolButton';

const { Option } = Select;
const { SubMenu } = Menu;

type LeftToolbarProps = {
  // uiState: any;
  //   changeImgMove: (boolean) => void;

  width?: number;
  height?: number;
};

const LeftToolbar: React.FC<LeftToolbarProps> = observer((props) => {
  const view2DState = View2DState;

  const [curKey, setcurKey] = useState(undefined);

  const { view2dTool, measureTool } = ToolTypeMap;

  const { width, height } = props;

  useEffect(() => {
    console.log('组件刷新')
  }, [view2DState.measureState.measurement])

  return (
    <>
      <Menu
        theme="dark"
        onClick={(e) => {
          setcurKey(e.key);
        }}
        // style={{ width: 256 }}
        defaultOpenKeys={['sub1']}
        selectedKeys={[curKey]}
        mode="inline"
        style={{ width: width || 200, height: height || 800, overflowY: 'auto', overflowX: 'hidden' }}
      >
        <SubMenu key="sub1" /* icon={<MailOutlined />}  */ title="2D操作">
          {Object.keys(view2dTool).map((key) => (
            <ToolButton
              isCheck={view2dTool[key].isCheck}
              onClick={() => {
                view2DState.setToolType(view2dTool[key].val);
              }}
              toolType={view2dTool[key].val}
              width={width}
            >
              {view2dTool[key].text}
            </ToolButton>
          ))}
          <div
            style={{
              background: '#5cc6e0',
              height: '2px',
              marginLeft: '12px',
              marginRight: '12px',
              marginTop: '8px',
              marginBottom: '8px',
            }}
          ></div>
          <span
            style={{
              display: 'block',
              color: '#39bbdb',
              width: 'inherit',
              height: '24px',
              textAlign: 'center',
              lineHeight: '24px',
            }}
          >
            伪彩色
          </span>
          <div style={{ padding: '0px 12px 0px 12px', textAlign: 'center' }}>
            <Select
              defaultValue={ColorTable.BW_LINEAR.val}
              // onChange={(index) => view2DState.changeColorTableIndex(index)}
              onChange={(index) => view2DState.setStageState({ colorTableIndex: index })}
              style={{ width: width - 24 }}
            >
              {Object.keys(ColorTable).map((key) => (
                <Option key={key} value={ColorTable[key].val}>
                  {ColorTable[key].display}
                </Option>
              ))}
            </Select>
          </div>
          <div
            style={{
              background: '#5cc6e0',
              height: '2px',
              marginLeft: '12px',
              marginRight: '12px',
              marginTop: '8px',
              marginBottom: '8px',
            }}
          ></div>
        </SubMenu>
        <SubMenu key="sub2" /* icon={<AppstoreOutlined />} */ title="工具">
          {Object.keys(measureTool).map((key) => (
            <ToolButton
              isCheck={measureTool[key].isCheck}
              onClick={() => {
                view2DState.setToolType(measureTool[key].val);
              }}
              toolType={measureTool[key].val}
              width={width}
            >
              {measureTool[key].text}
            </ToolButton>

            // <Button
            //   onClick={() => {
            //     view2DState.setToolType(measureTool[key].val);
            //   }}
            //   type="primary"
            // >
            //   {measureTool[key].text}
            // </Button>
          ))}
        </SubMenu>
        <SubMenu key="sub3" /* icon={<AppstoreOutlined />} */ title="标注信息">
          <List
            size="small"
            // header={<div style={{ color: 'white' }}>选区</div>}
            dataSource={view2DState.measureState.measurement}
            renderItem={(measureInfo: any, index: number) => {
              // if (measureInfo.labelType === ToolType.RULER) {
              //   return <Fragment />;
              // }
              return (
                <List.Item>
                  <Input
                    value={measureInfo.labelText}
                    onChange={(e) => {
                      console.log('e', e);
                      if (view2DState.measureState) {
                        measureInfo.labelText = e.target.value;
                        view2DState.measureState.measurement[index] = measureInfo;
                        view2DState.setMeasureState({
                          measurement: view2DState.measureState.measurement,
                        });
                      }
                    }}
                  />
                  <Button
                    onClick={() => {
                      if (view2DState.measureState) {
                        view2DState.measureState.measurement.splice(index, 1);
                        view2DState.setMeasureState({
                          measurement: view2DState.measureState.measurement,
                        });
                      }
                    }}
                    style={{ marginLeft: 10 }}
                    type="primary"
                    danger
                  >
                    删除
                  </Button>
                </List.Item>
              );
            }}
          />
        </SubMenu>
      </Menu>
    </>
  );
});

export default LeftToolbar;
