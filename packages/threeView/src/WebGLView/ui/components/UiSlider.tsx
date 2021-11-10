/*
 * @Author: linkenzone
 * @Date: 2021-11-03 20:26:39
 * @Descripttion: Do not edit
 */

import React, { useState, useEffect, useContext, Fragment } from 'react';
import { Slider, InputNumber, Button, List, Input, Select, Menu, Switch, Row, Col } from 'antd';
import { observer } from 'mobx-react';
import { PlusSquareOutlined } from '@ant-design/icons';

import styles from './style.less';

interface UiButtonProps {
  text: string;
}

const UiSlider: React.FC<UiButtonProps> = (props) => {
  const { text } = props;

  const [inputValue, setInputValue] = useState(0);

  const onChange = (value) => {
    setInputValue(value);
  };

  return (
    <Row style={{ padding: '8px' }}>
      <Col span={4}>
        <span
          style={{
            lineHeight: '48px',
            color: 'white',
            textAlign: 'center',
            width: '100%',
            display: 'block',
          }}
        >
          {text}
        </span>
      </Col>

      <Col span={12} style={{ padding: '8px' }}>
        <Slider
          min={0}
          max={20}
          onChange={onChange}
          value={typeof inputValue === 'number' ? inputValue : 0}
        />
      </Col>
      <Col span={8} style={{ textAlign: 'center', paddingTop: '6px' }}>
        <div>
          <InputNumber
            min={0}
            max={20}
            style={{ margin: '0', lineHeight: '48px' }}
            value={inputValue}
            onChange={onChange}
          />
        </div>
      </Col>
    </Row>
  );
};

export default UiSlider;
