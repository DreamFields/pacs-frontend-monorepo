/*
 * @Descripttion: Do not edit
 * @Author: linkenzone
 * @Date: 2021-03-23 23:03:47
 */
import React, { useEffect, useState } from 'react';
import { getUUID } from '../utils/location';
import { ConnectedPatient } from '@/extension/orthanc';

const AllPatientsPage: React.FC<{}> = () => {
  const [uuid, setUuid] = useState<string | null>(null);

  useEffect(() => {
    setUuid(getUUID());
    // 销毁的时候
    return () => {};
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <ConnectedPatient uuid={uuid} />
    </div>
  );
};

export default AllPatientsPage;
