/*
 * @Descripttion: Do not edit
 * @Author: linkenzone
 * @Date: 2021-03-27 17:29:07
 */
import {
  BarsOutlined,
  DownloadOutlined,
  SettingOutlined,
  TableOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Menu, Popover, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import style from './style.less';
import ConnectedToolButton from './ConnectedToolButton';
import type { Dispatch } from 'umi';
import { connect } from 'umi';
import type { StateType } from '@/models/cornerstone/model';

import cornerstoneTools from 'cornerstone-tools';
import cornerstone from 'cornerstone-core';

const { Option } = Select;

const LayoutSettingButton: React.FC<{ dispatch: Dispatch }> = (props) => {
  const { onClick, dispatch } = props;
  const [viewLayoutHighLight, setViewLayoutHighLight] = useState({ x: 0, y: 0 });

  return (
    <Button
      type="link"
      style={{ height: '48px', width: '48px', display: 'block', padding: '0', margin: '0' }}
    >
      <Popover
        placement="right"
        content={() => {
          return (
            <>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  width: '60px',
                  outline: '1px solid rgb(155, 155, 155)',
                }}
              >
                {[
                  { x: 1, y: 1 },
                  { x: 2, y: 1 },
                  { x: 3, y: 1 },
                  { x: 1, y: 2 },
                  { x: 2, y: 2 },
                  { x: 3, y: 2 },
                  { x: 1, y: 3 },
                  { x: 2, y: 3 },
                  { x: 3, y: 3 },
                ].map((item, index) => {
                  return (
                    <button
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      className={`${style.viewer_layout_btn} ${
                        viewLayoutHighLight.x >= item.x && viewLayoutHighLight.y >= item.y
                          ? style.btnHighLight
                          : null
                      }`}
                      onMouseEnter={() => {
                        setViewLayoutHighLight({ x: item.x, y: item.y });
                      }}
                      onMouseLeave={() => {
                        setViewLayoutHighLight({ x: 0, y: 0 });
                      }}
                      onClick={() => {
                        dispatch({
                          type: 'ImgViewer2D/save',
                          payload: { GridLayout: { x: item.x, y: item.y } },
                        });
                      }}
                    ></button>
                  );
                })}
              </div>
            </>
          );
        }}
        trigger="click"
      >
        <TableOutlined style={{ fontSize: '28px' }} />
      </Popover>
    </Button>
  );
};

type LeftToolbarProps = {
  dispatch: Dispatch;
  ImgViewer2D: StateType;
};

