/*
 * @Author: linkenzone
 * @Date: 2021-06-19 23:43:28
 * @Descripttion: Do not edit
 */

// Load the rendering pieces we want to use (for both WebGL and WebGPU)
// import '@kitware/vtk.js/Rendering/Profiles/Volume';

// Force DataAccessHelper to have access to various data source
// import '@kitware/vtk.js/IO/Core/DataAccessHelper/HtmlDataAccessHelper';
import '@kitware/vtk.js/IO/Core/DataAccessHelper/HttpDataAccessHelper';
// import '@kitware/vtk.js/IO/Core/DataAccessHelper/JSZipDataAccessHelper';

import React, { useState, useEffect, useRef } from 'react';

import vtkGenericRenderWindow from '@kitware/vtk.js/Rendering/Misc/GenericRenderWindow';

import vtkHttpDataSetReader from '@kitware/vtk.js/IO/Core/HttpDataSetReader';

import vtkImageMapper from '@kitware/vtk.js/Rendering/Core/ImageMapper';
import vtkImageSlice from '@kitware/vtk.js/Rendering/Core/ImageSlice';

import vtkPiecewiseFunction from '@kitware/vtk.js/Common/DataModel/PiecewiseFunction';

import vtkColorTransferFunction from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction';
import vtkColorMaps from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction/ColorMaps';

import vtkInteractorStyleImage from '@kitware/vtk.js/Interaction/Style/InteractorStyleImage';
import ImageConstants from '@kitware/vtk.js/Rendering/Core/ImageMapper/Constants';

const { SlicingMode } = ImageConstants;

const BaseDemo: React.FC<unknown> = () => {
  const vtkContainerRef = useRef(null);

  useEffect(() => {
    const genericRenderWindow = vtkGenericRenderWindow.newInstance();
    genericRenderWindow.setContainer(vtkContainerRef.current);
    genericRenderWindow.resize();

    const renderWindow = genericRenderWindow.getRenderWindow();
    const renderer = genericRenderWindow.getRenderer();

    // renderer camera to parallel projection
    renderer.getActiveCamera().setParallelProjection(true);

    // --- Set up interactor style for image slicing
    const istyle = vtkInteractorStyleImage.newInstance();
    istyle.setInteractionMode('IMAGE_SLICING');
    renderWindow.getInteractor().setInteractorStyle(istyle);

    // pipeline
    const actor = vtkImageSlice.newInstance();
    const mapper = vtkImageMapper.newInstance();

    mapper.setSliceAtFocalPoint(true);
    mapper.setSlicingMode(SlicingMode.Z);

    // tell the actor which mapper to use
    actor.setMapper(mapper);

    // --- set up default window/level ---

    actor.getProperty().setColorWindow(255);
    actor.getProperty().setColorLevel(127);

    const reader = vtkHttpDataSetReader.newInstance({ fetchGzip: true });

    mapper.setInputConnection(reader.getOutputPort());

    reader.setUrl('https://kitware.github.io/vtk-js/data/volume/LIDC2.vti').then(() => {
      reader.loadData().then(() => {
        renderer.addActor(actor);

        renderer.resetCamera();
        renderWindow.render();
      });
    });
  }, []);

  return (
    <>
      <div ref={vtkContainerRef} style={{ height: '640px' }} />
    </>
  );
};

export default BaseDemo;
