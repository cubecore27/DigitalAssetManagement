import React from 'react';

// Route 
import { Route, Routes } from 'react-router-dom';
import CreateAssetpage from '../pages/Home/CreateAssetpage';
import AssetDetailPage from '../pages/Home/AssetDetailPage';
import InspirePage from '../pages/Home/InspirePage';
import ViewportPage from '../pages/Home/ViewportPage';
import SettingCategoryPage from '../pages/Settings/SettingCategoryPage';
import SettingDatabasePage from '../pages/Settings/SettingDatabasePage';
import SettingRecommendationPage from '../pages/Settings/SettingRecommendationPage';
import Error from '../pages/Error/Error';
import AssetDetail from '../pages/Home/AssetDetailPage';
import Sidebar from '../components/Sidebar';
import CollectionManager from '../components/collection';
import SettingCollectionPage from '../pages/Settings/SettingCollectionPage';
import CollectionSelector from '../components/CollectionSelector';
import CollectionViewer from '../components/CollectionViewer';

function MainRoutes(){
  return (
    <>
      <div style={{ display: "flex" }}>
        <Sidebar /> {/* stays always on the left */}
        <div style={{ flex: 1, padding: "1rem" }}>
          <Routes>
            <Route path="/" element={<InspirePage />} />
            <Route path="/asset" element={<ViewportPage />} />
            <Route path="/collection" element={<SettingCollectionPage />} />
            <Route path="/assets/:id" element={<AssetDetail />} />
            <Route path="/add" element={<CreateAssetpage />} />

            <Route path="/collections" element={<CollectionSelector />} />
            <Route path="/collections/:id" element={<CollectionViewer />} />


            <Route path="/category" element={<SettingCategoryPage />} />
            <Route path="/database" element={<SettingDatabasePage />} />
            <Route path="/recommendation" element={<SettingRecommendationPage />} />
            <Route path="/collection" element={<SettingCollectionPage />} />
            <Route path="/error" element={<Error />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default MainRoutes; 