const LeftToolbar: React.FC<LeftToolbarProps> = (props) => {
  const { ImgViewer2D, dispatch } = props;

  return (
    <div>
      <h2 style={{ color: 'white' }}>基本功能</h2>

      <span style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        <Button
          onClick={() => {
            console.log('cornerstoneElement', ImgViewer2D.cornerstoneElement);
            cornerstone.reset(ImgViewer2D?.cornerstoneElement);
          }}
          type="primary"
        >
          重置
        </Button>

        <Button
          onClick={() => {
            console.log('cornerstoneElement', ImgViewer2D.cornerstoneElement);
            if (!ImgViewer2D.cornerstoneElement) return;
            const viewport = cornerstone.getViewport(ImgViewer2D.cornerstoneElement);
            console.log('viewport', viewport);
            viewport.invert = !viewport.invert;
            cornerstone.setViewport(ImgViewer2D.cornerstoneElement, viewport);
          }}
          type="primary"
        >
          灰度反转
        </Button>

        <Button
          onClick={() => {
            console.log('cornerstoneElement', ImgViewer2D.cornerstoneElement);
            if (!ImgViewer2D.cornerstoneElement) return;
            const viewport = cornerstone.getViewport(ImgViewer2D.cornerstoneElement);
            console.log('viewport', viewport);
            viewport.rotation += 90;
            cornerstone.setViewport(ImgViewer2D.cornerstoneElement, viewport);
          }}
          type="primary"
        >
          顺时针旋转
        </Button>

        <Button
          onClick={() => {
            console.log('cornerstoneElement', ImgViewer2D.cornerstoneElement);
            if (!ImgViewer2D.cornerstoneElement) return;
            const viewport = cornerstone.getViewport(ImgViewer2D.cornerstoneElement);
            console.log('viewport', viewport);
            viewport.hflip = !viewport.hflip;
            cornerstone.setViewport(ImgViewer2D.cornerstoneElement, viewport);
          }}
          type="primary"
        >
          左右翻转
        </Button>

        <Button
          onClick={() => {
            if (!ImgViewer2D.cornerstoneElement) return;
            const viewport = cornerstone.getViewport(ImgViewer2D.cornerstoneElement);
            console.log('viewport', viewport);
            viewport.vflip = !viewport.vflip;
            cornerstone.setViewport(ImgViewer2D.cornerstoneElement, viewport);
          }}
          type="primary"
        >
          上下翻转
        </Button>

        <Button
          onClick={() => {
            if (!ImgViewer2D.cornerstoneElement) return;

            const enabledElement = cornerstone.getEnabledElement(ImgViewer2D.cornerstoneElement);
            console.log('enabledElement', enabledElement);

            const toolState = cornerstoneTools.globalImageIdSpecificToolStateManager.saveToolState();
            if (!toolState || toolState.hasOwnProperty(enabledElement.image.imageId) === false) {
              return;
            }
            const imageIdToolState = toolState[enabledElement.image.imageId];

            console.log('imageIdToolState', imageIdToolState);

            cornerstoneTools.globalImageIdSpecificToolStateManager.clear(
              ImgViewer2D.cornerstoneElement,
            );
            // 刷新
            cornerstone.updateImage(ImgViewer2D.cornerstoneElement);
          }}
          type="primary"
        >
          清除标记
        </Button>

        {/* <Button
          onClick={() => {
            if (!ImgViewer2D.cornerstoneElement) return;

            const enabledElement = cornerstone.getEnabledElement(ImgViewer2D.cornerstoneElement);

            // Retrieve this metaData
            const imagePlaneModule = cornerstone.metaData.get(
              'imagePlaneModule',
              enabledElement.image.imageId,
            );

            console.log('imagePlaneModule', imagePlaneModule);
          }}
          type="primary"


        >
          获取metadata
        </Button> */}

        <Select
          defaultValue="None"
          style={{ width: 120 }}
          onChange={(value) => {
            if (!ImgViewer2D.cornerstoneElement) return;
            const viewport = cornerstone.getViewport(ImgViewer2D.cornerstoneElement);
            console.log('viewport', viewport);

            console.log('getColormapsList', cornerstone.colors.getColormapsList());

            if (value === 'None') {
              viewport.colormap = '';
            } else {
              viewport.colormap = value;
            }
            cornerstone.setViewport(ImgViewer2D.cornerstoneElement, viewport);

            // cornerstone.convertToFalseColorImage(ImgViewer2D.cornerstoneElement, 'hotIron');
            // 刷新
            cornerstone.updateImage(ImgViewer2D.cornerstoneElement, true);
          }}
        >
          <Option value="None">None</Option>
          <Option value="hotIron">hotIron</Option>
          <Option value="pet">pet</Option>
          <Option value="hotMetalBlue">hotMetalBlue</Option>
          <Option value="pet20Step">pet20Step</Option>
        </Select>

        <Select
          defaultValue="SetDefaultWindowing"
          style={{ width: 120 }}
          onChange={(value) => {
            if (!ImgViewer2D.cornerstoneElement) return;
            const viewport = cornerstone.getViewport(ImgViewer2D.cornerstoneElement);
            console.log('viewport', viewport);

            if (value === 'SetDefaultWindowing') {
              const { image } = cornerstone.getEnabledElement(ImgViewer2D.cornerstoneElement);
              viewport.voi.windowCenter = image.windowCenter;
              viewport.voi.windowWidth = image.windowWidth;
              cornerstone.setViewport(ImgViewer2D.cornerstoneElement, viewport);
              return;
            }

            const Windowing = {
              SetBoneWindowing: { center: 300, width: 2000 },
              SetLungWindowing: { center: -600, width: 1600 },
            };

            viewport.voi.windowCenter = Windowing[value]?.center;
            viewport.voi.windowWidth = Windowing[value]?.width;
            cornerstone.updateImage(ImgViewer2D.cornerstoneElement, true);
          }}
        >
          <Option value="SetDefaultWindowing">SetDefaultWindowing</Option>
          <Option value="SetBoneWindowing">SetBoneWindowing</Option>
          <Option value="SetLungWindowing">SetLungWindowing</Option>
        </Select>

        <LayoutSettingButton dispatch={dispatch} />
      </span>

      <h2 style={{ color: 'white' }}>基础工具</h2>

      <span style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        <ConnectedToolButton toolName="Wwwc" />
        <ConnectedToolButton toolName="Zoom" />
        <ConnectedToolButton toolName="Pan" />

        <ConnectedToolButton toolName="DragProbe" />
        <ConnectedToolButton toolName="Magnify" />
        <ConnectedToolButton toolName="Rotate" />
        <ConnectedToolButton toolName="WwwcRegion" />
        <ConnectedToolButton toolName="StackScroll" />
      </span>

      <h2 style={{ color: 'white' }}>标注工具</h2>

      <span style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        <ConnectedToolButton toolName="Length" />
        <ConnectedToolButton toolName="Angle" />
        <ConnectedToolButton toolName="Bidirectional" />

        <ConnectedToolButton toolName="CircleRoi" />
        <ConnectedToolButton toolName="FreehandRoi" />
        <ConnectedToolButton toolName="Eraser" />
      </span>

      <h2 style={{ color: 'white' }}>自定义工具</h2>

      <span style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        <ConnectedToolButton toolName="HelloWorld" />
      </span>
    </div>
  );
};

const mapStateToProps = ({ ImgViewer2D }: { ImgViewer2D: StateType }) => {
  return {
    ImgViewer2D,
  };
};

export default connect(mapStateToProps)(LeftToolbar);
