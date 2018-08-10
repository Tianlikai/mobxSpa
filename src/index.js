import Component from './components/Component'
import {Provider} from 'mobx-react'
import './libs/G.js'

import Home from './pages/Home'
import SignIn from './pages/SignIn'
import stores from './stores/index'

import './styles.scss'

const {HashRouter: Router, Route, Switch} = ReactRouterDOM

class Entry extends Component {
    render() {
        return (
            <Provider {...stores}>
                <Router>
                    <Switch>
                        <Route exact path='/signin' component={SignIn} />
                        <Route path='/' component={Home} />
                    </Switch>
                </Router>
            </Provider>
        )
    }
}

ReactDOM.render(<Entry />, document.querySelector('#root'))
