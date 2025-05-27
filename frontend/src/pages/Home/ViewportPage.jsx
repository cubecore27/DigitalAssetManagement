import React from 'react'
import ModelViewer from '../../components/ModelViewer'
import Sidebar from '../../components/Sidebar';
import ImageMagnifier from '../../components/Magnifier';

const img = new Image();
img.src = "https://i.pinimg.com/736x/70/30/27/7030272bf0b7b0e9d98c50b661ff4bd3.jpg";

img.onload = function () {
  console.log(`Original Size: ${img.naturalWidth} x ${img.naturalHeight}`);
};

export default function ViewportPage() {
  const modelUrl = '/models/car.glb';
  return (
    <>
      <div className="sidebar">
        <Sidebar/>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>3D Model Viewer</h1>
          <ModelViewer modelPath={modelUrl} />
        </div>

        <div>
          <h2>Hover to magnify</h2>
          <ImageMagnifier
            src="https://i.pinimg.com/736x/70/30/27/7030272bf0b7b0e9d98c50b661ff4bd3.jpg"
            width={400}
            height={300}
            zoom={3}
          />
        </div>
      </div>
    </>

  )
}
