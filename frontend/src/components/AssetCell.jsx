// src/components/AssetCell.jsx
import React from 'react';

const API_BASE = 'http://192.168.100.6:5000';

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

  return (
    <div className="asset-cell">
      <div className="asset-image-wrapper">
        <img
          src={src}
          alt={asset.title || 'Asset'}
          className="asset-image"
        />
      </div>
      <div className="asset-info">
        {asset.title && <h3 className="asset-title">{asset.title}</h3>}
        {asset.description && (
          <p className="asset-description">{asset.description}</p>
        )}
      </div>
    </div>
  );
}

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