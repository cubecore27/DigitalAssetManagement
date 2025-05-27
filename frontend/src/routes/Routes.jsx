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

function MainRoutes(){
  return (
    <Routes>
        <Route path="/" element={<InspirePage />}/>
        <Route path="/asset" element={<ViewportPage />}/>
        <Route path="/assets/:id" element={<AssetDetail />} />
        <Route path="/add" element={<CreateAssetpage />}/>

        {/* Setting Page */}
        <Route path="/category" element={<SettingCategoryPage />}/>
        <Route path="/database" element={<SettingDatabasePage />}/>
        <Route path="/recommendation" element={<SettingRecommendationPage />}/>

        {/* Error Page */}
        <Route path="/error" element={<Error />}/>
    </Routes>
  );
}

export default MainRoutes; 