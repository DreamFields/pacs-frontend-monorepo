/*
 * @Author: linkenzone
 * @Date: 2021-06-30 16:17:57
 * @Descripttion: Do not edit
 */
import React, { useState, useEffect, useRef } from 'react';

import { vtkViewContext } from './vtkViewContext';

import { proxyManager } from '../config/proxyManager';

import { getDicomSeriesImageData } from '../io/dicom';

type vtkViewProviderProps = {
  children: React.ReactNode;
  uuid: string;
};

export const VtkViewProvider: React.FC<vtkViewProviderProps> = (props) => {
  const { children, uuid } = props;

  const [value, setValue] = useState({ source: null });

  const [imageSource, setImageSource] = useState(
    proxyManager.createProxy('Sources', 'TrivialProducer', {
      name: 'Image',
    }),
  );

  const loadData = async () => {
    const imageData = await getDicomSeriesImageData(uuid);
    imageSource.setInputData(imageData);
    setImageSource(imageSource);
    setValue({ ...value, source: imageSource });
  };

  useEffect(() => {
    loadData();
  }, [uuid]);

  return <vtkViewContext.Provider value={value}>{children}</vtkViewContext.Provider>;
};
