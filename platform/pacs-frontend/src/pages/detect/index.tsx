/*
 * @Author: Meng Tian
 * @Date: 2021-11-09 20:48:47
 * @Description: Do not edit
 */
import { Button, Card, List, Layout, Tooltip, Popconfirm, Popover, Image } from 'antd';
import { DownloadOutlined, DeleteFilled } from '@ant-design/icons';
import React, { useEffect } from 'react';
import type { Dispatch } from 'dva';
import { connect } from 'dva';
import { getUUID } from '../ImageFileManagment/utils/location';
import type { StateType } from './model';
import style from './index.less';
import { history } from 'umi';

const { Sider, Content } = Layout;

type DeteceProps = {
  dispatch: Dispatch;
  curPatientInfo: any;
  curStudyInfo: any;
  curSeriesInfo: any;
  curInstances: any;
  curHeaderKey: any;
  curHeaderValue: any;
  curDicom: any[];
  curDicomtags: any[];
  curDicomtagKey: any[];
  curDicomtagValue: any[];
  mainDicomKey: any[];
  mainDicomValue: any[];
  parentSeriesId: any;
  fetchSeriesLoading: boolean;
};

const Detect: React.FC<DeteceProps> = (props) => {
  const {
    dispatch,
    curPatientInfo,
    curStudyInfo,
    curSeriesInfo,
    curInstances,
    curHeaderKey,
    curHeaderValue,
    curDicomtagKey,
    // curDicomtagValue,
    mainDicomKey,
    mainDicomValue,
    fetchSeriesLoading,
  } = props;

  const uuid = getUUID();
  
  useEffect(() => {
    if (uuid === null) return;
    dispatch({
      type: 'Orthanc_instances/fetchInstances',
      payload: { uuid },
    });
    // 销毁的时候
    // return () => {};
  }, [uuid]);

  return (
    <>
      <Layout style={{ margin: '15px' }}>
        <Sider theme="light" width="20%">
          <div style={{ paddingRight: '12px' /* , display: 'inline-block', width: '800px' */ }}>
            <Card
              //   style={{ width: '300px', display: 'inline-block' }}
              title={
                <>
                  <p style={{ color: 'white' }}>原图</p>
                </>
              }
              bodyStyle={{ padding: '12px' }}
              headStyle={{ backgroundColor: '#39bbdb' }}
              size="small"
            >
              <Image src={`/api/instances/${uuid}/preview`} />
              <p className={style.custom_p} style={{ marginTop: 8 }}>
                序列: {curInstances?.IndexInSeries}
              </p>
              <p className={style.custom_p}>
                ImageOrientationPatient: {curInstances?.MainDicomTags.ImageOrientationPatient}
              </p>
              <p className={style.custom_p}>
                ImagePositionPatient: {curInstances?.MainDicomTags.ImagePositionPatient}
              </p>
              <p className={style.custom_p}>
                SOPInstanceUID: {curInstances?.MainDicomTags.SOPInstanceUID}
              </p>
            </Card>

            {/* <Card title="操作" headStyle={{ backgroundColor: '#39bbdb' }} size="small">
              
            </Card> */}
          </div>
        </Sider>

        <Layout>
          <Content style={{ background: 'white' }} className={'Content_List_Header'}>
            <Card
              //   style={{ width: '300px', display: 'inline-block', marginLeft: '15px' }}
              title={
                <>
                  <p style={{ color: 'white', display: 'inline-block' }}>预处理结果</p>
                  <Button type="primary" style={{ marginLeft: '10px' }} onClick={() => {
                      dispatch({
                        type: 'detect/preProcess',
                        payload: { uuid },
                      });
                  }}>
                    预处理
                  </Button>
                </>
              }
              bodyStyle={{ padding: '12px' }}
              headStyle={{ backgroundColor: 'rgb(146 150 229)' }}
              size="small"
            >
              <Image src={`/api/instances/${uuid}/preview`} height={200} />
            </Card>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

const mapStateToProps = ({
  Orthanc_instances,
  loading,
}: {
  Orthanc_instances: StateType;
  loading: { effects: Record<string, boolean> };
}) => {
  return {
    fetchSeriesLoading: loading.effects['Orthanc_instances/fetchInstance'],
    curDicom: Orthanc_instances.curDicom,
    curPatientInfo: Orthanc_instances.curPatientInfo,
    curStudyInfo: Orthanc_instances.curStudyInfo,
    curSeriesInfo: Orthanc_instances.curSeriesInfo,
    curInstances: Orthanc_instances.curInstances,
    curHeaderKey: Orthanc_instances.curHeaderKey,
    curHeaderValue: Orthanc_instances.curHeaderValue,
    curDicomtags: Orthanc_instances.curDicomtags,
    curDicomtagKey: Orthanc_instances.curDicomtagKey,
    curDicomtagValue: Orthanc_instances.curDicomtagValue,
    mainDicomKey: Orthanc_instances.mainDicomKey,
    mainDicomValue: Orthanc_instances.mainDicomValue,
    parentSeriesId: Orthanc_instances.parentSeriesId,
  };
};

export default connect(mapStateToProps)(Detect);
