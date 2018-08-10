import Component from '../../components/Component'
import {ModuleLine} from './MyIncome'
import './styles/myInformation.scss'

class InfoContainer extends Component {
    render() {
        return (
            <div>
                {this.props.data && Object.keys(this.props.data).map(key => {
                    const info = this.props.data[key]
                    return (
                        <div className='orderDetail-item'>
                            <span className='myInfo-item-label'>{info.label}</span>
                            <span className='ant-form-text'>{info.value}</span>
                        </div>
                    )
                })}
            </div>
        )
    }
}
class MyInformation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {
                agentNumber: {
                    label: '账号:',
                    value: '-'
                },
                profitShare: {
                    label: '分成比例:',
                    value: '-'
                },
                agentName: {
                    label: '代理姓名:',
                    value: '-'
                },
                receivablesType: {
                    label: '收款方式:',
                    value: '-'
                },
                receivables: {
                    label: '收款账号:',
                    value: '-'
                },
                companyName: {
                    label: '公司名称:',
                    value: '-'
                }
            }
        }
    }
    componentDidMount() {
        G.api.getAgentInformation().then(data => {
            let DATA = Object.assign(this.state.data)
            Object.keys(DATA).forEach(key => {
                DATA[key].value = data[key]
            })
            console.log(DATA)
            this.setState({data: DATA})
        })
    }
    render() {
        return (
            <div className='myInfo-container'>
                <ModuleLine title={'我的信息'} />
                <InfoContainer data={this.state.data} />
            </div>
        )
    }
}

export default MyInformation
