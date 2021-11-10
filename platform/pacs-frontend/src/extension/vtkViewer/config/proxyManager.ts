/*
 * @Author: linkenzone
 * @Date: 2021-06-30 16:12:57
 * @Descripttion: Do not edit
 */

import vtkProxyManager from '@kitware/vtk.js/Proxy/Core/ProxyManager';
import proxyConfiguration from './proxyManagerConfiguration';

const proxyManager = vtkProxyManager.newInstance({ proxyConfiguration });
window.addEventListener('resize', proxyManager.resizeAllViews);

export { proxyManager };
