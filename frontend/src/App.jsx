import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import ModelViewer from './components/ModelViewer';

function App() {
  // Adjust path to your model in public/models/
  const modelUrl = '/models/car_scene.glb';

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>3D Model Viewer</h1>
      <ModelViewer modelPath={modelUrl} />
    </div>
  );
}
export default App
