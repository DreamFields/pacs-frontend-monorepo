/*
 * @Author: linkenzone
 * @Date: 2021-11-03 19:27:41
 * @Descripttion: Do not edit
 */
import React, { useState, useEffect, useContext, Fragment } from 'react';
import { Button, List, Input, Select, Menu, Switch } from 'antd';
import { observer } from 'mobx-react';
import { PlusSquareOutlined } from '@ant-design/icons';

import styles from './style.less';

interface UiButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  text: string;
}

const UiButton: React.FC<UiButtonProps> = (props) => {
  const { text } = props;

  return (
    <button className={styles.gui_button} {...props}>
      <div className={styles.gui_icon_container}>
        <PlusSquareOutlined className={styles.gui_icon} />
      </div>
      <span className={styles.gui_button_text}>{text}</span>
    </button>
  );
};

export default UiButton;
