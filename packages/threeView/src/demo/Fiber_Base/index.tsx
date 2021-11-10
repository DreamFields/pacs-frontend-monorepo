/*
 * @Author: linkenzone
 * @Date: 2021-10-12 15:18:52
 * @Descripttion:
 * 官方例子改
 * https://codesandbox.io/s/rrppl0y8l4
 */
import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

import { Stats, OrbitControls } from '@react-three/drei';

import styles from './style.less';

function Box(props) {
  // This reference will give us direct access to the mesh
  const ref: any = useRef();
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x = ref.current.rotation.y += 0.01;
    }
  });
  return (
    <mesh
      {...props}
      ref={ref}
      scale={active ? 1.5 : 1}
      onClick={(e) => setActive(!active)}
      onPointerOver={(e) => setHover(true)}
      onPointerOut={(e) => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  );
}

// const StatsCom: React.FC<unknown> = () => {
//   const node = useRef(document.createElement('div'));

//   useEffect(() => {
//     const domEle = node.current;
//     domEle.id = 'test';
//     document.body.appendChild(domEle);

//     console.log('type', typeof domEle);
//     console.log('domEle', domEle);

//     return () => {
//       document.body.removeChild(domEle);
//     };
//   }, []);

//   console.log('111', node.current);
//   return <Stats parent={node} />;
// };

const App: React.FC<unknown> = () => {
  const containerRef = useRef();

  const [statsParent, setStatsParent] = useState<any>(null);

  const list = new Array(50).fill(1);

  useEffect(() => {
    const container = containerRef.current;

    setStatsParent(container);
    return () => {
      // 执行清理
    };
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        {/* <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} /> */}
        {list.map((number, index) => {
          console.log('11');

          const num = Math.ceil(Math.random() * 3);

          // eslint-disable-next-line react/no-array-index-key
          return <Box position={[0 + index * 2, 0, 0]} key={index} />;
        })}
        <OrbitControls autoRotate makeDefault />
        <Stats parent={containerRef} className={styles.stats} />
      </Canvas>
    </div>
  );
};

export default App;
