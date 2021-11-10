/*
 * @Author: linkenzone
 * @Date: 2021-11-03 20:48:13
 * @Descripttion: Do not edit
 */
import React, { useState, useEffect, useContext, Fragment } from 'react';
import { Divider } from 'antd';

interface UiLineProps {
  text?: string;
}

const UiLine: React.FC<UiLineProps> = (props) => {
  const { text } = props;

  return (
    <>
      {text ? (
        <div style={{ display: 'flex' }}>
          <div
            style={{
              background: '#5cc6e0',
              height: '2px',
              marginLeft: '12px',
              marginRight: '12px',
              marginTop: '8px',
              marginBottom: '8px',
              width: '30%',
            }}
          />
          <span style={{ lineHeight: '18px', width: '20%', textAlign: 'center' }}>{text}</span>
          <div
            style={{
              background: '#5cc6e0',
              height: '2px',
              marginLeft: '12px',
              marginRight: '12px',
              marginTop: '8px',
              marginBottom: '8px',
              width: '30%',
            }}
          />
        </div>
      ) : (
        <div
          style={{
            background: '#5cc6e0',
            height: '2px',
            marginLeft: '12px',
            marginRight: '12px',
            marginTop: '8px',
            marginBottom: '8px',
          }}
        />
      )}
    </>
  );
};

export default UiLine;
