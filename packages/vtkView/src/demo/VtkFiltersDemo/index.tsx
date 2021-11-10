/*
 * @Author: linkenzone
 * @Date: 2021-06-25 17:13:39
 * @Descripttion: Do not edit
 */

import React, { useState, useRef, useEffect } from 'react';

import '@kitware/vtk.js/Rendering/Profiles/Geometry';
import vtkGenericRenderWindow from '@kitware/vtk.js/Rendering/Misc/GenericRenderWindow';

import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkConeSource from '@kitware/vtk.js/Filters/Sources/ConeSource';

import vtkOutlineFilter from '@kitware/vtk.js/Filters/General/OutlineFilter';

const Demo: React.FC<{}> = () => {
  const vtkContainerRef = useRef(null);
  const context = useRef<any | null>(null);
  const [coneResolution, setConeResolution] = useState(6);
  const [representation, setRepresentation] = useState(2);

  useEffect(() => {
    if (!context.current) {
      const genericRenderWindow = vtkGenericRenderWindow.newInstance();
      genericRenderWindow.setContainer(vtkContainerRef.current);
      genericRenderWindow.resize();

      const coneSource = vtkConeSource.newInstance({ height: 1.0 });
      const filter = vtkOutlineFilter.newInstance();
      filter.setInputConnection(coneSource.getOutputPort());

      // 流水线1 三角形
      const mapper = vtkMapper.newInstance();
      const actor = vtkActor.newInstance();
      actor.setMapper(mapper);
      mapper.setInputConnection(coneSource.getOutputPort());

      // 流水线2 外边框
      const outlineMapper = vtkMapper.newInstance();
      const outlineActor = vtkActor.newInstance();
      outlineActor.setMapper(outlineMapper);
      outlineMapper.setInputConnection(filter.getOutputPort());

      const renderer = genericRenderWindow.getRenderer();
      const renderWindow = genericRenderWindow.getRenderWindow();

      renderer.addActor(actor);
      renderer.addActor(outlineActor);
      renderer.resetCamera();
      renderWindow.render();

      context.current = {
        genericRenderWindow,
        renderWindow,
        renderer,
        coneSource,
        actor,
        mapper,
      };
    }

    return () => {
      if (context.current) {
        const { genericRenderWindow, coneSource, actor, mapper } = context.current;
        actor.delete();
        mapper.delete();
        coneSource.delete();
        genericRenderWindow.delete();
        context.current = null;
      }
    };
  }, [vtkContainerRef]);

  useEffect(() => {
    if (context.current) {
      const { coneSource, renderWindow } = context.current;
      coneSource.setResolution(coneResolution);
      renderWindow.render();
    }
  }, [coneResolution]);

  useEffect(() => {
    if (context.current) {
      const { actor, renderWindow } = context.current;
      actor.getProperty().setRepresentation(representation);
      renderWindow.render();
    }
  }, [representation]);

  return (
    <>
      <table
        style={{
          position: 'absolute',
          margin: '30px',
          background: 'white',
          padding: '12px',
        }}
      >
        <tbody>
          <tr>
            <td>
              <select
                value={representation}
                style={{ width: '100%' }}
                onInput={(ev: any) => setRepresentation(Number(ev.target.value))}
              >
                <option value="0">Points</option>
                <option value="1">Wireframe</option>
                <option value="2">Surface</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>
              <input
                type="range"
                min="4"
                max="80"
                value={coneResolution}
                onChange={(ev) => setConeResolution(Number(ev.target.value))}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div ref={vtkContainerRef} style={{ height: '640px' }} />
    </>
  );
};

export default Demo;
