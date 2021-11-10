/*
 * @Descripttion: Do not edit
 * @Author: linkenzone
 * @Date: 2021-03-23 23:03:47
 */
import React from 'react';

import { ConnectedAllPatients } from '@/extension/orthanc';

const AllPatientsPage: React.FC<{}> = () => {
  return (
    <div style={{ padding: '24px' }}>
      <ConnectedAllPatients />
    </div>
  );
};

export default AllPatientsPage;
