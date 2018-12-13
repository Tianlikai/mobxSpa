import React from 'react'

import { Tabs } from 'antd'
const TabPane = Tabs.TabPane

const NavTabs = config => props => {
  const { handleTabChange } = props
  const { currentKey, routePath, needRight } = config
  if (needRight) {
    const isSuperRight = G.attendant()
    if (!isSuperRight) return null
  }
  return (
    <Tabs defaultActiveKey={currentKey} onChange={handleTabChange}>
      <TabPane tab='我的视频' key={routePath[0]} />
      <TabPane tab='学校视频' key={routePath[1]} />
    </Tabs>
  )
}

export default NavTabs
