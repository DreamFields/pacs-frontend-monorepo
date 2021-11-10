/*
 * @Descripttion: Do not edit
 * @Author: linkenzone
 * @Date: 2021-04-22 17:01:46
 */
/*
 * @Descripttion: Do not edit
 * @Author: linkenzone
 * @Date: 2021-03-27 17:29:07
 */
import { Button, Dropdown, Menu, Popover, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import style from './style.less';
import type { Dispatch } from 'umi';
import { connect } from 'umi';

import type { StateType } from '@/models/View3d';

import { Viewer3D, FpsMonitorUi, VolumeControllerUi, IsoValueUi } from 'rayplus-vtkview';

import type { StateType as ViewStateType } from '@/models/ViewState';

type RightToolbarProps = {
  dispatch: Dispatch;
  View3d: StateType;
  ViewState: ViewStateType;
};

const { Option } = Select;

const RightToolbar: React.FC<RightToolbarProps> = (props) => {
  const { View3d, ViewState, dispatch } = props;

  return (
    <>
      {ViewState.layout.indexOf(2) !== -1 ? (
        <div style={{ overflowX: 'auto', overflowY: 'auto', height: '600px' }}>
          <span
            style={{
              display: 'block',
              color: '#39bbdb',
              textAlign: 'center',
              padding: '12px',
              fontSize: '18px',
            }}
          >
            3D显示
          </span>

          <div style={{ margin: 'auto', display: 'flex', padding: '12px' }}>
            <span
              style={{
                color: '#39bbdb',
                textAlign: 'center',
                fontSize: '18px',
                display: 'block',
                paddingLeft: '12px',
                paddingRight: '12px',
              }}
            >
              显示模式
            </span>
            <Select
              defaultValue="volume"
              style={{ width: 120 }}
              value={View3d.type}
              onChange={(value) => {
                dispatch({
                  type: 'View3d/save',
                  payload: { type: value },
                });
              }}
            >
              <Option value="volume">volume</Option>
              <Option value="contour">contour</Option>
            </Select>
          </div>

          <FpsMonitorUi style={{ margin: 'auto', width: '380px', height: '180px' }} />
          {View3d.type === 'volume' ? (
            <>
              <VolumeControllerUi
                style={{ margin: 'auto', width: '420px', height: '240px', position: 'relative' }}
              />
            </>
          ) : (
            <>
              <IsoValueUi
                style={{
                  display: 'flex',
                  color: '#39bbdb',
                  width: '300px',
                  height: '36px',
                  margin: 'auto',
                }}
              />
            </>
          )}
        </div>
      ) : null}
    </>
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

export default connect(mapStateToProps)(RightToolbar);
