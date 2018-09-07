import Component from '../components/Component'
import Breadcrumb from '../components/breadcrumb'

const Container = config => WrappedComponent =>
    class extends Component {
        render() {
            const footer = {
                color: 'gray',
                fontSize: 18
            }
            return (
                <div className='container'>
                    <div className='content'>
                        <Breadcrumb config={config} />
                        <WrappedComponent {...this.props} />
                    </div>
                    <div className='footer' style={footer}>
                        power to go!
                    </div>
                </div>
            )
        }
    }

export default Container
