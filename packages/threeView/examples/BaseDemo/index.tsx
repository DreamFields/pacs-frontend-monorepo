/*
 * @Author: linkenzone
 * @Date: 2021-07-07 11:03:48
 * @Descripttion: Do not edit
 */
import axios from 'axios';
import React from 'react';
import { BaseDemo, FiberBaseDemo } from '../../src';

const Demo: React.FC<unknown> = () => {
  return (
    <>
      <h1>three 例子</h1>
      <div style={{ height: '400px', border: '2px black solid' }}>
        <BaseDemo />
      </div>
      <h1>fiber 例子</h1>
      <div style={{ height: '400px', border: '2px black solid' }}>
        <FiberBaseDemo />
      </div>
    </>
  );
};

// 测试DICOM 解析

axios
  .get(
    'http://27.17.30.150:20083/instances/14c4365c-46c4b16e-1f43dda4-bc84db00-d6c41807/frames/0/raw',
    {},
  )
  .then(async (response: any) => {
    console.log('response 1111', typeof response.data);

    const pixelArray = _str2ab(response.data);

    console.log('pixelArray', pixelArray);

    console.log('new Uint16Array(buf)', new Uint16Array(response.data));
  })
  .catch(() => {
    console.log('一个文件获取失败');
    return [];
  });

function str2ab(str) {
  const buf = new TextEncoder().encode(str);

  console.log('buf', buf);

  const ar16 = new Uint16Array(
    buf.buffer,
    buf.byteOffset,
    buf.byteLength / Uint16Array.BYTES_PER_ELEMENT,
  );

  return ar16;
}

function _str2ab(str) {
  console.log('str.length', str.length);
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return new Uint16Array(buf);
}

export default Demo;
