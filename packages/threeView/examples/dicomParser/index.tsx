/*
 * @Author: linkenzone
 * @Date: 2021-09-14 16:35:05
 * @Descripttion: Do not edit
 */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../src/config/config';
import DicomParserHelper from '../../src/io/utils/DicomParserHelper';
import TextArea from 'antd/es/input/TextArea';
import Search from 'antd/es/input/Search';

const URL_PER = config.DICOM_URL;

const Demo: React.FC<unknown> = () => {
  const [id, setId] = useState<string>('b5981569-302c412a-6ced2c80-fd877f65-933991a4');
  const [text, setText] = useState('');
  const dicomParserHelper = new DicomParserHelper();
  /**
   * @description: 获取series下所有的文件路径
   * @param {string} uuid
   * @return {*}
   */
  const getDicomSeriesPath = async (uuid: string, type: string) => {
    const files_paths: string[] = [];

    let url_last = 'file';

    if (type === 'dicom') {
      url_last = 'file';
    } else if (type === 'image') {
      url_last = 'rendered';
    }

    await axios
      .get(`${URL_PER}/series/${uuid}`)
      .then((response: any) => {
        const { Instances } = response.data;
        for (const index in Instances) {
          files_paths.push(`${URL_PER}/instances/${Instances[index]}/${url_last}`);
        }
      })
      .catch((error) => {
        // handle error
        console.log('文件路径获取失败', error);
      });

    console.log('files_paths', files_paths);
    return files_paths;
  };

  const getDicomSeriesImageData = async (uuid: string) => {
    const files_paths = await getDicomSeriesPath(uuid, 'file');
    let resText = '';
    await axios
      .get(files_paths[0], {
        responseType: 'arraybuffer',
        // headers: { Accept: 'image/jpeg' },
      })
      .then((response: any) => {
        const byteArray = new Uint8Array(response.data);
        dicomParserHelper.setDataFile(byteArray);
        resText = '';
        resText += `cols:${dicomParserHelper.cols}\n`;
        resText += `rows:${dicomParserHelper.rows}\n`;
        resText += `windowCenter:${dicomParserHelper.windowCenter}\n`;
        resText += `windowWidth:${dicomParserHelper.windowWidth}\n`;
        resText += `rescaleIntercept:${dicomParserHelper.rescaleIntercept}\n`;
        resText += `rescaleSlope:${dicomParserHelper.rescaleSlope}\n`;
        resText += `rescaleType:${dicomParserHelper.rescaleType}\n`;
        resText += `bitsAllocated:${dicomParserHelper.bitsAllocated}\n`;
        resText += `samPerPixel:${dicomParserHelper.samPerPixel}\n`;
        resText += `pixelRepresentation:${dicomParserHelper.pixelRepresentation}\n`;
        resText += `pixelSpacing:${dicomParserHelper.pixelSpacing}\n`;
        resText += `sliceThickness:${dicomParserHelper.sliceThickness}\n`;
        resText += `imagePosition:${dicomParserHelper.imagePosition}\n`;
        resText += `patientID:${dicomParserHelper.patientID}\n`;
        resText += `patientName:${dicomParserHelper.patientName}\n`;
        resText += `institutionName:${dicomParserHelper.institutionName}\n`;
        resText += `seriesNumber:${dicomParserHelper.seriesNumber}\n`;
        resText += `patientBirthDate:${dicomParserHelper.patientBirthDate}\n`;
        resText += `rawData:${dicomParserHelper.rawData}\n`;
        setText(resText);
      })
      .catch((ex) => {
        // 数据有问题就先显示能解析到的tag
        setText(resText);
        console.log('获取metaData失败', ex);
        return [];
      });
  };

  useEffect(() => {
    getDicomSeriesImageData(id);
  }, [id]);
  const onSearch = (value) => setId(value);
  return (
    <>
      <Search defaultValue={id} placeholder="input search text" onSearch={onSearch} enterButton />
      <TextArea rows={50} value={text} />
    </>
  );
};

export default Demo;
