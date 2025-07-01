// src/components/AssetDetail.jsx
import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Bounds } from '@react-three/drei';
import Sidebar from '../../components/Sidebar';
import RetractableSearchBar from '../../components/RetractableSearchBar';
import AssetGrid from '../../components/AssetGrid';
import styles from './AssetDetail.module.css';
import ModelViewer from '../../components/ModelViewer';

const API_BASE = 'https://digitalassetmanagement-production.up.railway.app/';

function FullModelViewer({ url }) {
  const Model = () => {
    const { scene } = useGLTF(url);
    return <primitive object={scene} />;
  };

  return (
    <div style={{ width: '100%', height: '600px', position: 'relative' }}>
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Suspense fallback={<p>Loading 3D model...</p>}>
          <Bounds fit clip observe margin={1.2}>
            <Model />
          </Bounds>
        </Suspense>
        <OrbitControls enableZoom autoRotate autoRotateSpeed={1.0} />
      </Canvas>
    </div>
  );
}

function FullscreenModal({ src, alt, rotation, isFlipped, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const transformedStyle = {
    maxWidth: '95vw',
    maxHeight: '95vh',
    objectFit: 'contain',
    transform: `rotate(${rotation}deg) scaleX(${isFlipped ? -1 : 1})`,
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        cursor: 'pointer'
      }}
      onClick={onClose}
    >
      <img
        src={src}
        alt={alt}
        style={transformedStyle}
        onClick={(e) => e.stopPropagation()}
      />
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '20px',
          right: '30px',
          background: 'rgba(255, 255, 255, 0.2)',
          border: 'none',
          color: 'white',
          fontSize: '30px',
          cursor: 'pointer',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        ×
      </button>
    </div>
  );
}

function RotationControls({ onRotationChange, onFlipChange, rotation, isFlipped }) {
  const buttonStyle = {
    // padding: '8px 12px',
    // margin: '2px',
    // border: '1px solid #ccc',
    background: '#acacac',
    // cursor: 'pointer',
    // borderRadius: '4px',
    // fontSize: '14px'
  };

  const resetAll = () => {
    onRotationChange(0);
    onFlipChange(false);
  };

  return (
    <div style={{ marginBottom: '1rem', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <button style={buttonStyle} onClick={() => onRotationChange((rotation + 180) % 360)}>↻ 180°</button>
      <button style={buttonStyle} onClick={() => onFlipChange(prev => !prev)}>⟷ Flip H</button>
      <button style={buttonStyle} onClick={resetAll}>Reset</button>
    </div>
  );
}


function Magnifier({ src, zoom = 2, width = 150, height = 150, rotation = 0, isFlipped = false }) {
  const imgRef = useRef(null);
  const lensRef = useRef(null);
  const [transformedSrc, setTransformedSrc] = useState(null);

  const cleanedSrc = String(src).replace(/\\/g, '/').replace(/[^\x20-\x7E]/g, '');

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = cleanedSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const angleRad = (rotation * Math.PI) / 180;

      // Calculate canvas size for rotation
      const sin = Math.abs(Math.sin(angleRad));
      const cos = Math.abs(Math.cos(angleRad));
      const newWidth = img.width * cos + img.height * sin;
      const newHeight = img.width * sin + img.height * cos;
      canvas.width = newWidth;
      canvas.height = newHeight;

      ctx.translate(newWidth / 2, newHeight / 2);
      ctx.rotate(angleRad);
      ctx.scale(isFlipped ? -1 : 1, 1);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      setTransformedSrc(canvas.toDataURL());
    };
  }, [cleanedSrc, rotation, isFlipped]);

  const handleMouseMove = (e) => {
    const img = imgRef.current;
    const lens = lensRef.current;
    if (!img || !lens) return;

    const rect = img.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const lensX = Math.max(0, Math.min(x - width / 2, img.width - width));
    const lensY = Math.max(0, Math.min(y - height / 2, img.height - height));

    lens.style.left = `${lensX}px`;
    lens.style.top = `${lensY}px`;

    lens.style.backgroundPosition = `-${lensX * zoom}px -${lensY * zoom}px`;
  };

  const handleImageLoad = () => {
    const lens = lensRef.current;
    const img = imgRef.current;
    if (lens && img && transformedSrc) {
      lens.style.backgroundSize = `${img.width * zoom}px ${img.height * zoom}px`;
    }
  };

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => lensRef.current && (lensRef.current.style.display = 'none')}
      onMouseEnter={() => lensRef.current && (lensRef.current.style.display = 'block')}
    >
      <img
        ref={imgRef}
        src={transformedSrc || cleanedSrc}
        alt="Zoomable"
        onLoad={handleImageLoad}
        style={{
          maxWidth: '100%',
          maxHeight: '70vh',
          cursor: 'zoom-in'
        }}
      />
      <div
        ref={lensRef}
        style={{
          display: 'none',
          position: 'absolute',
          border: '1px solid #ccc',
          width: `${width}px`,
          height: `${height}px`,
          backgroundImage: `url('${transformedSrc || cleanedSrc}')`,
          backgroundRepeat: 'no-repeat',
          pointerEvents: 'none',
          zIndex: 100
        }}
      />
    </div>
  );
}

