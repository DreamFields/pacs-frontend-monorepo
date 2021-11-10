/*
 * @Descripttion: Do not edit
 * @Author: linkenzone
 * @Date: 2021-04-09 14:41:07
 */
import { BarsOutlined, DownloadOutlined, SettingOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Dropdown, Input, InputNumber, Menu } from 'antd';
import React, { useState, useEffect } from 'react';
import style from './style.less';
import type { Dispatch } from 'umi';
import { connect, useIntl } from 'umi';
import type { StateType } from '@/models/cornerstone/model';
import cornerstone from 'cornerstone-core';
import { getUUID } from '@/pages/ImageFileManagment/utils/location';

const ToolButton: React.FC<{ onClick?: () => void }> = (props) => {
  const { children, onClick } = props;
  return (
    <Button
      type="link"
      style={{ height: '48px', width: '48px', display: 'inline-block', padding: '0', margin: '0' }}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

const menu = (
  <Menu style={{ width: 144, textAlign: 'center' }}>
    <Menu.Item className={style.ment_item}>配准融合</Menu.Item>
    <Menu.Item className={style.ment_item}>ROI分析</Menu.Item>
    <Menu.Item className={style.ment_item}>功能分析</Menu.Item>
    <Menu.Item className={style.ment_item}>手术规划</Menu.Item>
    <Menu.Item className={style.ment_item}>药代动力学分析</Menu.Item>
  </Menu>
);

type TopToolbarProps = {
  dispatch: Dispatch;
  ImgViewer2D: StateType;
};

const TopToolbar: React.FC<unknown> = (props) => {
  const { ImgViewer2D, dispatch } = props;

  const [imageQuality, setImageQuality] = useState(100);

  return (
    <div style={{ marginRight: '36px', height: '48px', display: 'flex' }}>
      {/* <ToolButton
        onClick={() => {
          console.log('点击上传');
        }}
      >
        <UploadOutlined style={{ fontSize: '28px' }} />
      </ToolButton> */}
      {/* <ToolButton>
        <DownloadOutlined style={{ fontSize: '28px' }} />
      </ToolButton> */}
      <Dropdown overlay={menu} placement="bottomCenter" arrow>
        <a
          style={{
            height: '48px',
            width: '48px',
            textAlign: 'center',
            paddingTop: '10px',
          }}
        >
          <BarsOutlined style={{ fontSize: '28px', display: 'block' }} />
        </a>
      </Dropdown>
      <ToolButton>
        <SettingOutlined style={{ fontSize: '28px' }} />
      </ToolButton>

      <div style={{ marginLeft: '48px', color: 'white' }}>
        图片质量:
        <InputNumber
          value={imageQuality}
          style={{ marginLeft: '12px', marginRight: '12px' }}
          min={0}
          max={100}
          onChange={(e) => {
            setImageQuality(e);
            dispatch({
              type: 'ImgViewer2D/save',
              payload: { imageQuality: e },
            });
          }}
        />
        <Button
          type="primary"
          onClick={() => {
            dispatch({
              type: 'ImgViewer2D/fetchSeries',
              payload: { series: getUUID() },
            }).then(() => {
              if (!ImgViewer2D.cornerstoneElement) return;
              // 刷新
              cornerstone.updateImage(ImgViewer2D.cornerstoneElement);
            });
          }}
        >
          重新加载
        </Button>
      </div>
    </div>
  );
};

const mapStateToProps = ({ ImgViewer2D }: { ImgViewer2D: StateType }) => {
  return {
    ImgViewer2D,
  };
};

export default connect(mapStateToProps)(TopToolbar);
