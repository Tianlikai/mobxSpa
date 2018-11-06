import { inject, observer } from 'mobx-react'
import Component from 'components/Component'
import Storage from 'libs/storage'

import Layout from './Layout'
import BasicFooter from './BasicFooter'

import SideMenu from '../components/LeftSideMenu'
import Header from '../components/HeaderOfHome'

import './styles/BasicLayout.scss'

const { Switch } = ReactRouterDOM
const LayoutSide = Layout.LayoutSide

@inject('UserInfoStore')
@observer
export default class Home extends Component {
    componentDidMount() {
        const token = Storage.get('token')
        const username = Storage.get('username')
        if (!token) {
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
        const { routerData } = this.props
        const { childRoutes } = routerData

        const style = { flexDirection: 'row' }
        return (
            <Layout style={style} className='home'>
                <LayoutSide className='menu'>
                    <SideMenu selectedKeys={this.props.location.pathname} />
                </LayoutSide>
                <Layout>
                    <Header
                        logOut={this.logOut}
                        currentAddress={this.props.location.pathname}
                        username={Storage.get('username')}
                    />
                    <Switch>{childRoutes}</Switch>
                    <BasicFooter />
                </Layout>
            </Layout>
        )
    }
}
