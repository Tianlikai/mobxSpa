import Component from './components/Component'
import { Provider } from 'mobx-react'

// 引入全局函数
import './libs/G.js'
// store
import stores from './stores/index'

import createRoutes from './routes'

import './styles.scss'

// 路由控件
const { HashRouter: Router } = ReactRouterDOM

class Entry extends Component {
    render() {
        return (
            <Provider {...stores}>
                <Router>{createRoutes()}</Router>
            </Provider>
        )
    }
}

ReactDOM.render(<Entry />, document.querySelector('#root'))
