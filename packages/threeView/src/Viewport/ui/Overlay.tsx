/*
 * @Author: linkenzone
 * @Date: 2021-07-23 18:02:14
 * @Descripttion: Do not edit
 */
import React, { useEffect } from 'react';
import styles from './style.less';

import View2DState from '../../store/View2DState';

import { observer } from 'mobx-react';

/**
 * 文本信息
 */
export interface DicomViewInfo {
  sliceNumber?: number;
  maxSliceNumber?: number;
  seriesNumber?: number;
  patientName?: string;
  patientId?: number;
  patientBirthDate?: string;
  instructionName?: string;
  windowWidth?: number;
  windowCenter?: number;
  pixelSpacing?: number;
  sliceThickness?: number;
  mouseX?: number;
  mouseY?: number;
  pixelHU?: number;
}

interface ArrowsProps {
  info?: DicomViewInfo;
  style?: React.CSSProperties;
}

const Overlay: React.FC<ArrowsProps> = observer((props) => {
  const { info, style } = props;

  const { windowLevel, windowWidth } = View2DState.stageState;

  return (
    <div
      className={styles.overlay}
      style={style}
      //   style={{
      //     position: 'absolute',
      //     height: 'calc(100% - 45px)',
      //     width: '100%',
      //     color: '#cde',
      //     zIndex: 1,
      //   }}
    >
      <div
        style={{
          position: 'absolute',
          top: '4px',
          left: '4px',
        }}
      >
        {`图像: ${info.sliceNumber}/${info.maxSliceNumber}`}
        <br />
        {`序列: ${info.seriesNumber}`}
      </div>

      <div
        style={{
          position: 'absolute',
          top: '4px',
          left: '50%',
        }}
      >
        {/*info: {info}*/}
      </div>

      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '4px',
        }}
      ></div>

      <div
        style={{
          position: 'absolute',
          top: '50%',
          right: '4px',
        }}
      >
        {/*info: {info}*/}
      </div>

      <div
        style={{
          position: 'absolute',
          top: '4px',
          right: '4px',
          textAlign: 'right',
        }}
      >
        {`${info.patientName}`} <br />
        {`${info.patientId}`} <br />
        {`${info.patientBirthDate}`} <br />
        {`${info.instructionName}`} <br />
        {/*info: {info}*/}
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '4px',
          right: '4px',
        }}
      >
        {/*info: {info}*/}
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '4px',
          left: '50%',
        }}
      >
        {/*info: {info}*/}
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '4px',
          left: '4px',
        }}
      >
        {/*{`X：${info.mouseX} Y: ${info.mouseY} 测值: ${info.pixelHU}`} <br />*/}
        {`X：${info.mouseX} Y: ${info.mouseY} `} <br />
        {`窗位：${windowLevel} 窗宽: ${windowWidth}`} <br />
        {`层厚：${info.sliceThickness} 层间距: ${info.pixelSpacing}`}
      </div>
    </div>
  );
});

export default Overlay;
