/*
 * @Author: linkenzone
 * @Date: 2021-11-03 21:12:53
 * @Descripttion: Do not edit
 */
import React, { useState, useEffect, useContext, Fragment } from 'react';
import { Slider, InputNumber, Button, List, Input, Select, Menu, Switch, Row, Col } from 'antd';
import { observer } from 'mobx-react';
import { PlusSquareOutlined } from '@ant-design/icons';

import styles from './style.less';

interface UiButtonProps {
  text: string;
  list: any[];
}

const { Option } = Select;

const UiSelect: React.FC<UiButtonProps> = (props) => {
  const { text, list } = props;

  const [selectValue, setSelectValue] = useState(undefined);

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

      <Col span={20} style={{ padding: '8px' }}>
        <Select
          style={{ width: '220px' }}
          value={selectValue}
          onChange={(value) => {
            setSelectValue(value);
          }}
        >
          {Object.keys(list).map((key) => (
            <Option key={key} value={list[key]}>
              {list[key]}
            </Option>
          ))}
        </Select>
      </Col>
    </Row>
  );
};

export default UiSelect;
