import React from 'react'
import SettingsNav from '../../components/SettingNav'
import Sidebar from '../../components/Sidebar'

export default function SettingRecommendationPage() {
  return (
    <>
      <div className="sidebar">
        <Sidebar/>
        <div>
        <SettingsNav/>
          SettingRecommendationPage
        </div>
      </div>
    </>

  )
}
