import { inject, observer } from 'mobx-react'
import Component from 'components/Component'
import Storage from 'libs/storage'

import SideMenu from '../layouts/SideMenu'
import Header from '../layouts/Header'

import { ROUTE_HOME } from '../settings/routeAndPermissions'
import './styles/home.scss'

const { Route, Switch, Redirect } = ReactRouterDOM

@inject('UserInfoStore')
@observer
export default class Home extends Component {
    componentDidMount() {
        // 验证token
        const token = Storage.get('token')
        const expiresDate = Storage.get('expires_date')
        const username = Storage.get('username')
        if (!token || (expiresDate && Date.now() > expiresDate)) {
            G.history.replace('/signin')
        } else {
            G.setUpUser({ token })
            this.props.UserInfoStore.setUserInfo({ name: username })
            this.props.UserInfoStore.getArea()
        }
    }

    logOut() {
        this.props.UserInfoStore.logOut()
    }

    render() {
        return (
            <div className='home'>
                <SideMenu selectedKeys={this.props.location.pathname} />
                <Header
                    UserInfoStore={this.props.UserInfoStore}
                    logOut={this.logOut}
                    currentAddress={this.props.location.pathname}
                />
                <Switch>
                    {/* ROUTE_HOME为改模块下的子路由数组对象*/}
                    {ROUTE_HOME.map(route => {
                        // route 是一个自定义对象
                        // route.PERMISSIONS该子路由所具有的所有权限
                        // route.path该子路由的 url
                        // route.component该路由下的组件模块
                        // G.checkPermission 权限验证方法
                        if (G.checkPermission(route.PERMISSIONS)) {
                            return (
                                <Route
                                    exact={route.exact}
                                    path={`${this.props.match.url}${
                                        route.path
                                    }`}
                                    component={route.component}
                                />
                            )
                        }
                    })}
                    <Redirect exact from='/' to='/myAgent/myPromotion' />
                </Switch>
            </div>
        )
    }
}
