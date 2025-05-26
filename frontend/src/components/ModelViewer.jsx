// src/components/ModelViewer.jsx
import React, { Suspense, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Bounds, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

function Model({ url, playAnimationTrigger }) {
  const group = useRef();
  const { scene, animations } = useGLTF(url);
  const { actions, names } = useAnimations(animations, group);

  // Enable shadows on meshes
  scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      if (child.material) child.material.needsUpdate = true;
    }
  });

  // Play animation if triggered
  React.useEffect(() => {
    if (playAnimationTrigger && actions && names.length > 0) {
      actions[names[0]]?.reset().fadeIn(0.5).play();
    }
  }, [playAnimationTrigger, actions, names]);

  return <primitive object={scene} ref={group} />;
}

export default function ModelViewer({ modelPath }) {
  const [angleY, setAngleY] = useState(0);
  const [playAnim, setPlayAnim] = useState(false);

  const rad = THREE.MathUtils.degToRad(angleY);
  const radius = 10;
  const height = 5;
  const lightPos = [Math.sin(rad) * radius, height, Math.cos(rad) * radius];

  return (
    <div style={{ width: '500px', margin: '0 auto' }}>
      {/* Light rotation slider */}
      <div style={{ margin: '1rem 0', textAlign: 'center' }}>
        <label>
          Light Rotation: {angleY}°
          <input
            type="range"
            min={0}
            max={360}
            value={angleY}
            onChange={e => setAngleY(+e.target.value)}
            style={{ width: '80%', marginLeft: '0.5rem' }}
          />
        </label>
      </div>

      {/* Play Animation Button */}
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <button onClick={() => setPlayAnim(prev => !prev)}>Play Animation</button>
      </div>

      {/* 3D Canvas */}
      <div style={{ width: '500px', height: '500px', border: '1px solid #ccc' }}>
        <Canvas shadows camera={{ position: [5, 5, 5], fov: 50 }}>
          <hemisphereLight skyColor={0xffffff} groundColor={0x444444} intensity={0.5} />
          <ambientLight intensity={0.3} />

          <directionalLight
            castShadow
            intensity={1.2}
            position={lightPos}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-near={0.5}
            shadow-camera-far={50}
            shadow-bias={-0.0001}
          />

          <Suspense fallback={null}>
            <Bounds fit clip margin={1.2}>
              <Environment preset="sunset" background={false} />
              <Model url={modelPath} playAnimationTrigger={playAnim} />
            </Bounds>
          </Suspense>

          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <planeGeometry args={[50, 50]} />
            <shadowMaterial opacity={0.3} />
          </mesh>

          <OrbitControls makeDefault target={[0, 0, 0]} />
        </Canvas>
      </div>
    </div>
  );
}
