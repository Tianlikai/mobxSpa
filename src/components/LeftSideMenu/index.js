import Component from 'components/Component'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'

import { Menu, Icon } from 'antd'
import SIDE_MENU from '../../settings/sideMenu'

import Logo from './logo.svg'
import './style.scss'

const { Item, SubMenu } = Menu

export default class SideMenu extends Component {
    static propTypes = {
        selectedKeys: PropTypes.string
    }
    constructor(props) {
        super(props)
        let { selectedKeys } = this.props
        let openKeys = [selectedKeys.split('/')[1]]
        this.state = {
            openKeys: openKeys
        }
    }
    handleClick(e) {}

    handleOpenChange = openKeys => {
        this.setState({
            openKeys: openKeys
        })
    }

    get menu() {
        let SHOW_SIDE_MENU = {}
        Object.keys(SIDE_MENU).map(key => {
            let menu = SIDE_MENU[key]
            if (G.checkPermission(menu.PERMISSIONS)) {
                SHOW_SIDE_MENU[key] = menu
            }
        })
        return SHOW_SIDE_MENU
    }

    render() {
        const { selectedKeys: selKeys } = this.props
        const selectedKeys = [selKeys]
        const { openKeys } = this.state
        let menuProps = {
            mode: 'inline',
            theme: 'dark',
            openKeys,
            selectedKeys,
            onClick: this.handleClick,
            onOpenChange: this.handleOpenChange
        }
        return (
            <div className='sideMenu'>
                <div className='logo'>
                    <img src={Logo} alt='logo' />
                    <span>{' ~~~~'}</span>
                </div>
                <Menu {...menuProps}>
                    {Object.keys(this.menu).map(key => {
                        const title = (
                            <span>
                                <Icon type={this.menu[key].iconType} />
                                <span>{this.menu[key].text}</span>
                            </span>
                        )
                        if (
                            this.menu[key].children
                            && this.menu[key].children.length <= 0
                        ) {
                            return (
                                <Item key={this.menu[key].to}>
                                    <Link to={this.menu[key].to}>
                                        <Icon type={this.menu[key].iconType} />
                                        {this.menu[key].text}
                                    </Link>
                                </Item>
                            )
                        } else {
                            return (
                                <SubMenu key={key} title={title}>
                                    {this.menu[key].children.map(item => {
                                        if (
                                            G.checkPermission(item.PERMISSIONS)
                                        ) {
                                            return (
                                                <Item key={item.to}>
                                                    <Link to={item.to}>
                                                        {item.text}
                                                    </Link>
                                                </Item>
                                            )
                                        }
                                    })}
                                </SubMenu>
                            )
                        }
                    })}
                </Menu>
            </div>
        )
    }
}
