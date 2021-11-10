/* eslint-disable prefer-destructuring */
/* eslint-disable no-plusplus */
/* eslint-disable guard-for-in */
/*
 * @Author: linkenzone
 * @Date: 2021-07-11 09:39:07
 * @Descripttion: Do not edit
 */

// 弃用

// import axios from 'axios';
// import config from '../config/config';

// import ImageArray from '../store/ImageArray';
// import DaikonImageHelper from './utils/DaikonImageHelper';

// const URL_PER = config.DICOM_URL;

// /**
//  * @description: 将图片 转换为 Uint8Array
//  * @param {*} image
//  * @param {*} context
//  * @return {*}
//  */
// const imageToUint8Array = (image) => {
//   return new Promise((resolve, reject) => {
//     // const _image = new Image();
//     // image.src = URL.createObjectURL(image);

//     const canvas = document.createElement('canvas');
//     const context = canvas.getContext('2d');
//     context.drawImage(image, 0, 0);

//     // context.canvas.toBlob((blob) =>
//     //   blob
//     //     .arrayBuffer()
//     //     .then((buffer) => resolve(new Uint8Array(buffer)))
//     //     .catch(reject),
//     // );
//   });
// };

// /**
//  * @description: 获取series下所有的文件路径
//  * @param {string} uuid
//  * @return {*}
//  */
// const getDicomSeriesPath = async (uuid: string, type: string) => {
//   const files_paths: string[] = [];

//   let url_last = 'file';

//   if (type === 'dicom') {
//     url_last = 'file';
//   } else if (type === 'image') {
//     url_last = 'rendered';
//   }

//   await axios
//     .get(`${URL_PER}/series/${uuid}`)
//     .then((response: any) => {
//       const { Instances } = response.data;
//       for (const index in Instances) {
//         files_paths.push(`${URL_PER}/instances/${Instances[index]}/${url_last}`);
//       }
//     })
//     .catch((error) => {
//       // handle error
//       console.log('文件路径获取失败', error);
//     });

//   console.log('files_paths', files_paths);
//   return files_paths;
// };

// const addImageProcess = (data: any) => {
//   return new Promise((resolve, reject) => {
//     const url = URL.createObjectURL(data);
//     const img = new Image();
//     img.src = url;
//     img.onload = () => {
//       // console.log('img', img.width);
//       // console.log('img', img.height);
//       const canvas = document.createElement('canvas');
//       canvas.width = img.width;
//       canvas.height = img.height;
//       const context = canvas.getContext('2d');
//       context.drawImage(img, 0, 0);
//       const imageData = context.getImageData(0, 0, img.width, img.height);

//       // console.log('imageData', imageData);
//       const res = new Uint8Array(imageData.data);
//       resolve(res);

//       // console.log('res', res);
//     };
//     img.onerror = reject;
//   });
// };

// /**
//  * @description: 获取所有的Dicom文件，并且转换为vtk的格式
//  * @param {string} uuid
//  * @return {*}
//  */
// const getDicomSeriesImageData = async (uuid: string) => {
//   console.time('DICOM 加载时间');

//   ImageArray.changeLoading(true);

//   const files_paths = await getDicomSeriesPath(uuid, 'file');

//   // const files_paths = [];
//   // for (let i = 0; i < 480; i += 1) {
//   //   const index = String(i).padStart(6, '0');
//   //   files_paths.push(`AC/PT${index}.dcm`);
//   // }

//   let xDim = 0;
//   let yDim = 0;
//   let zDim = 0;
//   const numOfSlices = files_paths.length;

//   let WW = 0;
//   let WL = 0;

//   let m_rescaleIntercept = 1;
//   let m_rescaleSlope = 0;
//   let m_patientId;
//   let m_patientName;
//   let m_institutionName;
//   let m_seriesNumber;
//   let m_patientBirthDate;
//   const m_pixelSpacing = { x: undefined, y: undefined, z: undefined };

//   const m_imagePosMax = {
//     // eslint-disable-next-line
//     x: -1.0e12,
//     // eslint-disable-next-line
//     y: -1.0e12,
//     // eslint-disable-next-line
//     z: -1.0e12,
//   };
//   const m_imagePosMin = {
//     // eslint-disable-next-line
//     x: +1.0e12,
//     // eslint-disable-next-line
//     y: +1.0e12,
//     // eslint-disable-next-line
//     z: +1.0e12,
//   };

//   const daikonImageHelper = new DaikonImageHelper();

