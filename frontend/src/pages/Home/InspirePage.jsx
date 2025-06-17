import { useState, useEffect } from 'react'
import React from 'react'
import Sidebar from '../../components/Sidebar'
import AssetGrid from '../../components/AssetGrid';
import RetractableSearchBar from '../../components/RetractableSearchBar';


export default function InspirePage() {
  const [assets, setAssets] = useState([]);
  useEffect(() => {
    fetch('http://192.168.100.6:2000/asset/assets/')
      .then(res => res.json())
      .then(data => setAssets(data));
  }, []);

  return (
    <>
    <div style={{
            width: '100%'
          }}>
            <RetractableSearchBar/>
            <div style={{
            width: '100%'
          }}>
            <AssetGrid assets={assets} />
          </div>
    </div>
    </>
  )
}