export default function AssetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [asset, setAsset] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}asset/assets/${id}/`)
      .then(res => res.json())
      .then(data => setAsset(data))
      .catch(err => console.error(err));
  }, [id]);

  const [assets, setAssets] = useState([]);
  useEffect(() => {
    fetch(`${API_BASE}search/similar/${id}/`)
      .then(res => res.json())
      .then(data => setAssets(data));
  }, []);

  if (!asset) return <p>Loading...</p>;

  const rawPath = asset.file_url || asset.file_path || asset.thumbnail_url || asset.thumbnailUrl;
  const src = rawPath?.startsWith('http://') || rawPath?.startsWith('https://') ? rawPath : `${API_BASE}${rawPath}`;
  const is3DModel = /\.(glb|gltf)$/i.test(src);
  const isImage = /\.(jpg|jpeg|png|gif|webp|jfif)$/i.test(src);

  return (
    <>
        <div style={{ width: '100%' }}>
          <RetractableSearchBar />
          <div style={{ width: '100%' }}>
            <div className={styles.container}>
              <div className={styles.wrapper}>
                <div style={{ width: '100%', marginTop: '1rem' }}>
                  {is3DModel ? (
                    <>
                      <div className={styles.staticstyle}>
                        <ModelViewer modelPath={src} />
                        <div className={styles.right}>
                          <RotationControls
                            rotation={rotation}
                            isFlipped={isFlipped}
                            onRotationChange={setRotation}
                            onFlipChange={setIsFlipped}
                          />
                          <h2>{asset.title}</h2>
                          <p>{asset.description}</p>
                        </div>
                      </div>
                    </>

                  ) : isImage ? (
                    <>
                      <div className={styles.dynamicstyle}>
                        <div className={styles.left} onClick={() => setShowFullscreen(true)}>
                          <Magnifier
                            src={src}
                            zoom={2}
                            rotation={rotation}
                            isFlipped={isFlipped}
                          />
                        </div>
                        <div className={styles.right}>
                          <RotationControls
                            rotation={rotation}
                            isFlipped={isFlipped}
                            onRotationChange={setRotation}
                            onFlipChange={setIsFlipped}
                          />
                          <h2>{asset.title}</h2>
                          <p>{asset.description}</p>
                        </div>
                      </div>
                      <p style={{ fontSize: '12px', color: '#766', marginTop: '8px', textAlign: 'center' }}>
                        Click image to view fullscreen
                      </p>
                    </>
                  ) : (
                    <p>Preview not supported for this file type.</p>
                  )}
                </div>

                {showFullscreen && isImage && (
                  <FullscreenModal
                    src={src}
                    alt={asset.title || 'Asset'}
                    rotation={rotation}
                    isFlipped={isFlipped}
                    onClose={() => setShowFullscreen(false)}
                  />
                )}
              </div>
            </div>
          </div>
          <AssetGrid assets={assets} />
        </div>
    </>
  );
}