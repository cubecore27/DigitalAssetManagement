import React from 'react'
import SettingsNav from '../../components/SettingNav'
import Sidebar from '../../components/Sidebar'

export default function SettingDatabasePage() {
  return (
    <>
      <SettingsNav/>
      <div className="sidebar">
        <Sidebar/>
        <div>SettingDatabasePage</div>
      </div>
    </>
  )
}
