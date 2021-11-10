/*
 * @Descripttion: Do not edit
 * @Author: linkenzone
 * @Date: 2021-04-02 14:41:11
 */
import React, { useEffect, useState } from 'react';
import { View2D, ImageLoader } from 'rayplus-three-view';
import { Viewer3D, FpsMonitorUi, VolumeControllerUi, IsoValueUi } from 'rayplus-vtkview';

import type { Dispatch } from 'umi';
import { connect } from 'umi';

import type { StateType } from '@/models/View3d';
import type { StateType as ViewStateType } from '@/models/ViewState';
import { getUUID } from '@/pages/ImageFileManagment/utils/location';
import { FullscreenOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';

type ImgViewerbarProps = {
  dispatch: Dispatch;
  View3d: StateType;
  ViewState: ViewStateType;
};

const ImgViewer: React.FC<ImgViewerbarProps> = (props) => {
  const { View3d, ViewState, dispatch } = props;

  const [uuid, setUuid] = useState<string | undefined>(undefined);

  useEffect(() => {
    console.log('props', props);
    const _uuid = getUUID();

    setUuid(_uuid || undefined);

    return () => {};
  }, []);

  const BottomNav = (value: number) => {
    return (
      <div
        style={{
          height: '45px',
          background: '#414141',
          padding: '4px',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <div>
          <Tooltip title="fullScreen">
            <Button
              icon={<FullscreenOutlined />}
              type="link"
              size="large"
              onClick={() => {
                if (ViewState.layout.length === 4) {
                  dispatch({
                    type: 'ViewState/save',
                    payload: { layout: [value] },
                  });
                } else {
                  dispatch({
                    type: 'ViewState/save',
                    payload: { layout: [1, 2, 3, 4] },
                  });
                }
              }}
            />
          </Tooltip>
        </div>
      </div>
    );
  };

  const fourViewStyle = {
    width: '100%',
    height: '100%',
    display: 'grid',
    gridColumnGap: '2px',
    gridRowGap: '2px',
    gridTemplateRows: '1fr 1fr',
    gridTemplateColumns: '1fr 1fr',
  };

  const OneViewStyle = {
    width: '100%',
    height: '100%',
    display: 'block',
  };

  return (
    <div style={{ height: 'calc(100% - 72px)' }}>
      <ImageLoader uuid={uuid}></ImageLoader>

      <div style={{ width: '100%', height: '100%', backgroundColor: '#313131' }}>
        <div style={ViewState.layout.length === 4 ? fourViewStyle : OneViewStyle}>
          {ViewState.layout.indexOf(1) !== -1 ? (
            <div style={{ minHeight: 0, minWidth: 0, border: '1px solid black', height: '100%' }}>
              <div style={{ height: 'calc(100% - 45px)' }}>
                <View2D type="Saggital" />
              </div>
              {BottomNav(1)}
            </div>
          ) : null}

          {ViewState.layout.indexOf(2) !== -1 ? (
            <div style={{ minHeight: 0, minWidth: 0, border: '1px solid black', height: '100%' }}>
              <div style={{ width: '100%', height: 'calc(100% - 45px)' }}>
                {View3d.type === 'volume' ? (
                  <Viewer3D uuid={uuid} style={{ width: '100%', height: '100%' }} type="volume" />
                ) : (
                  <Viewer3D uuid={uuid} style={{ width: '100%', height: '100%' }} type="contour" />
                )}
              </div>
              {BottomNav(2)}
            </div>
          ) : null}

          {ViewState.layout.indexOf(3) !== -1 ? (
            <div style={{ minHeight: 0, minWidth: 0, border: '1px solid black', height: '100%' }}>
              <div style={{ height: 'calc(100% - 45px)' }}>
                <View2D type="Coronal" />
              </div>
              {BottomNav(3)}
            </div>
          ) : null}

          {ViewState.layout.indexOf(4) !== -1 ? (
            <div style={{ minHeight: 0, minWidth: 0, border: '1px solid black', height: '100%' }}>
              <div style={{ height: 'calc(100% - 45px)' }}>
                <View2D type="Transverse" />
              </div>
              {BottomNav(4)}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({
  View3d,
  ViewState,
}: {
  View3d: StateType;
  ViewState: ViewStateType;
}) => {
  return {
    View3d,
    ViewState,
  };
};

export default connect(mapStateToProps)(ImgViewer);
