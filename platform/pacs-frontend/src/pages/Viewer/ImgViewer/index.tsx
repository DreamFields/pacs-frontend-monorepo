/*
 * @Descripttion: Do not edit
 * @Author: linkenzone
 * @Date: 2021-04-02 14:41:11
 */
import React, { useEffect, useState } from 'react';
// import CornerstoneViewport from 'react-cornerstone-viewport';
// import { useResizeDetector } from 'react-resize-detector';
// import type { Dispatch } from 'umi';
// import { connect } from 'umi';
// import style from './style.less';

import { ConnectedViewport } from '@/extension/cornerstone';
import { getUUID } from '@/pages/ImageFileManagment/utils/location';

import cornerstone from 'cornerstone-core';
import type { Dispatch } from 'umi';
import { connect } from 'umi';

type ImgViewerProps = {
  dispatch: Dispatch;
  ImgViewer2D: any;
};

const ImgViewer: React.FC<ImgViewerProps> = (props) => {
  const { ImgViewer2D, dispatch } = props;

  const [uuid, setUuid] = useState<string | null>(null);

  useEffect(() => {
    console.log('props', props);
    setUuid(getUUID());
    dispatch({
      type: 'ImgViewer2D/fetchSeries',
      payload: { series: getUUID() },
    }).then(() => {
      // console.log('ImgViewer2D.cornerstoneElement', ImgViewer2D.cornerstoneElement);
      if (!ImgViewer2D.cornerstoneElement) return;
      // 刷新
      cornerstone.updateImage(ImgViewer2D.cornerstoneElement);
    });
    return () => {};
  }, []);

  return (
    <div style={{ height: 'calc(100% - 72px)' }}>
      <ConnectedViewport />
    </div>
  );
};

const mapStateToProps = ({ ImgViewer2D }: { ImgViewer2D: any }) => {
  return {
    ImgViewer2D,
  };
};

export default connect(mapStateToProps)(ImgViewer);

// export default ImgViewer;
