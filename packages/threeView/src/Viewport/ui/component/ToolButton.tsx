/*
 * @Author: linkenzone
 * @Date: 2021-07-25 19:04:04
 * @Descripttion: Do not edit
 */
import { Button, Dropdown, Menu, Popover } from 'antd';
import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';

import style from './style.less';

import View2DState from '../../../store/View2DState';

type ToolButtonProps = {
  onClick: React.MouseEventHandler<HTMLElement>;
  toolType: string;
  width: number;
  isCheck: false;
};

const ToolButton: React.FC<ToolButtonProps> = observer((props) => {
  const { children, onClick, toolType, width, isCheck } = props;
  return (
    <Button
      type="link"
      style={{
        height: '48px',
        display: 'block',
        padding: '8px',
        margin: '0',
        width,
        color: '#39bbdb',
      }}
      onClick={onClick}
      className={`${isCheck ? style.LeftToolButton : ''} ${
        View2DState.toolType === toolType && isCheck ? style.LeftToolButton_active : ''
      }`}
    >
      {children}
    </Button>
  );
});

export default ToolButton;
