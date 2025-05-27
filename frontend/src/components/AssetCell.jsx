import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Bounds } from '@react-three/drei';
import styles from './AssetCell.module.css';

const API_BASE = 'http://192.168.100.6:2000/';

function MiniModelViewer({ url }) {
  const Model = () => {
    const { scene } = useGLTF(url);
    return <primitive object={scene} />;
  };

  return (
    <div className={styles.modelContainer}>
      <Canvas
        camera={{ position: [10, 10, 10], fov: 35 }}
        className={styles.canvas}
        resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
      >
        <ambientLight intensity={10} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <Bounds fit clip observe margin={1.5}>
          <Model />
        </Bounds>
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />
      </Canvas>
      <div className={styles.modelBadge}>3D</div>
    </div>
  );
}

export default function AssetCell({ asset }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const rawPath =
    asset.thumbnail_url ||
    asset.thumbnailUrl ||
    asset.file_url ||
    asset.file_path;

  const src =
    rawPath?.startsWith('http://') || rawPath?.startsWith('https://')
      ? rawPath
      : `${API_BASE}${rawPath}`;

  const is3DModel = /\.(glb|gltf|obj|fbx)$/i.test(src);
  const isImage = /\.(jpg|jpeg|png|gif|webp|jfif)$/i.test(src);

  // Generate random height for masonry effect (Pinterest style)
  const getRandomHeight = () => {
    const heights = [250, 300, 350, 400, 450];
    return heights[Math.floor(Math.random() * heights.length)];
  };

  return (
    <Link to={`/assets/${asset.id}`} className={styles.cellLink}>
      <div className={styles.assetCell}>
        <div 
          className={styles.mediaWrapper}
          style={{ 
            height: is3DModel ? '280px' : isImage ? 'auto' : '200px'
          }}
        >
          {is3DModel ? (
            <MiniModelViewer url={src} />
          ) : isImage ? (
            <div className={styles.imageContainer}>
              {!imageLoaded && !imageError && (
                <div className={styles.imagePlaceholder}>
                  <div className={styles.loadingSpinner}></div>
                </div>
              )}
              <img
                src={src}
                alt={asset.title || 'Asset'}
                className={`${styles.assetImage} ${imageLoaded ? styles.loaded : ''}`}
                onLoad={() => setImageLoaded(true)}
                onError={() => {
                  setImageError(true);
                  setImageLoaded(true);
                }}
                style={{ display: imageError ? 'none' : 'block' }}
              />
              {imageError && (
                <div className={styles.errorPlaceholder}>
                  <div className={styles.errorIcon}>🖼️</div>
                  <span>Image unavailable</span>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.filePlaceholder}>
              <div className={styles.fileIcon}>📄</div>
              <span className={styles.fileType}>
                {src.split('.').pop()?.toUpperCase() || 'FILE'}
              </span>
            </div>
          )}
          
          <div className={styles.overlay}>
            <div className={styles.overlayContent}>
              <button className={styles.viewButton}>View Details</button>
            </div>
          </div>
        </div>

        {(asset.title || asset.description) && (
          <div className={styles.assetInfo}>
            {asset.title && (
              <h3 className={styles.assetTitle}>{asset.title}</h3>
            )}
            {asset.description && (
              <p className={styles.assetDescription}>
                {asset.description.length > 80 
                  ? `${asset.description.substring(0, 80)}...` 
                  : asset.description
                }
              </p>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}