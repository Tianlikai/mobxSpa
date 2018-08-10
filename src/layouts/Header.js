import Component from '../components/Component'
import {Dropdown, Menu, Button} from 'antd'
import Storage from 'libs/storage'

import './styles/Header.scss'
const MenuItem = Menu.Item

export default class Header extends Component {
    static defaultProps = {
        Authority: {
            createOrder: {
                pageTitle: '创建订单',
                btnText: '< 返回',
                target: '/orgAdmin/orderList'
            },
            orderDetail: {
                pageTitle: '订单详情',
                btnText: '< 返回',
                target: '/orgAdmin/orderList'
            },
            orderList: {
                pageTitle: '',
                btnText: '创建订单',
                target: '/orgAdmin/createOrder'
            },
            myIncome: {
                pageTitle: '我的分成',
                btnText: '',
                target: ''
            },
            myPromotion: {
                pageTitle: '我的推广',
                btnText: '',
                target: ''
            },
            createPromotion: {
                pageTitle: '新增推广',
                btnText: '< 返回',
                target: '/myAgent/myPromotion'
            },
            promotionDetail: {
                pageTitle: '推广详情',
                btnText: '< 返回',
                target: '/myAgent/myPromotion'
            },
            applicationSettlement: {
                pageTitle: '申请结算',
                btnText: '',
                target: ''
            },
            settlementHistory: {
                pageTitle: '结算历史',
                btnText: '',
                target: ''
            },
            myInformation: {
                pageTitle: '我的信息',
                btnText: '',
                target: ''
            }
        }
    }
    goToTargetPage = (target) => {
        G.updateReturnParams('returnParams')
        if (target) G.history.push({pathname: target})
    }
    handleAuthority = () => {
        let permissionList = Storage.get('permissionList') || []
        return permissionList.indexOf(60003) >= 0 || false
    }
    render() {
        let {logOut, currentAddress, Authority} = this.props
        let key = currentAddress.split('/')[2]
        let {pageTitle, btnText, target} = Authority[key] || {}
        let hadCreatePermission = this.handleAuthority() // 是否有创建权限
        const menu = (
            <Menu onClick={logOut}>
                <MenuItem key='0'>退出</MenuItem>
            </Menu>
        )
        return (
            <div className='header'>
                {
                    btnText && hadCreatePermission && <Button
                        className={key ? 'create-order' + '-' + key : 'create-order'}
                        onClick={this.goToTargetPage.bind(null, target)}>
                        {btnText}
                    </Button>
                }
                {
                    pageTitle && <div className='create-order-title'>
                        {pageTitle}
                    </div>
                }
                <Dropdown overlay={menu}>
                    <a>
                        {this.props.username}
                    </a>
                </Dropdown>
            </div>
        )
    }
}
