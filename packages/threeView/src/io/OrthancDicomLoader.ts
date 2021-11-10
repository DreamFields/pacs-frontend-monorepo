/*
 * @Author: Meng Tian
 * @Date: 2021-10-09 10:39:24
 * @Description: Do not edit
 */
import axios from 'axios';
import config from '../config/config';

import ImageArray from '../store/ImageArray';
import OrthancImageHelper from './utils/OrthancImageHelper';

const URL_PER = config.DICOM_URL;

/**
 * @description: 获取series下所有的文件路径
 * @param {string} uuid
 * @return {*}
 */
const getDicomSeriesPath = async (uuid: string) => {
  const files_paths: string[] = [];

  const url_last = 'file';

  await axios
    .get(`${URL_PER}/series/${uuid}`)
    .then((response: any) => {
      const { Instances } = response.data;
      // eslint-disable-next-line guard-for-in
      for (const index in Instances) {
        files_paths.push(`${URL_PER}/instances/${Instances[index]}/${url_last}`);
      }
    })
    .catch((error) => {
      console.log('文件路径获取失败', error);
    });

  console.log('files_paths', files_paths);
  return files_paths;
};

/**
 * @description: 获取所有的Dicom文件
 * @param {string} uuid
 * @return {*}
 */
const getDicomSeriesImageData = async (uuid: string) => {
  console.time('DICOM 加载时间');

  ImageArray.changeLoading(true);

  const files_paths = await getDicomSeriesPath(uuid);

  let xDim = 0;
  let yDim = 0;
  let zDim = 0;
  const numOfSlices = files_paths.length;

  let WW = 0;
  let WL = 0;

  let m_rescaleIntercept = 1;
  let m_rescaleSlope = 0;
  let m_patientId;
  let m_patientName;
  let m_institutionName;
  let m_seriesNumber;
  let m_patientBirthDate;
  const m_pixelSpacing = { x: undefined, y: undefined, z: undefined };

  const m_imagePosMax = {
    // eslint-disable-next-line
    x: -1.0e12,
    // eslint-disable-next-line
    y: -1.0e12,
    // eslint-disable-next-line
    z: -1.0e12,
  };
  const m_imagePosMin = {
    // eslint-disable-next-line
    x: +1.0e12,
    // eslint-disable-next-line
    y: +1.0e12,
    // eslint-disable-next-line
    z: +1.0e12,
  };

  const orthancImageHelper = new OrthancImageHelper();
  if (files_paths.length < 1) return null;

  // 仅从第一个文件中 获取 metadata
  // ----------------------------
  const requestUrl = files_paths[0].replace('file', 'tags');
  // 利用Orthc
  await axios
    .get(requestUrl, {
      // responseType: 'arraybuffer',
      headers: { Accept: 'application/json' },
    })
    .then((response) => {
      const tagsData = response.data;
      orthancImageHelper.setTags(tagsData);
      //   console.log('orthancImageHelper.tagsData', orthancImageHelper.tags());
      yDim = orthancImageHelper.rows;
      xDim = orthancImageHelper.cols;
      const bits = orthancImageHelper.bitsAllocated;
      console.log('图片 y轴 宽度', yDim);
      console.log('图片 x轴 宽度', xDim);
      console.log('图片 bits', bits);
      const samPerPixel = orthancImageHelper.samPerPixel;
      const m_pixelRepresentaionSigned = orthancImageHelper.pixelRepresentation;
      m_rescaleIntercept = orthancImageHelper.rescaleIntercept;
      m_rescaleSlope = orthancImageHelper.rescaleSlope;
      const m_rescaleHounsfield = orthancImageHelper.rescaleType;
      console.log('orthancImageHelper.pixelSpacing', orthancImageHelper.pixelSpacing);
      const pixelSpacing = orthancImageHelper.pixelSpacing;
      if (pixelSpacing) {
        m_pixelSpacing.x = pixelSpacing[0] || 1.0;
        m_pixelSpacing.y = pixelSpacing[1] || 1.0;
      }
      console.log('orthancImageHelper.sliceThickness', orthancImageHelper.sliceThickness);
      m_pixelSpacing.z = orthancImageHelper.sliceThickness;
      const imagePos = orthancImageHelper.imagePosition;
      if (imagePos !== undefined && imagePos.length === 3) {
        const xPos = imagePos[0];
        const yPos = imagePos[1];
        const zPos = imagePos[2];
        console.log('xPos, yPos, zPos', xPos, yPos, zPos);
        m_imagePosMax.x = xPos > m_imagePosMax.x ? xPos : m_imagePosMax.x;
        m_imagePosMax.y = yPos > m_imagePosMax.y ? yPos : m_imagePosMax.y;
        m_imagePosMax.z = zPos > m_imagePosMax.z ? zPos : m_imagePosMax.z;
        m_imagePosMin.x = xPos < m_imagePosMin.x ? xPos : m_imagePosMin.x;
        m_imagePosMin.y = yPos < m_imagePosMin.y ? yPos : m_imagePosMin.y;
        m_imagePosMin.z = zPos < m_imagePosMin.z ? zPos : m_imagePosMin.z;
      }
      console.log('m_imagePosMax:', m_imagePosMax);
      console.log('m_imagePosMin:', m_imagePosMin);
      m_patientId = orthancImageHelper.patientID;
      console.log('m_patientId', m_patientId);
      m_patientName = orthancImageHelper.patientName;
      console.log('m_patientName', m_patientName);
      m_institutionName = orthancImageHelper.institutionName;
      console.log('m_institutionName', m_institutionName);
      m_seriesNumber = orthancImageHelper.seriesNumber;
      console.log('m_seriesName', m_seriesNumber);
      m_patientBirthDate = orthancImageHelper.patientBirthDate;
      console.log(
        m_patientId,
        m_patientName,
        m_institutionName,
        m_seriesNumber,
        m_patientBirthDate,
      );
      // 窗宽 和 窗位
      WW = orthancImageHelper.windowWidth || null;
      WL = orthancImageHelper.windowCenter || null;
    })
    .catch(() => {
      console.log('获取metaData失败');
      return [];
    });

  // 获取rawData
  const fetchFiles = files_paths.map((file_path, index) => {
    const path = file_path;
    return (
      axios
        //   .get(path.replace('file', 'frames/'.concat(String(index),'/raw')), {
        .get(path.replace('file', 'frames/0/raw'), {
          headers: { Accept: 'application/octet-stream' },
        })
        .then(async (response: any) => {
          // console.log('response', response.data);
          orthancImageHelper.setPixels(response.data);
          const pixSrc = orthancImageHelper.pixels;
          // console.log('图片pixSrc:', pixSrc);
          return pixSrc;
        })
        .catch(() => {
          console.log('一个文件获取失败');
          return [];
        })
    );
  });

  const files = await Promise.all(fetchFiles);

  console.log('files', files);

  // 将数据拼接起来
  const pixelArray = new Uint16Array(xDim * yDim * numOfSlices);
  const offset = xDim * yDim;
  for (let i = 0; i < numOfSlices; i++) {
    pixelArray.set(files[i], i * offset);
  }

  console.log('pixelArray', pixelArray);
  zDim = numOfSlices;
  const m_boxSize = { x: 250, y: 250, z: 480 };
  const imagePosBox = {
    x: m_imagePosMax.x - m_imagePosMin.x,
    y: m_imagePosMax.y - m_imagePosMin.y,
    z: m_imagePosMax.z - m_imagePosMin.z,
  };

  const TOO_MIN = 0.00001;
  if (!m_pixelSpacing.z) {
    m_pixelSpacing.z = imagePosBox.z / zDim;
    if (m_pixelSpacing.z < TOO_MIN) {
      m_pixelSpacing.z = imagePosBox.x / zDim;
      if (m_pixelSpacing.z < TOO_MIN) {
        m_pixelSpacing.z = imagePosBox.y / zDim;
      }
    }
  }
  if (m_pixelSpacing.z < TOO_MIN) {
    m_pixelSpacing.z = 1.0 / zDim;
  }

  m_boxSize.x = m_pixelSpacing.x * xDim;
  m_boxSize.y = m_pixelSpacing.y * yDim;
  m_boxSize.z = m_pixelSpacing.z * zDim;
  console.log('m_boxSize:', m_boxSize);
  console.log('xDim,yDim,zDim:', xDim, yDim, zDim);

  ImageArray.generate(xDim, yDim, zDim, pixelArray);
  ImageArray.changeLevel(WW, WL);

  console.log('m_rescaleSlope', m_rescaleSlope);
  console.log('m_rescaleIntercept', m_rescaleIntercept);
  // 判断不为空的时候
  if ((m_rescaleSlope ?? false) && (m_rescaleIntercept ?? false)) {
    ImageArray.changeRescale(m_rescaleSlope, m_rescaleIntercept);
  } else {
    ImageArray.changeRescale(1, 0);
  }

  ImageArray.changeBoxSize(m_boxSize);
  ImageArray.changePixelSpacing(m_pixelSpacing);
  ImageArray.setPatientId(m_patientId);
  ImageArray.setPatientName(m_patientName);
  ImageArray.setInstitutionName(m_institutionName);
  ImageArray.setSeriesNumber(m_seriesNumber);
  ImageArray.setPatientBirthDate(m_patientBirthDate);

  ImageArray.changeLoading(false);

  console.timeEnd('DICOM 加载时间');

  return true;
};

export { getDicomSeriesImageData };
