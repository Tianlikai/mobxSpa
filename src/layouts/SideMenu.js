import Component from '../components/Component'
import { Menu, Icon } from 'antd'
import { Link } from 'react-router-dom'
import { SIDE_MENU } from '../settings/routeAndPermissions'
import './styles/SideMenu.scss'

const { Item, SubMenu } = Menu

export default class SideMenu extends Component {
    constructor(props) {
        super(props)
        let { selectedKeys } = this.props
        let openKeys = [selectedKeys.split('/')[1]]
        this.state = {
            openKeys: openKeys
        }
    }
    componentDidMount() {
        console.log(this.props.location)
    }
    handleClick(e) {
        console.log('click', e)
    }
    handleOpenChange = openKeys => {
        this.setState({ openKeys: openKeys })
    }
    get menu() {
        let SHOW_SIDE_MENU = {}
        Object.keys(SIDE_MENU).map(key => {
            let menu = SIDE_MENU[key]
            if (G.checkPermission(menu.PERMISSIONS)) SHOW_SIDE_MENU[key] = menu
        })
        return SHOW_SIDE_MENU
    }
    render() {
        const { selectedKeys: selKeys } = this.props
        const selectedKeys = [selKeys]
        const { openKeys } = this.state
        const style = { width: 200, height: '100%' }
        let menuProps = {
            mode: 'inline',
            theme: 'dark',
            style,
            openKeys,
            selectedKeys,
            onClick: this.handleClick,
            onOpenChange: this.handleOpenChange
        }
        return (
            <div className='menu'>
                <div className='sideMenu'>
                    <div className='logo' />
                    <Menu {...menuProps}>
                        {Object.keys(this.menu).map(key => {
                            return (
                                <SubMenu
                                    key={key}
                                    title={
                                        <span>
                                            <Icon
                                                type={this.menu[key].iconType}
                                            />
                                            <span>{this.menu[key].text}</span>
                                        </span>
                                    }
                                >
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
                        })}
                    </Menu>
                </div>
            </div>
        )
    }
}
