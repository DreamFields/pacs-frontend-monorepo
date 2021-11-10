/* eslint-disable guard-for-in */
/*
 * @Author: linkenzone
 * @Date: 2021-06-30 10:59:25
 * @Descripttion: Do not edit
 */
import axios from 'axios';

import readImageDICOMFileSeries from 'itk/readImageDICOMFileSeries';
import vtkITKHelper from '@kitware/vtk.js/Common/DataModel/ITKHelper';

import config from '../config/config';

const URL_PER = config.DICOM_URL;

/**
 * @description: 获取series下所有的文件路径
 * @param {string} uuid
 * @return {*}
 */
const getDicomSeriesPath = async (uuid: string) => {
  const files_paths: string[] = [];

  await axios
    .get(`${URL_PER}/series/${uuid}`)
    .then((response) => {
      const { Instances } = response.data;
      for (const index in Instances) {
        files_paths.push(`${URL_PER}/instances/${Instances[index]}/file`);
      }
    })
    .catch((error) => {
      // handle error
      console.log('文件路径获取失败', error);
    });

  return files_paths;
};

/**
 * @description: 获取所有的Dicom文件，并且转换为vtk的格式
 * @param {string} uuid
 * @return {*}
 */
const getDicomSeriesImageData = async (uuid: string) => {
  const files_paths = await getDicomSeriesPath(uuid);

  // 获取文件列表
  const fetchFiles = files_paths.map((file_path, index) => {
    const path = file_path;
    return axios
      .get(path, { responseType: 'blob' })
      .then((response) => {
        const jsFile = new File([response.data], `${index}.dcm`);
        return jsFile;
      })
      .catch(() => {
        console.log('一个文件获取失败');
      });
  });

  const files = await Promise.all(fetchFiles);
  const { image } = await readImageDICOMFileSeries(files);
  const imageData = vtkITKHelper.convertItkToVtkImage(image);
  return imageData;
};

export { getDicomSeriesImageData };
