import Component from '../components/Component'

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
                        <div className='subTitle'>
                            {config[0] || '-'} / <span>{config[1] || '-'}</span>
                        </div>
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
