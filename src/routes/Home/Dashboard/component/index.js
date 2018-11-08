import Component from 'components/Component'
import { Helmet } from 'react-helmet'

export default class Dashboard extends Component {
    render() {
        const style = {
            textAlign: 'center',
            fontSize: 30,
            marginTop: 60
        }
        return (
            <div style={style}>
                <Helmet>
                    <title>仪表盘 - SPA</title>
                    <meta name='description' content='SPA' />
                </Helmet>
                欢迎来到SPA系统
            </div>
        )
    }
}
