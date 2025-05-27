import React from 'react';
import { Link } from 'react-router-dom'; // 🧭 Import Link
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Bounds } from '@react-three/drei';

const API_BASE = 'http://192.168.100.6:2000/';

function MiniModelViewer({ url }) {
  const Model = () => {
    const { scene } = useGLTF(url);
    return <primitive object={scene} />;
  };

  return (
    <div style={{ width: '100%', paddingTop: '100%', position: 'relative' }}>
      <Canvas
        camera={{ position: [10, 10, 10], fov: 35 }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
      >
        <ambientLight intensity={10} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <Bounds fit clip observe margin={1.5}>
          <Model />
        </Bounds>
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />
      </Canvas>
    </div>
  );
}

export default function AssetCell({ asset }) {
  const rawPath =
    asset.thumbnail_url ||
    asset.thumbnailUrl ||
    asset.file_url ||
    asset.file_path;

  const src =
    rawPath.startsWith('http://') || rawPath.startsWith('https://')
      ? rawPath
      : `${API_BASE}${rawPath}`;

  const is3DModel = /\.(glb|gltf|obj|fbx)$/i.test(src);

  return (
    <Link to={`/assets/${asset.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="asset-cell" style={{ width: '200px', cursor: 'pointer' }}>
        <div className="asset-image-wrapper" style={{ width: '100%', position: 'relative' }}>
          {is3DModel ? (
            <MiniModelViewer url={src} />
          ) : (
            <img
              src={src}
              alt={asset.title || 'Asset'}
              className="asset-image"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          )}
        </div>
        <div className="asset-info" style={{ padding: '0.5rem' }}>
          {asset.title && <h3 className="asset-title">{asset.title}</h3>}
          {asset.description && <p className="asset-description">{asset.description}</p>}
        </div>
      </div>
    </Link>
  );
}


// // src/components/AssetCell.jsx
// import React from 'react';
// import { Canvas } from '@react-three/fiber';
// import { OrbitControls, useGLTF, Bounds } from '@react-three/drei';
// import * as THREE from 'three';

// const API_BASE = 'http://192.168.100.6:2000/';

// function MiniModelViewer({ url }) {
//   const Model = () => {
//     const { scene } = useGLTF(url);
//     return <primitive object={scene} />;
//   };

//   return (
//     <Canvas
//       camera={{ position: [10, 10, 10], fov: 35 }}
//       style={{ width: '100%', height: '100%' }}
//       resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
//     >
//       <ambientLight intensity={10} />
//       <directionalLight position={[10, 10, 10]} intensity={1} />
//       <Bounds fit clip observe margin={0.5}>
//         <Model />
//       </Bounds>
//       <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />
//     </Canvas>
//   );
// }

// export default function AssetCell({ asset }) {
//   const rawPath =
//     asset.thumbnail_url ||
//     asset.thumbnailUrl ||
//     asset.file_url ||
//     asset.file_path;

//   const src =
//     rawPath.startsWith('http://') || rawPath.startsWith('https://')
//       ? rawPath
//       : `${API_BASE}${rawPath}`;

//   const is3DModel = /\.(glb|gltf|obj|fbx)$/i.test(src);

//   return (
//     <div className="asset-cell" style={{ width: '200px' }}>
//       <div
//         className="asset-image-wrapper"
//         style={{ width: '100%', height: '200px', position: 'relative' }}
//       >
//         {is3DModel ? (
//           <MiniModelViewer url={src} />
//         ) : (
//           <img
//             src={src}
//             alt={asset.title || 'Asset'}
//             className="asset-image"
//             style={{ width: '100%', height: '100%', objectFit: 'cover' }}
//           />
//         )}
//       </div>
//       <div className="asset-info" style={{ padding: '0.5rem' }}>
//         {asset.title && <h3 className="asset-title">{asset.title}</h3>}
//         {asset.description && (
//           <p className="asset-description">{asset.description}</p>
//         )}
//       </div>
//     </div>
//   );
// }

// const API_BASE = 'http://192.168.100.6:2000/';

// export default function AssetCell({ asset }) {
//   const rawPath =
//     asset.thumbnail_url ||
//     asset.thumbnailUrl ||
//     asset.file_url ||
//     asset.file_path;

//   const src =
//     rawPath.startsWith('http://') || rawPath.startsWith('https://')
//       ? rawPath
//       : `${API_BASE}${rawPath}`;

//   return (
//     <div className="asset-cell">
//       <div className="asset-image-wrapper">
//         <img
//           src={src}
//           alt={asset.title || 'Asset'}
//           className="asset-image"
//         />
//       </div>
//       <div className="asset-info">
//         {asset.title && <h3 className="asset-title">{asset.title}</h3>}
//         {asset.description && (
//           <p className="asset-description">{asset.description}</p>
//         )}
//       </div>
//     </div>
//   );
// }



// export default function AssetCell({ asset }) {
//   // asset should have at least:
//   // { id, title, thumbnailUrl (or file_path), description? }
//   const src = asset.thumbnailUrl || asset.file_path;

//   return (
//     <div className="asset-cell">
//       <div className="asset-image-wrapper">
//         <img
//           src={src}
//           alt={asset.title || 'Asset'}
//           className="asset-image"
//         />
//       </div>
//       <div className="asset-info">
//         {asset.title && <h3 className="asset-title">{asset.title}</h3>}
//         {asset.description && (
//           <p className="asset-description">{asset.description}</p>
//         )}
//       </div>
//     </div>
//   );
// }