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
                <div className='menu'>
                    <SideMenu selectedKeys={this.props.location.pathname} />
                </div>
                <Header
                    username={this.props.UserInfoStore.username}
                    logOut={this.logOut}
                    currentAddress={this.props.location.pathname}
                />
                <Switch>
                    {ROUTE_HOME.map(route => {
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
