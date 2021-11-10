/*
 * @Author: linkenzone
 * @Date: 2021-05-25 21:27:23
 * @Descripttion: Do not edit
 *
 * 弃用
 */
// import React, { useEffect } from 'react';
// import { Button, Input, AutoComplete, List } from 'antd';
// import { Card } from 'antd';
// import style from './style.less';
// import type { Dispatch } from 'umi';
// import { connect } from 'umi';
// import type { StateType } from '../model';

// type PatientsProps = {
//   dispatch: Dispatch;
//   patientList: any[];
// };

// const Patients: React.FC<PatientsProps> = (props) => {
//   const { dispatch, patientList } = props;

//   useEffect(() => {
//     dispatch({
//       type: 'ImageFileManagment/fetchPatients',
//       payload: { params: { expand: '', since: 0, limit: 101 } },
//     });
//     // 销毁的时候
//     return () => {};
//   }, []);

//   return (
//     <>
//       <div className="global-search-wrapper" style={{ marginBottom: 10 }}>
//         <Card style={{ padding: 0, backgroundColor: '#fff9df' }}>
//           <h1>Insecure setup </h1>
//           <p>
//             Your orthanc server is accepting remote connections, but is using the default username
//             and password, or has user authentication explicitly turned off. Please carefully read
//             your logs and review your configuration, especially options RemoteAccessAllowed,
//             AuthenticationEnabled, and RegisteredUsers.
//           </p>
//           <Input
//             suffix={
//               <Button className="search-btn" style={{ marginRight: -5 }} type="primary">
//                 search
//               </Button>
//             }
//           />
//         </Card>
//       </div>
//       {/* <Card className="patient_card" hoverable={true}>
//         <p>PatientBirthDate: </p>
//         <p>PatientID: </p>
//         <p>PatientSex: </p>
//       </Card>
//       <Card className="patient_card" hoverable={true}>
//         <p>PatientBirthDate: </p>
//         <p>PatientID: </p>
//         <p>PatientSex: </p>
//       </Card>
//       <Card className="patient_card" hoverable={true}>
//         <p>PatientBirthDate: </p>
//         <p>PatientID: </p>
//         <p>PatientSex: </p>
//       </Card> */}

//       <List
//         itemLayout="horizontal"
//         dataSource={patientList}
//         renderItem={(item) => (
//           <List.Item>
//             <List.Item.Meta
//               // avatar={
//               //   <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
//               // }
//               title={item.MainDicomTags.PatientName}
//               description={
//                 <>
//                   <div>{`PatientBirthDate : ${item.MainDicomTags.PatientBirthDate}`}</div>
//                   <div>{`PatientID : ${item.MainDicomTags.PatientID}`}</div>
//                   <div>{`PatientSex : ${item.MainDicomTags.PatientSex}`}</div>
//                 </>
//               }
//             />
//           </List.Item>
//         )}
//       />
//     </>
//   );
// };

// const mapStateToProps = ({ ImageFileManagment }: { ImageFileManagment: StateType }) => {
//   return {
//     patientList: ImageFileManagment.patientList,
//   };
// };

// export default connect(mapStateToProps)(Patients);
