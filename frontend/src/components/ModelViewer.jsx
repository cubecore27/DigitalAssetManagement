// src/components/ModelViewer.jsx
import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Bounds } from '@react-three/drei';
import * as THREE from 'three';

function Model({ url }) {
  const { scene } = useGLTF(url);
  scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      if (child.material) child.material.needsUpdate = true;
    }
  });
  return <primitive object={scene} />;
}

export default function ModelViewer({ modelPath }) {
  // Slider state for horizontal light rotation
  const [angleY, setAngleY] = useState(0);
  const rad = THREE.MathUtils.degToRad(angleY);
  const radius = 10;
  const height = 5;
  const lightPos = [
    Math.sin(rad) * radius,  // x
    height,                  // y
    Math.cos(rad) * radius   // z
  ];

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

      {/* 3D Canvas */}
      <div style={{ width: '500px', height: '500px', border: '1px solid #ccc' }}>
        <Canvas shadows camera={{ position: [5, 5, 5], fov: 50 }}>
          {/* Fill lights */}
          <hemisphereLight skyColor={0xffffff} groundColor={0x444444} intensity={0.5} />
          <ambientLight intensity={0.3} />

          {/* Directional key light orbiting horizontally */}
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

          {/* Auto-fit bounds + environment + model */}
          <Suspense fallback={null}>
            <Bounds fit clip margin={1.2}>
              <Environment preset="sunset" background={false} />
              <Model url={modelPath} />
            </Bounds>
          </Suspense>

          {/* Ground to catch shadows */}
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <planeGeometry args={[50, 50]} />
            <shadowMaterial opacity={0.3} />
          </mesh>

          {/* Controls */}
          <OrbitControls makeDefault target={[0, 0, 0]} />
        </Canvas>
      </div>
    </div>
  );
}
