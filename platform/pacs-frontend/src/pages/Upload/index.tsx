/*
 * @Descripttion:
 * @Author: linkenzone
 * @Date: 2021-03-02 11:12:47
 */
import React, { useState, useEffect } from 'react';

import { UploadFilesComponent } from '@/extension/orthanc';

export default () => {
  useEffect(() => {
    return () => {};
  }, []);

  return (
    <div>
      <UploadFilesComponent bodyStyle={{ padding: '24px' }} />
    </div>
  );
};