//   if (files_paths.length < 1) return null;

//   // 仅从第一个文件中 获取 metadata
//   await axios
//     .get(files_paths[0], {
//       responseType: 'arraybuffer',
//       // headers: { Accept: 'image/jpeg' },
//     })
//     .then((response: any) => {
//       console.log('response', response.data);
//       const dataFile = new DataView(response.data);
//       daikonImageHelper.setDataFile(dataFile);
//       yDim = daikonImageHelper.rows;
//       xDim = daikonImageHelper.cols;
//       const bits = daikonImageHelper.bitsAllocated;
//       console.log('图片 y轴 宽度', yDim);
//       console.log('图片 x轴 宽度', xDim);
//       console.log('图片 bits', bits);
//       const samPerPixel = daikonImageHelper.samPerPixel;
//       const m_pixelRepresentaionSigned = daikonImageHelper.pixelRepresentation;
//       m_rescaleIntercept = daikonImageHelper.rescaleIntercept;
//       m_rescaleSlope = daikonImageHelper.rescaleSlope;
//       const m_rescaleHounsfield = daikonImageHelper.rescaleType;
//       console.log('daikonImageHelper.pixelSpacing', daikonImageHelper.pixelSpacing);
//       const pixelSpacing = daikonImageHelper.pixelSpacing;
//       if (pixelSpacing) {
//         m_pixelSpacing.x = pixelSpacing[0] || 1.0;
//         m_pixelSpacing.y = pixelSpacing[1] || 1.0;
//       }
//       console.log('daikonImageHelper.sliceThickness', daikonImageHelper.sliceThickness);
//       m_pixelSpacing.z = daikonImageHelper.sliceThickness;
//       const imagePos = daikonImageHelper.imagePosition;
//       if (imagePos !== undefined && imagePos.length === 3) {
//         const xPos = imagePos[0];
//         const yPos = imagePos[1];
//         const zPos = imagePos[2];
//         console.log('xPos, yPos, zPos', xPos, yPos, zPos);
//         m_imagePosMax.x = xPos > m_imagePosMax.x ? xPos : m_imagePosMax.x;
//         m_imagePosMax.y = yPos > m_imagePosMax.y ? yPos : m_imagePosMax.y;
//         m_imagePosMax.z = zPos > m_imagePosMax.z ? zPos : m_imagePosMax.z;
//         m_imagePosMin.x = xPos < m_imagePosMin.x ? xPos : m_imagePosMin.x;
//         m_imagePosMin.y = yPos < m_imagePosMin.y ? yPos : m_imagePosMin.y;
//         m_imagePosMin.z = zPos < m_imagePosMin.z ? zPos : m_imagePosMin.z;
//       }
//       console.log('m_imagePosMax:', m_imagePosMax);
//       console.log('m_imagePosMin:', m_imagePosMin);
//       m_patientId = daikonImageHelper.patientID;
//       console.log('m_patientId', m_patientId);
//       m_patientName = daikonImageHelper.patientName;
//       console.log('m_patientName', m_patientName);
//       m_institutionName = daikonImageHelper.institutionName;
//       console.log('m_institutionName', m_institutionName);
//       m_seriesNumber = daikonImageHelper.seriesNumber;
//       console.log('m_seriesName', m_seriesNumber);
//       m_patientBirthDate = daikonImageHelper.patientBirthDate;
//       console.log(
//         m_patientId,
//         m_patientName,
//         m_institutionName,
//         m_seriesNumber,
//         m_patientBirthDate,
//       );
//       // 窗宽 和 窗位
//       WW = daikonImageHelper.windowWidth || null;
//       WL = daikonImageHelper.windowCenter || null;
//     })
//     .catch(() => {
//       console.log('获取metaData失败');
//       return [];
//     });

//   // 获取rawData
//   const fetchFiles = files_paths.map((file_path, index) => {
//     const path = file_path;
//     return axios
//       .get(path, {
//         responseType: 'arraybuffer',
//         headers: { Accept: 'image/jpeg' },
//       })
//       .then(async (response: any) => {
//         console.log('response', response.data);

//         const dataFile = new DataView(response.data);
//         daikonImageHelper.setDataFile(dataFile);

//         const pixels = daikonImageHelper.rawData;
//         console.log('图片 rawData:', pixels);

//         const pixSrc = new Uint16Array(pixels);
//         console.log('图片 piSrc', pixSrc);
//         return pixSrc;
//       })
//       .catch(() => {
//         console.log('一个文件获取失败');
//         return [];
//       });
//   });

