// 弃用

// import { Button, Input, Slider, Tag } from 'antd';
// import { useEffect, useRef, useState } from 'react';
// import config from '../../src/config/config';
// import axios from 'axios';
// import DaikonImageHelper from '../../src/io/utils/DaikonImageHelper';
// // import { getDicomSeriesImageData } from '../../src/io/DicomLoader';
// import { observer } from 'mobx-react';
// import ImageArray from '../../src/store/ImageArray';
// import { Layer, Stage, Image, Text } from 'react-konva';
// /*
//  * @Author: Meng Tian
//  * @Date: 2021-09-27 15:09:44
//  * @Description: Do not edit
//  */
// const { TextArea } = Input;
// const Demo: React.FC<any> = observer((props) => {
//   const URL_PER = config.DICOM_URL;

//   //
//   const [uuid, setuuid] = useState('b5981569-302c412a-6ced2c80-fd877f65-933991a4');

//   const [seriesTags, setseriesTags] = useState(null);

//   /* // 获取node
//   const stageRef: any = useRef(); // 整个stage
//   const [imgCanvas, setimgCanvas] = useState(undefined);
//   const imageRef: any = useRef(); // 图片数据层
//   const sliceNumRef = useRef(1);
//   const [sliceNum, setSliceNum] = useState(1);
//   const [maxSliceNum, setMaxSliceNum] = useState(50);
//  */
//   const [pixels, setPixels] = useState(null);

//   // eslint-disable-next-line @typescript-eslint/no-shadow
//   const getDicomSeriesPath = async (uuid: string) => {
//     const files_paths: string[] = [];

//     const url_last = 'file';

//     await axios
//       .get(`${URL_PER}/series/${uuid}`)
//       .then((response: any) => {
//         const { Instances } = response.data;
//         // eslint-disable-next-line guard-for-in
//         for (const index in Instances) {
//           files_paths.push(`${URL_PER}/instances/${Instances[index]}/${url_last}`);
//         }
//       })
//       .catch((error) => {
//         console.log('文件路径获取失败', error);
//       });

//     console.log('files_paths', files_paths);
//     return files_paths;
//   };

//   const getNumberArray = (stringArray) => {
//     return stringArray.map(Number);
//   };

//   function str2ab(str) {
//     const buf = new TextEncoder().encode(str);

//     const ar16 = new Uint16Array(buf.buffer, buf.byteOffset, buf.byteLength);

//     return ar16;
//   }

//   // 对比两个数组的数据
//   const cmpPixels = async () => {
//     let f_pixels;
//     let m_pixels: Uint16Array;
//     let r_pixels;
//     const files_paths = await getDicomSeriesPath(uuid);

//     // await axios
//     //   .get(files_paths[0].replace('file', 'matlab'), {
//     //     // responseType: 'arraybuffer',
//     //     headers: { Accept: 'application/json, text/javascript, */*; q=0.01' },
//     //   })
//     //   .then((response) => {
//     //     const fileData = response.data.slice(9);
//     //     const dataArray = getNumberArray(fileData.split(' '));
//     //     // m_pixels = new Uint16Array(dataArray.splice(512));
//     //     m_pixels = new Uint16Array(dataArray);
//     //     // setm_pixels(m_pixels);
//     //     console.log('/matlab得到的pixels', m_pixels);
//     //   });

//     await axios
//       .get(files_paths[0].replace('file', 'frames/0/raw'), {
//         // responseType: 'arraybuffer',
//         headers: { Accept: 'application/json, text/javascript, */*; q=0.01' },
//       })
//       .then((response) => {
//         m_pixels = str2ab(response.data);
//         // setm_pixels(m_pixels);
//         console.log('/frames/0/raw得到的pixels', m_pixels);
//       });

//     await axios
//       .get(files_paths[0], {
//         responseType: 'arraybuffer',
//         headers: { Accept: 'application/json, text/javascript, */*; q=0.01' },
//       })
//       .then((response: any) => {
//         // console.log('/file得到的数据', response.data);
//         const dataFile = new DataView(response.data);
//         const daikonImageHelper = new DaikonImageHelper();
//         daikonImageHelper.setDataFile(dataFile);
//         f_pixels = new Uint16Array(daikonImageHelper.rawData);
//         // setf_pixels(f_pixels);
//         console.log('/file得到的pixels:', f_pixels);
//       });
//     const len = Math.min(m_pixels.length, f_pixels.length);
//     let count = 0;
//     for (let index = 0; index < len; index++) {
//       if (m_pixels[index] !== f_pixels[index]) {
//         console.log(
//           '第',
//           index,
//           '个元素出现不同',
//           'm_pixels[index]=',
//           m_pixels[index],
//           'f_pixels[index]=',
//           f_pixels[index],
//           'm_pixels[index]-f_pixels[index]',
//           m_pixels[index] - f_pixels[index],
//         );
//         count += 1;
//       }
//     }
//     console.log('比对完毕,不同计数', count);
//   };

//   const cmpFiles = async () => {
//     const files_paths = await getDicomSeriesPath(uuid);

