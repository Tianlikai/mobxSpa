import Component from '../../components/Component'
import {Form, Input, Button, Table, Select, DatePicker} from 'antd'
import * as mobx from 'mobx'
import {observer, inject} from 'mobx-react'
import moment from 'moment'
import {createForm} from '../../libs/antdUtils'
import {ORD_LOG_STATE} from '../../config'

const FormItem = Form.Item
const Option = Select.Option
const Search = Input.Search

@createForm()
class SearchForm extends Component {
    onSubmit(v) {
        console.log('submit', v)
        const params = v
        params.startTime = params.startTime && params.startTime.format()
        params.endTime = params.endTime && params.endTime.format()
        this.props.onSubmit(params)
    }

    render() {
        const {getFieldDecorator, resetFields} = this.props.form
        const initialType = +this.props.initialValue.type
        const searchStyle = {width: 185}
        return (
            <div className='search'>
                <Form layout='inline' onSubmit={this.onSubmit}>
                    <FormItem label='操作类型'>
                        {getFieldDecorator('type', {
                            initialValue: initialType || '0'
                        })(
                            <Select>
                                {Object.keys(ORD_LOG_STATE).map(key => <Option key={key} value={key}>{ORD_LOG_STATE[key]}</Option>)}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('name', {
                            initialValue: this.props.initialValue.name || ''
                        })(
                            <Search style={searchStyle} placeholder='搜索机构名称、操作人' />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('startTime')(
                            <DatePicker showTime format='YYYY-MM-DD HH:mm:ss' placeholder='开始时间' />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('endTime')(
                            <DatePicker showTime format='YYYY-MM-DD HH:mm:ss' placeholder='结束时间' />
                        )}
                    </FormItem>
                    <FormItem>
                        <Button htmlType='submit' type='primary'>搜索</Button>
                    </FormItem>
                    <FormItem>
                        <Button type='primary' htmlType='reset' onClick={() => {
                            this.props.onReset()
                            resetFields()
                        }}>重置</Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

@inject('OrdersStore')
@observer
class Logs extends Component {
    constructor(props) {
        super(props)
        this.state = {
            query: {},
            pageNo: 1
        }
    }
    componentDidMount() {
        const query = G.getQuery()
        this.props.OrdersStore.getOrderLog(query)
    }
    get columns() {
        return [{
            title: '订单号',
            dataIndex: 'orderId',
            key: 'orderId'
        }, {
            title: '操作类型',
            dataIndex: 'operationType',
            key: 'operationType'
        }, {
            title: '机构名称',
            dataIndex: 'orgName',
            key: 'orgName'
        }, {
            title: '操作描述',
            dataIndex: 'operationDescription',
            key: 'operationDescription'
        }, {
            title: '操作人',
            dataIndex: 'userName',
            key: 'userName'
        }, {
            title: '操作时间',
            dataIndex: 'operateDate',
            key: 'operateDate'
        }]
    }

    loadOrderLog(params) {
        let {startTime, endTime} = params
        params.startTime = !startTime ? undefined : moment(startTime).format('YYYY-MM-DD HH:mm:ss')
        params.endTime = !endTime ? undefined : moment(endTime).format('YYYY-MM-DD HH:mm:ss')
        params.type = params.type === '0' ? undefined : params.type
        params.name = params.name ? params.name.replace(/^(\s|\u00A0)+/, '').replace(/(\s|\u00A0)+$/, '') : undefined
        this.props.OrdersStore.getOrderLog(params)
    }
    onSubmit(value) {
        this.setState({query: value, pageNo: 1})
        this.loadOrderLog(value)
    }
    onReset() {
        const params = {}
        this.setState({query: params, pageNo: 1})
        this.loadOrderLog(params)
    }
    handleChange(value) {
        const query = this.state.query
        const params = Object.assign(query, {pageNo: value.current})
        this.setState({pageNo: value.current})
        this.loadOrderLog(params)
    }
    render() {
        const {orderLog, orderLogTotal, listLoading} = this.props.OrdersStore
        const dataSource = mobx.toJS(orderLog)
        const pagination = {
            total: orderLogTotal,
            current: this.state.pageNo,
            showTotal: () => `共 ${orderLogTotal} 条`
        }
        const initialValue = G.getQuery()
        return (
            <div className='list'>
                <SearchForm onReset={this.onReset} onSubmit={this.onSubmit} initialValue={initialValue} />
                <Table dataSource={dataSource} bordered columns={this.columns} onChange={this.handleChange} pagination={pagination} loading={listLoading} locale={{emptyText: '暂无数据'}} />
            </div>
        )
    }
}

export default Form.create()(Logs)