//   const files = await Promise.all(fetchFiles);

//   console.log('files', files);

//   zDim = numOfSlices;

//   // 将数据拼接起来
//   const pixelArray = new Uint16Array(xDim * yDim * numOfSlices);
//   const offset = xDim * yDim;
//   for (let i = 0; i < numOfSlices; i++) {
//     pixelArray.set(files[i], i * offset);
//   }

//   console.time('缓存生成');
//   // 处理成其他方向

//   const pixelArray_x = pixelArray.map((_, index) => {
//     // 原坐标
//     const z = Math.floor(index / (xDim * yDim));
//     const y = Math.floor((index - z * xDim * yDim) / xDim);
//     const x = Math.floor((index - z * xDim * yDim) % xDim);
//     // 交换位置
//     const newX = Math.floor((z / zDim) * xDim);
//     const newY = Math.floor((x / xDim) * yDim);
//     const newZ = Math.floor((y / yDim) * zDim);
//     const pos = newX + newY * xDim + newZ * xDim * yDim;
//     return pixelArray[pos];
//   });

//   const pixelArray_y = pixelArray.map((_, index) => {
//     // 原坐标
//     const z = Math.floor(index / (xDim * yDim));
//     const y = Math.floor((index - z * xDim * yDim) / xDim);
//     const x = Math.floor((index - z * xDim * yDim) % xDim);
//     // 交换位置
//     const newY = Math.floor((z / zDim) * yDim);
//     const newX = x;
//     const newZ = Math.floor((y / yDim) * zDim);
//     const pos = newX + newY * xDim + newZ * xDim * yDim;
//     return pixelArray[pos];
//   });

//   console.log('pixelArray', pixelArray);
//   console.log('pixelArray_x', pixelArray_x);
//   console.log('pixelArray_y', pixelArray_y);

//   ImageArray.generateSection(pixelArray_x, pixelArray_y);

//   console.timeEnd('缓存生成');

//   const m_boxSize = { x: 250, y: 250, z: 480 };
//   const imagePosBox = {
//     x: m_imagePosMax.x - m_imagePosMin.x,
//     y: m_imagePosMax.y - m_imagePosMin.y,
//     z: m_imagePosMax.z - m_imagePosMin.z,
//   };

//   const TOO_MIN = 0.00001;
//   if (!m_pixelSpacing.z) {
//     m_pixelSpacing.z = imagePosBox.z / zDim;
//     if (m_pixelSpacing.z < TOO_MIN) {
//       m_pixelSpacing.z = imagePosBox.x / zDim;
//       if (m_pixelSpacing.z < TOO_MIN) {
//         m_pixelSpacing.z = imagePosBox.y / zDim;
//       }
//     }
//   }
//   if (m_pixelSpacing.z < TOO_MIN) {
//     m_pixelSpacing.z = 1.0 / zDim;
//   }

//   m_boxSize.x = m_pixelSpacing.x * xDim;
//   m_boxSize.y = m_pixelSpacing.y * yDim;
//   m_boxSize.z = m_pixelSpacing.z * zDim;
//   console.log('m_boxSize:', m_boxSize);
//   console.log('xDim,yDim,zDim:', xDim, yDim, zDim);

//   ImageArray.generate(xDim, yDim, zDim, pixelArray);
//   ImageArray.changeLevel(WW, WL);

//   console.log('m_rescaleSlope', m_rescaleSlope);
//   console.log('m_rescaleIntercept', m_rescaleIntercept);
//   // 判断不为空的时候
//   if ((m_rescaleSlope ?? false) && (m_rescaleIntercept ?? false)) {
//     ImageArray.changeRescale(m_rescaleSlope, m_rescaleIntercept);
//   } else {
//     ImageArray.changeRescale(1, 0);
//   }

//   ImageArray.changeBoxSize(m_boxSize);
//   ImageArray.changePixelSpacing(m_pixelSpacing);
//   ImageArray.setPatientId(m_patientId);
//   ImageArray.setPatientName(m_patientName);
//   ImageArray.setInstitutionName(m_institutionName);
//   ImageArray.setSeriesNumber(m_seriesNumber);
//   ImageArray.setPatientBirthDate(m_patientBirthDate);

//   ImageArray.changeLoading(false);

//   console.timeEnd('DICOM 加载时间');

//   return true;
// };

// export { getDicomSeriesImageData };
