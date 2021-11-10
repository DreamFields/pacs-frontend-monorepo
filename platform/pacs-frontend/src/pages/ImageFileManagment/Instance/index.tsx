/*
 * @Author: linkenzone
 * @Date: 2021-06-08 19:47:23
 * @Descripttion: Do not edit
 */
import React, { useEffect, useState } from 'react';
import { getUUID } from '../utils/location';
import { ConnectedInstance } from '@/extension/orthanc';

const InstancePage: React.FC<{}> = () => {
  const [uuid, setUuid] = useState<string | null>(null);

  useEffect(() => {
    setUuid(getUUID());
    // 销毁的时候
    return () => {};
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <ConnectedInstance uuid={uuid} />
    </div>
  );
};

export default InstancePage;
