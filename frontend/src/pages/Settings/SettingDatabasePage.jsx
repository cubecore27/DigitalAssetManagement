import React from 'react'
import SettingsNav from '../../components/SettingNav'
import Sidebar from '../../components/Sidebar'

export default function SettingDatabasePage() {
  return (
    <>
      <div className="sidebar">
        <Sidebar/>
        <div>
          <SettingsNav/>
          database
        </div>
      </div>
    </>
  )
}
