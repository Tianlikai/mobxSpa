import AuthComponent from 'libs/AuthComponent'

import { Tabs } from 'antd'
const TabPane = Tabs.TabPane

const NavTabs = config => {
  class TabBase extends AuthComponent {
    handleTabChange = key => {
      this.gotoPage(key)
    }
    render() {
      const { currentKey, routePath, needRight } = config
      if (needRight) {
        const isSuperRight = G.attendant()
        if (!isSuperRight) return null
      }
      return (
        <Tabs defaultActiveKey={currentKey} onChange={this.handleTabChange}>
          <TabPane tab='我的视频' key={routePath[0]} />
          <TabPane tab='学校视频' key={routePath[1]} />
        </Tabs>
      )
    }
  }

  return TabBase
}

export default NavTabs
