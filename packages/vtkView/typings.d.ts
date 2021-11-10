/*
 * @Descripttion:
 * @Author: linkenzone
 * @Date: 2021-03-02 11:12:47
 */

declare module '*.css';
declare module '*.less';
declare module '*.png';
declare module '*.svg' {
  export function ReactComponent(props: React.SVGProps<SVGSVGElement>): React.ReactElement;
  const url: string;
  export default url;
}

// 避免ts文件中报错
// declare module 'vtk.js/*';
// declare module '@kitware/vtk.js/*';
declare module '@kitware/vtk.js/Widgets/Core/WidgetManager';
declare module '@kitware/vtk.js/IO/Core/HttpDataSetReader';
declare module '@kitware/vtk.js/Common/DataModel/PiecewiseFunction';
declare module '@kitware/vtk.js/Rendering/Core/ColorTransferFunction/ColorMaps';
declare module '@kitware/vtk.js/Common/DataModel/ITKHelper';
declare module '@kitware/vtk.js/Proxy/*';

declare module 'itk/*';
