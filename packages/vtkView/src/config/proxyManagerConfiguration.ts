/*
 * @Author: linkenzone
 * @Date: 2021-06-28 14:32:01
 * @Descripttion: Do not edit
 */

import vtkProxySource from '@kitware/vtk.js/Proxy/Core/SourceProxy';
import vtkGeometryRepresentationProxy from '@kitware/vtk.js/Proxy/Representations/GeometryRepresentationProxy';
import vtkVolumeRepresentationProxy from '@kitware/vtk.js/Proxy/Representations/VolumeRepresentationProxy';
import vtkSliceRepresentationProxy from '@kitware/vtk.js/Proxy/Representations/SliceRepresentationProxy';
import vtkPiecewiseFunctionProxy from '@kitware/vtk.js/Proxy/Core/PiecewiseFunctionProxy';
import vtkLookupTableProxy from '@kitware/vtk.js/Proxy/Core/LookupTableProxy';
import vtkView from '@kitware/vtk.js/Proxy/Core/ViewProxy';
import vtk2DView from '@kitware/vtk.js/Proxy/Core/View2DProxy';

import proxyUI from './proxyUI';
import proxyLinks from './proxyLinks';

const commonInteractor = [
  { type: 'pan', options: { button: 3 } }, // Pan on Right button drag
  { type: 'pan', options: { button: 1, shift: true } }, // Pan on Shift + Left button drag
  { type: 'zoom', options: { button: 1, control: true } }, // Zoom on Ctrl + Left button drag
  { type: 'zoom', options: { dragEnabled: false, scrollEnabled: true } }, // Zoom on scroll
];

const interactorStyle3D = commonInteractor.concat([
  { type: 'rotate', options: { button: 1 } }, // Rotate on Left button drag
]);

const interactorStyle2D = commonInteractor.concat([
  { type: 'pan', options: { button: 1 } }, // Pan on Left button drag
]);

const proxyManagerConfiguration = {
  definitions: {
    Proxy: {
      LookupTable: {
        class: vtkLookupTableProxy,
      },
      PiecewiseFunction: {
        class: vtkPiecewiseFunctionProxy,
      },
    },
    Sources: {
      TrivialProducer: {
        class: vtkProxySource,
        options: {},
      },
    },
    Representations: {
      Geometry: {
        class: vtkGeometryRepresentationProxy,
        options: {},
      },
      Slice: {
        class: vtkSliceRepresentationProxy,
        options: {
          ui: proxyUI.Slice,
          Link: proxyLinks.Slice,
        },
      },
      Volume: {
        class: vtkVolumeRepresentationProxy,
        options: {},
      },
      SliceX: {
        class: vtkSliceRepresentationProxy,
        options: {
          ui: proxyUI.Slice,
          Link: [
            {
              link: 'SliceX',
              property: 'slice',
              updateOnBind: true,
              type: 'application',
            },
            ...proxyLinks.Slice,
          ],
        },
      },
      SliceY: {
        class: vtkSliceRepresentationProxy,
        options: {},
      },
      SliceZ: {
        class: vtkSliceRepresentationProxy,
        options: {},
      },
    },
    Views: {
      ItkVtkView: {
        class: vtkView,
        options: {},
        props: {},
      },
      View2D: {
        class: vtk2DView,
        options: { ui: proxyUI.Slice },
        props: {},
      },
    },
  },
  representations: {
    ItkVtkView: {
      vtkPolyData: { name: 'Geometry' },
      vtkImageData: { name: 'Volume' },
    },
    View2D: {
      vtkImageData: { name: 'SliceX' },
      vtkLabelMap: { name: 'LabelMapSliceX' },
      vtkPolyData: { name: 'Geometry' },
      vtkMolecule: { name: 'Molecule' },
      Glyph: { name: 'Glyph' },
      Skybox: { name: 'Skybox' },
    },
    View2D_Y: {
      vtkImageData: { name: 'SliceY' },
      vtkLabelMap: { name: 'LabelMapSliceY' },
      vtkPolyData: { name: 'Geometry' },
      vtkMolecule: { name: 'Molecule' },
      Glyph: { name: 'Glyph' },
      Skybox: { name: 'Skybox' },
    },
    View2D_Z: {
      vtkImageData: { name: 'SliceZ' },
      vtkLabelMap: { name: 'LabelMapSliceZ' },
      vtkPolyData: { name: 'Geometry' },
      vtkMolecule: { name: 'Molecule' },
      Glyph: { name: 'Glyph' },
      Skybox: { name: 'Skybox' },
    },
  },
};

export default proxyManagerConfiguration;
