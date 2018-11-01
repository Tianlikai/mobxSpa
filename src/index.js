import Component from './components/Component'
import { Provider } from 'mobx-react'
// 引入全局函数
import './libs/G.js'

// 单页面应用主文件
import Home from './routes/home/Home'
// 登陆页面
import SignIn from './routes/signIn/SignIn'
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
                        <Route
                            exact
                            path='/signIn'
                            render={props => <SignIn {...props} />}
                        />
                        <Route path='/' render={props => <Home {...props} />} />
                    </Switch>
                </Router>
            </Provider>
        )
    }
}

ReactDOM.render(<Entry />, document.querySelector('#root'))
