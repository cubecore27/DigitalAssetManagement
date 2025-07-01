import React from 'react'
import SettingsNav from '../../components/SettingNav'
import Sidebar from '../../components/Sidebar'
import CategoryManager from '../../components/category'
import TagCreator from '../../components/tag'
import CreateCollection from '../../components/collection'

export default function SettingCollectionPage() {
  return (
    <>
    <div
          style={{width: '100%'}}>
          <SettingsNav/>
          <div>
          <CreateCollection/>
        </div>
    </div>
    </>

  )
}
