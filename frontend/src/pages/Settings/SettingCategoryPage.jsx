import React from 'react'
import Sidebar from '../../components/Sidebar'
import SettingsNav from '../../components/SettingNav'

export default function SettingCategoryPage() {
  return (
    <>
    <div className="sidebar">
      <Sidebar/>
      <div
      style={{width: '100%'}}>
      <SettingsNav/>
      Category
      </div>
    </div>
    </>
    
  )
}
