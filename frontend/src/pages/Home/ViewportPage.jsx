import React from 'react'
import ModelViewer from '../../components/ModelViewer'
import Sidebar from '../../components/Sidebar';
import AssetCell from '../../components/assetcell';

export default function ViewportPage() {
  const modelUrl = '/models/car_scene.glb';
  return (
    <>
      <div className="sidebar">
        <Sidebar/>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>3D Model Viewer</h1>
          <ModelViewer modelPath={modelUrl} />
        </div>
      </div>
    </>

  )
}
