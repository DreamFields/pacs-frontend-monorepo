/*
 * @Author: linkenzone
 * @Date: 2021-07-11 09:48:46
 * @Descripttion: Do not edit
 */
import React, { useEffect } from 'react';

import { getDicomSeriesImageData } from 'rayplus-three-view';

const Demo: React.FC<unknown> = () => {
  const getImageData = async () => {
    const res = await getDicomSeriesImageData('26b33bc0-287f252e-644798bc-0bb0d296-80e197a6');
    console.log('result', res);
  };

  useEffect(() => {
    getImageData();
  }, []);

  return <div style={{ height: '800px' }}></div>;
};

export default Demo;
