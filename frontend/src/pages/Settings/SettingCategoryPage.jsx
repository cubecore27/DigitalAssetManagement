import React from 'react'
import Sidebar from '../../components/Sidebar'
import SettingsNav from '../../components/SettingNav'

export default function SettingCategoryPage() {
  return (
    <>
      <SettingsNav/>
      <div className="sidebar">
        <Sidebar/>
        <div>SettingCategoryPage</div>
      </div>
    </>
    
  )
}
