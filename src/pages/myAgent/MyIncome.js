import Component from '../../components/Component'
import * as mobx from 'mobx'
import {observer, inject} from 'mobx-react'
import {Table} from 'antd'
import './styles/myIncome.scss'

export const ModuleLine = (props) => <div className='contentTitle'>{props.title}{props.children}</div>

const IncomeBox = (props) => {
    return (
        <span className='myIncome-value-box'>
            <div>{props.title}</div>
            <h4>{props.value}</h4>
            {/* <div className='myIncome-type'>1</div> */}
        </span>
    )
}

@inject('IncomeStore')
@observer
class MyIncome extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pageNo: 1
        }
    }
    componentDidMount() {
        this.props.IncomeStore.getMyProfit({pageNo: this.state.pageNo})
    }
    get columns() {
        return [{
            title: '账号',
            dataIndex: 'mobile',
            key: 'mobile'
        }, {
            title: '付款时间',
            dataIndex: 'payTime',
            key: 'payTime'
        }, {
            title: '购买内容',
            dataIndex: 'courseName',
            key: 'courseName'
        }, {
            title: '所属版本',
            dataIndex: 'pressName',
            key: 'pressName'
        }, {
            title: '所属年级',
            dataIndex: 'grade',
            key: 'grade'
        }, {
            title: '订单金额',
            dataIndex: 'payMoney',
            key: 'payMoney'
        }, {
            title: '我的收益',
            dataIndex: 'share',
            key: 'share'
        }]
    }
    loadOrganizationList(params) {
        this.props.IncomeStore.getMyProfit(params)
    }
    handleChange(value) {
        this.setState({pageNo: value.current})
        const params = Object.assign({}, {pageNo: value.current})
        this.loadOrganizationList(params)
    }
    render() {
        const {incomeList, incomeTotal, listLoading, noSettle, settled, settling, totalShare} = this.props.IncomeStore
        const dataSource = mobx.toJS(incomeList)
        const pagination = {
            total: incomeTotal,
            current: this.state.pageNo,
            showTotal: () => `共 ${incomeTotal} 条`
        }
        let tableProps = {
            dataSource: dataSource,
            columns: this.columns,
            onChange: this.handleChange,
            pagination: pagination,
            loading: listLoading,
            locale: {emptyText: '暂无数据'}
        }
        return (
            <div className='myIncome'>
                <ModuleLine title={'我的分成'} />
                <div className='myIncome-value'>
                    <IncomeBox title={totalShare.title} value={totalShare.value} />
                    <IncomeBox title={settled.title} value={settled.value} />
                    <IncomeBox title={noSettle.title} value={noSettle.value} />
                    <IncomeBox title={settling.title} value={settling.value} />
                </div>
                <ModuleLine title={'收益来源'} />
                <Table {...tableProps} />
            </div>
        )
    }
}

export default MyIncome
