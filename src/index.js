import Component from './components/Component'
import { Provider } from 'mobx-react'
// 引入全局函数
import './libs/G.js'

// 单页面应用主文件
import Home from './pages/home/Home'
// 登陆页面
import SignIn from './pages/signIn/SignIn'
// mobx store
import stores from './stores/index'

import './styles.scss'

// 路由控件
const { HashRouter: Router, Route, Switch } = ReactRouterDOM

class Entry extends Component {
    render() {
        return (
            <Provider {...stores}>
                <Router>
                    <Switch>
                        <Route exact path='/signIn' component={SignIn} />
                        <Route path='/' component={Home} />
                    </Switch>
                </Router>
            </Provider>
        )
    }
}

ReactDOM.render(<Entry />, document.querySelector('#root'))
