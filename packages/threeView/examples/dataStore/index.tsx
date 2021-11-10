/*
 * @Author: linkenzone
 * @Date: 2021-07-13 11:13:59
 * @Descripttion: Do not edit
 */
import React from 'react';
import { observer } from 'mobx-react';
import { useEffect } from 'react';
import { Button } from 'antd';

import ImageArray from '../../src/store/ImageArray';
import { ImageLoader } from '../../src';

// b5981569-302c412a-6ced2c80-fd877f65-933991a4
// bfd34afd-f97a9f7c-c0551428-93a0c48a-0285c8ce
// c6f47218-346f1920-f2fa54ea-34b5459a-3f0b9aca

// 大数据
// d423f22c-33405061-8507ee8f-c313d5fc-ba887144

const Demo: React.FC<any> = observer((props) => {
  const { imageType } = props.store;
  useEffect(() => {
    console.log('imageType 发生改变', imageType);
    console.log('imageType 发生改变', props);
  }, [imageType]);

  return (
    <div style={{ height: '800px' }}>
      <ImageLoader uuid="b5981569-302c412a-6ced2c80-fd877f65-933991a4" />
      <p>imageType: {imageType}</p>
      <Button
        onClick={() => {
          console.log('store', props.store.changeImageType);
          props.store.changeImageType();
        }}
      >
        change
      </Button>
    </div>
  );
});

const store = ImageArray;

console.log('store', store);
console.log('store', store.changeImageType);

// store.changeImageType();

const DemoConnect = () => {
  return <Demo store={store}></Demo>;
};

export default DemoConnect;