//     //orthanc
//     const orthancImageHelper = new OrthancImageHelper();
//     // 获取rawData
//     const fetchFiles = files_paths.map((file_path, index) => {
//       const path = file_path;
//       return axios
//         .get(path.replace('file', 'frames/0/raw'), {})
//         .then(async (response: any) => {
//           // console.log('response', response.data);
//           orthancImageHelper.setPixels(response.data);
//           const pixSrc = orthancImageHelper.pixels;
//           // console.log('图片pixSrc:', pixSrc);
//           return pixSrc;
//         })
//         .catch(() => {
//           console.log('一个文件获取失败');
//           return [];
//         });
//     });
//     const orhancFiles = await Promise.all(fetchFiles);
//     // console.log('orhancFiles', orhancFiles);

//     // daikon
//     const daikonImageHelper = new DaikonImageHelper();
//     // 获取rawData
//     const fetchDikonFiles = files_paths.map((file_path, index) => {
//       const path = file_path;
//       return axios
//         .get(path, {
//           responseType: 'arraybuffer',
//           headers: { Accept: 'image/jpeg' },
//         })
//         .then(async (response: any) => {
//           // console.log('response', response.data);

//           const dataFile = new DataView(response.data);
//           daikonImageHelper.setDataFile(dataFile);

//           const pixs = daikonImageHelper.rawData;
//           // console.log('图片 rawData:', pixs);

//           const pixSrc = new Uint16Array(pixs);
//           // console.log('图片 piSrc', pixSrc);
//           return pixSrc;
//         })
//         .catch(() => {
//           console.log('一个文件获取失败');
//           return [];
//         });
//     });
//     const dikonfiles = await Promise.all(fetchDikonFiles);
//     console.log('dikonfiles', dikonfiles);

//     const len = files_paths.length;
//     for (let index = 0; index < len; index++) {
//       const orEle = orhancFiles[index];
//       const diEle = dikonfiles[index];
//       console.log('orEle len=', orEle.length);
//       console.log('diEle len=', diEle.length);
//       console.log('比较图片张数', index);
//       console.log('orEle=', orEle);
//       console.log('diEle=', diEle);
//       let count = 0;
//       for (let i = 0; i < 262144; i++) {
//         if (orEle[i] !== diEle[i]) {
//           if (count === 0) {
//             console.log('第一个不同的下标为', i);
//           }
//           count += 1;
//         }
//       }
//       console.log('不同的数据有', count);
//     }
//   };

//   const parserDicomOrthanc = async () => {
//     const files_paths = await getDicomSeriesPath(uuid);

//     // 仅从第一个文件中 获取 metadata
//     // ----------------------------
//     const requestUrl = files_paths[0].replace('file', 'tags?simplify');
//     // 利用Orthc
//     await axios
//       .get(requestUrl, {
//         // responseType: 'arraybuffer',
//         headers: { Accept: 'application/json, text/javascript, */*; q=0.01' },
//       })
//       .then((response) => {
//         const tagsData = response.data;
//         console.log('tagsData', tagsData);
//         setseriesTags(tagsData);
//         // const orthancImageHelper = new OrthancImageHelper(tagsData, null);
//       });

//     await axios
//       .get(files_paths[0].replace('file', 'matlab'), {
//         // responseType: 'arraybuffer',
//         headers: { Accept: 'application/json, text/javascript, */*; q=0.01' },
//       })
//       .then((response: any) => {
//         const fileData = response.data.slice(9);
//         const dataArray = getNumberArray(fileData.split(' '));
//         // m_pixels =
//         const pix = new Uint16Array(dataArray.splice(512));
//         setPixels(pix);
//         console.log('/matlab得到的pixels', pixels);
//       });

//     cmpPixels();
//   };

//   const parserDicomDaikon = async () => {
//     /* const res = await getDicomSeriesImageData(uuid);
//     if (res) {
//       render(sliceNum);
//     } */
//   };

//   const getUuid = ({ target: { value } }) => {
//     setuuid(value);
//   };

//   return (
//     <div style={{ /* display: 'flex', */ height: '90vh' }}>
//       {/* 输入框 */}
//       <div style={{ width: '400px', height: '80px' }}>
//         <Input value={uuid} onChange={getUuid} style={{ display: 'inline-block' }} />
//         <Button onClick={parserDicomOrthanc}>Orthanc解析</Button>
//         {/* <Button onClick={parserDicomDaikon}>Daikon解析</Button> */}
//         <Button onClick={cmpFiles}>比较数据</Button>
//       </div>

//       {/* 显示tag */}
//       <div style={{ minHeight: 0, minWidth: 0 }}>
//         {seriesTags
//           ? Object.keys(seriesTags).map((key) => (
//               <div style={{ margin: '5px' }} key={key}>
//                 <Tag color="processing">{key}</Tag>
//                 <Tag>{seriesTags[key] ? seriesTags[key] : 'NULL'}</Tag>
//               </div>
//             ))
//           : null}
//       </div>

//       <div style={{ width: '800px', height: '100%' }}>
//         <TextArea rows={100} value={pixels} />
//       </div>
//     </div>
//   );
// });

// export default Demo;
