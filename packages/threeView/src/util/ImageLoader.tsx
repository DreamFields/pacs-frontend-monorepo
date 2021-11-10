/* eslint-disable react-hooks/exhaustive-deps */
/*
 * @Author: linkenzone
 * @Date: 2021-07-23 01:11:02
 * @Descripttion: 负责加载DICOM文件
 */

import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
// import { getDicomSeriesImageData } from '../io/DicomLoader';
import { getDicomSeriesImageData } from '../io/OrthancDicomLoader';

type ImageLoaderProps = {
  uuid?: string;
};

const ImageLoader: React.FC<ImageLoaderProps> = observer((props) => {
  const { uuid } = props;

  /**
   * @description: 获取图片数据
   * @param {*}
   * @return {*}
   */
  const getImageData = async () => {
    const res = await getDicomSeriesImageData(uuid);
  };

  useEffect(() => {
    console.log('uuid', uuid);
    if (uuid ?? false) {
      getImageData();
    }

    return () => {};
  }, [uuid]);

  return <></>;
});

export default ImageLoader;
