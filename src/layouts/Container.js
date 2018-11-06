import Component from 'components/Component'

const { Switch } = ReactRouterDOM

export default class Container extends Component {
    render() {
        const { routerData } = this.props
        const { childRoutes } = routerData
        return (
            <div className='container'>
                <Switch>{childRoutes}</Switch>
            </div>
        )
    }
}
