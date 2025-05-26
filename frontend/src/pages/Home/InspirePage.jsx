import { useState, useEffect } from 'react'
import React from 'react'
import Sidebar from '../../components/Sidebar'
import AssetGrid from '../../components/AssetGrid';


export default function InspirePage() {
  const [assets, setAssets] = useState([]);
  useEffect(() => {
    fetch('http://192.168.100.6:5000/Assets')
      .then(res => res.json())
      .then(data => setAssets(data));
  }, []);

  return (
    <>
    <div className="sidebar">
        <Sidebar/>
         <div className="App">
          <h1>My 3D Asset Gallery</h1>
          <AssetGrid assets={assets} />
        </div>
    </div>
    </>
  )
}





