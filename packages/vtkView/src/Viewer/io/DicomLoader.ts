/*
 * @Author: linkenzone
 * @Date: 2021-07-20 14:03:47
 * @Descripttion: Do not edit
 */

import axios from 'axios';
import config from '../../config/config';

import readImageDICOMFileSeries from 'itk/readImageDICOMFileSeries';
import vtkITKHelper from '@kitware/vtk.js/Common/DataModel/ITKHelper';

const SERVER_URL = config.DICOM_URL;

/**
 * @description:
 * @param {string} uuid
 * @return {*}
 */
export const getImageDataFromServer = async (uuid: string) => {
  const files_paths: string[] = [];
  // 获取所有文件的路径
  await axios.get(`${SERVER_URL}/series/${uuid}`).then((response) => {
    const { Instances } = response.data;
    for (const index in Instances) {
      if ({}.hasOwnProperty.call(Instances, index)) {
        files_paths.push(`${SERVER_URL}/instances/${Instances[index]}/file`);
        console.log(`${Instances[index]} 读取成功`);
      }
    }
  });
  // 获取文件
  const fetchFiles = files_paths.map((file_path, index) => {
    const path = file_path;
    return axios
      .get(path, { responseType: 'blob' })
      .then((response) => {
        const jsFile = new File([response.data], `${index}.dcm`); // `${index}.dcm` ` file_path.split('/').slice(-1)[0]`
        return jsFile;
      })
      .catch(() => {
        console.log('一个文件获取失败');
      });
  });

  // 进行转换
  const files: any = await Promise.all(fetchFiles);
  const { image } = await readImageDICOMFileSeries(files);
  image.name = files[0].name;
  console.log('image', image);
  const imageData = await vtkITKHelper.convertItkToVtkImage(image);
  console.log('imageData', imageData);
  return imageData;
};
