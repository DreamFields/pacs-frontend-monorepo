/*
 * @Descripttion: 右侧的工具栏
 * @Author: linkenzone
 * @Date: 2021-03-23 16:26:09
 */

import type { CSSProperties } from 'react';
import React, { useEffect, useState } from 'react';
import { Avatar, Menu, Dropdown, Modal, Button, Badge, Popover } from 'antd';
import { connect, useModel, history } from 'umi';
import { BellOutlined, HomeOutlined, UploadOutlined } from '@ant-design/icons';

interface RightToolBarProps {
  // onClickSign: () => void;
  bodyStyle?: CSSProperties;
}

const ToolButton: React.FC<{ onClick?: () => void; style?: CSSProperties }> = (props) => {
  const { children, onClick, style } = props;
  return (
    <Button
      type="link"
      style={style}
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
    >
      {children}
    </Button>
  );
};

ToolButton.defaultProps = {
  style: {
    height: '48px',
    width: '48px',
    display: 'inline-block',
    padding: '0',
    margin: '0',
  },
};

const RightToolBar: React.FC<RightToolBarProps> = (props) => {
  const { bodyStyle } = props;
  // 获取基础信息
  const { initialState, loading, refresh, setInitialState } = useModel('@@initialState');

  // const menu = (
  //   <Menu style={{ width: 144, textAlign: 'center' }}>
  //     <Menu.Item style={{ fontWeight: 700, fontSize: '14px', fontFamily: 'initial' }}>
  //       配准融合
  //     </Menu.Item>
  //     <Menu.Item style={{ fontWeight: 700, fontSize: '14px', fontFamily: 'initial' }}>
  //       ROI分析
  //     </Menu.Item>
  //     <Menu.Item style={{ fontWeight: 700, fontSize: '14px', fontFamily: 'initial' }}>
  //       功能分析
  //     </Menu.Item>
  //     <Menu.Item style={{ fontWeight: 700, fontSize: '14px', fontFamily: 'initial' }}>
  //       手术规划
  //     </Menu.Item>
  //     <Menu.Item style={{ fontWeight: 700, fontSize: '14px', fontFamily: 'initial' }}>
  //       药代动力学分析
  //     </Menu.Item>
  //   </Menu>
  // );

  return (
    <div style={bodyStyle}>
      <ToolButton
        style={{
          height: '48px',
          width: '72px',
          display: 'inline-block',
          padding: '0',
          margin: '0',
        }}
        onClick={() => {
          console.log('3d');
          history.push('/3d');
        }}
      >
        三维Demo
      </ToolButton>

      <ToolButton
        onClick={() => {
          console.log('回到首页');
          history.push('/');
        }}
      >
        <HomeOutlined style={{ fontSize: '28px' }} />
      </ToolButton>

      <div
        style={{
          display: 'inline-block',
          width: '2px',
          backgroundColor: '#39bbdb',
          height: '32px',
          marginTop: '8px',
          marginLeft: '8px',
          marginRight: '8px',
        }}
      />

      <ToolButton
        onClick={() => {
          console.log('点击上传');
          history.push('/Upload');
        }}
      >
        <UploadOutlined style={{ fontSize: '28px' }} />
      </ToolButton>

      <Popover placement="bottom" title={'消息通知'} content={'xxxx'} trigger="click">
        <ToolButton>
          <Badge count={10} overflowCount={99} size="small" offset={[2, 5]}>
            <BellOutlined style={{ fontSize: '28px', color: '#39bbdb' }} />
          </Badge>
        </ToolButton>
      </Popover>
    </div>
  );
};

export default connect()(RightToolBar);
