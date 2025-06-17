import React from 'react'
import SettingsNav from '../../components/SettingNav'
import Sidebar from '../../components/Sidebar'
import SystemStats from './components/SystemStats'
import ResetIndexButton from '../../components/ResetIndexButton'

export default function SettingDatabasePage() {
  return (
    <>
        <div
        style={{width: '100%'}}>
          <SettingsNav/>
        </div>
        <div>
          <ResetIndexButton/>
        </div>
          <SystemStats/>
        <div>

        </div>
    </>
  )
}
