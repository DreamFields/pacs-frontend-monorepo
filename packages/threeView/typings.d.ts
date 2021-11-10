/*
 * @Author: linkenzone
 * @Date: 2021-07-07 10:43:57
 * @Descripttion: Do not edit
 */
/* eslint-disable no-undef */

declare module '*.css';
declare module '*.less';
declare module '*.png';

declare module '*.vert';
declare module '*.frag';

declare module 'daikon';

declare module '*.svg' {
  export function ReactComponent(props: React.SVGProps<SVGSVGElement>): React.ReactElement;
  const url: string;
  export default url;
}

declare module 'OrbitControls';
