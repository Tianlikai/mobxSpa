import Component from '../components/Component'
import { Dropdown, Menu, Button } from 'antd'
import Storage from 'libs/storage'

import { AUTHORITY } from '../settings/routeAndPermissions'
import './styles/Header.scss'
const MenuItem = Menu.Item

export default class Header extends Component {
    static defaultProps = {
        AUTHORITY,
        username: Storage.get('username')
    }
    goToTargetPage = target => {
        G.updateReturnParams('returnParams')
        if (target) G.history.push({ pathname: target })
    }
    handleAuthority = () => {
        let permissionList = Storage.get('permissionList') || []
        return permissionList.indexOf(60003) >= 0 || false
    }
    render() {
        const { logOut, currentAddress, AUTHORITY, username } = this.props
        let key = currentAddress.split('/')[2]
        let { pageTitle, btnText, target } = AUTHORITY[key] || {}
        let hadCreatePermission = this.handleAuthority() // 是否有创建权限
        const menu = (
            <Menu onClick={logOut}>
                <MenuItem key='0'>退出</MenuItem>
            </Menu>
        )
        return (
            <div className='header'>
                {btnText
                    && hadCreatePermission && (
                    <Button
                        className={
                            key
                                ? 'create-order' + '-' + key
                                : 'create-order'
                        }
                        onClick={this.goToTargetPage.bind(null, target)}
                    >
                        {btnText}
                    </Button>
                )}
                {pageTitle && (
                    <div className='create-order-title'>{pageTitle}</div>
                )}
                <Dropdown overlay={menu}>
                    <a>{username}</a>
                </Dropdown>
            </div>
        )
    }
}
