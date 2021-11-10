/*
 * @Author: linkenzone
 * @Date: 2021-07-25 19:57:33
 * @Descripttion: Do not edit
 */
import React, { useEffect, useState } from 'react';
import { LeftToolsBar } from 'rayplus-three-view';
import { useResizeDetector } from 'react-resize-detector';

const LeftToolbar: React.FC<unknown> = (props) => {
  // useResizeDetector
  const { width: containerWidth, height: containerHeight, ref: containerRef } = useResizeDetector();

  return (
    <div
      style={{ width: 'inherit', height: 'calc(100% - 72px)', backgroundColor: '#4a4a4a' }}
      ref={containerRef}
    >
      <LeftToolsBar width={containerWidth || 0} height={containerHeight || 0} />
    </div>
  );
};

export default LeftToolbar;
