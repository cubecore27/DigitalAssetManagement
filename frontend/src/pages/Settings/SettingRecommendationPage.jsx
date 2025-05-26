import React from 'react'
import SettingsNav from '../../components/SettingNav'
import Sidebar from '../../components/Sidebar'

export default function SettingRecommendationPage() {
  return (
    <>
      <SettingsNav/>
      <div className="sidebar">
        <Sidebar/>
        <div>SettingRecommendationPage</div>
      </div>
    </>

  )
}
