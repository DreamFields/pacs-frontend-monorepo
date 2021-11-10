/*
 * @Author: linkenzone
 * @Date: 2021-11-03 16:36:29
 * @Descripttion:
 *
 * 左侧工具栏
 */

import React, { useState, useEffect, useContext, Fragment } from 'react';
import { Button, List, Input, Select, Menu, Switch } from 'antd';
import { observer } from 'mobx-react';
import { PlusSquareOutlined } from '@ant-design/icons';

import UiButton from './components/UiButton';
import UiSlider from './components/UiSlider';
import UiLine from './components/UiLine';
import UiSelect from './components/UiSelect';

import styles from './style.less';

const { SubMenu } = Menu;

type LeftToolbarProps = {
  // uiState: any;
  //   changeImgMove: (boolean) => void;

  width?: number;
  height?: number;
};

const LeftToolbar: React.FC<LeftToolbarProps> = observer((props) => {
  const [curKey, setcurKey] = useState(undefined);

  const { width, height } = props;

  return (
    <>
      <Menu
        theme="dark"
        onClick={(e) => {
          setcurKey(e.key);
        }}
        defaultOpenKeys={['sub1']}
        selectedKeys={[curKey]}
        mode="inline"
        style={{
          width: width || 200,
          height: height || 800,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <SubMenu key="sub1" title="2D操作">
          <UiLine text="基础操作" />

          <div className={styles.gui_button_list}>
            <UiButton text={'调窗'} />
            <UiButton text={'移动'} />
            <UiButton text={'缩放'} />
            <UiButton text={'翻转'} />
          </div>

          <UiLine text="截面" />

          <UiSlider text="x 截面" />
          <UiSlider text="y 截面" />
          <UiSlider text="z 截面" />

          <UiLine text="ww/wl" />

          <UiSlider text="ww" />
          <UiSlider text="wl" />

          <UiLine text="伪彩" />

          <UiSelect text="伪彩" list={[1, 2, 3, 4]} />
        </SubMenu>
      </Menu>
    </>
  );
});

export default LeftToolbar;
