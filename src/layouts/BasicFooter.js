import Component from 'components/Component'

export default class BasicFooter extends Component {
    render() {
        const styDiv = {
            textAlign: 'center',
            height: 100,
            marginTop: 20
        }
        const { className } = this.props
        return (
            <div className={className} style={styDiv}>
                Project maintenance <br />
                by jason
            </div>
        )
    }
}
