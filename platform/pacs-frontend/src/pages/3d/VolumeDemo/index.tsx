/*
 * @Author: linkenzone
 * @Date: 2021-06-08 21:43:38
 * @Descripttion: Do not edit
 */
import { Col, Divider, Row, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import readImageDICOMFileSeries from 'itk/readImageDICOMFileSeries';
import { View, VolumeRepresentation, VolumeController, Reader } from 'react-vtk-js';
import vtkVolume from '@kitware/vtk.js/Rendering/Core/Volume';
import vtkVolumeMapper from '@kitware/vtk.js/Rendering/Core/VolumeMapper';
import vtkITKHelper from '@kitware/vtk.js/Common/DataModel/ITKHelper';
import axios from 'axios';
import files_path from './files';

const BaseDemo: React.FC<unknown> = () => {
  const [actor, setActor] = useState(vtkVolume.newInstance());
  const [mapper, setMapper] = useState(vtkVolumeMapper.newInstance());
  // 下拉框值定义
  // TODO：改为动态获取
  const selectOptions = [
    { label: 'ct_mouse', value: '/vti/ct_mouse.vti' },
    { label: 'mri_brain', value: '/vti/mri_brain.vti' },
    { label: 'pet_b320_attn', value: '/vti/pet_b320_attn.vti' },
    { label: 'pet_brain', value: '/vti/pet_brain.vti' },
    { label: 'pet_mouse', value: '/vti/pet_mouse.vti' },
    { label: 'pet_tongji_brain', value: '/vti/pet_tongji_brain.vti' },
  ];
  // 下拉框的状态维护
  const [MCSelectState, setMCSelectState] = useState({
    value: selectOptions[0].value,
  });

  const printImage = (image: any) => {
    function replacer(key: any, value: any) {
      if (!!value && value.byteLength !== undefined) {
        return `${String(value.slice(0, 6))}...`;
      }
      return value;
    }
    console.log(image);
    console.log(JSON.stringify(image, replacer, 4));
    // outputTextArea.textContent = JSON.stringify(image, replacer, 4);
  };

  const getImages = async () => {
    const fetchFiles = files_path.map((file_path, index) => {
      const path = file_path;
      // return axios.get(path, { responseType: 'blob' }).then((response) => {
      //   const jsFile = new window.File([response.data], file);
      //   return jsFile;
      // });

      return axios.get(path, { responseType: 'blob' }).then((response) => {
        const jsFile = new window.File([response.data], `${index}.dcm`);
        return jsFile;
      });
      // return request(path, {
      //   method: 'GET',
      //   responseType: 'blob',
      //   getResponse: true,
      // }).then(({ data, response }) => {
      //   console.log('data', data);
      //   // console.log('response', response);
      //   const jsFile = new window.File([data], `${index}.dcm`);
      //   return jsFile;
      // });
    });

    Promise.all(fetchFiles).then((files) => {
      console.log('files', files);

      if (!files) return;

      readImageDICOMFileSeries(null, files).then(({ image, webWorker }) => {
        webWorker.terminate();
        printImage(image);

        const imageData = vtkITKHelper.convertItkToVtkImage(image);
        console.log('imageData', imageData);

        mapper.setInputData(imageData);
        actor.setMapper(mapper);

        setActor(actor);
        setMapper(mapper);
      });
    });
  };

  // useEffect(() => {
  //   getImages();
  // }, []);

  return (
    <>
      <Row>
        <Col span={4}>
          <Select
            style={{ width: 120 }}
            options={selectOptions}
            value={MCSelectState.value}
            onChange={(SelectValue) => {
              setMCSelectState({
                ...MCSelectState,
                value: SelectValue,
              });
            }}
          ></Select>
        </Col>
      </Row>
      <Divider orientation="left" plain>
        工具区
      </Divider>
      <Row>
        <div style={{ width: '85vw', height: '85vh' }}>
          <View id="0">
            <VolumeRepresentation>
              <VolumeController />
              <Reader
                vtkClass="vtkXMLImageDataReader"
                // url="https://data.kitware.com/api/v1/item/59e12e988d777f31ac6455c5/download"
                url={MCSelectState.value}
              />
            </VolumeRepresentation>
          </View>
        </div>
      </Row>
    </>
  );
  // return (
  //   <>
  //     <View>
  //       <GeometryRepresentation>
  //         <Reader vtkClass="vtkOBJReader" url={'https://groups.csail.mit.edu/graphics/classes/6.837/F03/models/teapot.obj'} />
  //       </GeometryRepresentation>
  //     </View>
  //   </>
  // );
};

export default BaseDemo;
