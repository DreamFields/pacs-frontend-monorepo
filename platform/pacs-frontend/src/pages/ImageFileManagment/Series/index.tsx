/*
 * @Author: linkenzone
 * @Date: 2021-06-08 19:47:23
 * @Descripttion: Do not edit
 */
import React, { useEffect, useState } from 'react';
import { getUUID } from '../utils/location';
import { ConnectedSeries } from '@/extension/orthanc';

const StudyPage: React.FC<{}> = () => {
  const [uuid, setUuid] = useState<string | null>(null);

  useEffect(() => {
    setUuid(getUUID());
    // 销毁的时候
    return () => {};
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <ConnectedSeries uuid={uuid} />
    </div>
  );
};

export default StudyPage;
