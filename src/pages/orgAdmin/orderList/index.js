import Component from 'components/Component'
import * as mobx from 'mobx'
import moment from 'moment'
import { observer, inject } from 'mobx-react'
import { Form, Input, Button, Table, Modal, Select, DatePicker } from 'antd'
import { createForm } from 'libs/antdUtils'
import Storage from 'libs/storage'
import { DEFAULT_FORM_OPTION, DEFAULT_OPTION } from '../../../settings/consts'
import './orderList.scss'

const FormItem = Form.Item
const Option = Select.Option
const Search = Input.Search
const { RangePicker } = DatePicker
const { TextArea } = Input

@createForm()
class SearchForm extends Component {
    onSubmit(v) {
        this.props.onSubmit && this.props.onSubmit(v)
    }
    disabledDate = current => {
        return current && current > moment()
    }
    render() {
        const { getFieldDecorator, resetFields } = this.props.form
        const searchStyle = { width: 185 }
        let { state, startTime, endTime, name } = this.props.initialValue || {
            name: undefined,
            state: '',
            startTime: undefined,
            endTime: undefined
        }
        startTime = startTime ? moment(startTime, 'YYYY-MM-DD') : undefined
        endTime = endTime ? moment(endTime, 'YYYY-MM-DD') : undefined
        return (
            <div className='search'>
                <Form layout='inline' onSubmit={this.onSubmit}>
                    <FormItem>
                        {getFieldDecorator('type', {
                            initialValue: state || 0
                        })(
                            <Select>
                                {DEFAULT_FORM_OPTION.map(option => (
                                    <Option
                                        key={option.key}
                                        value={option.value}
                                    >
                                        {option.text}
                                    </Option>
                                ))}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('timeLimit', {
                            initialValue: [startTime, endTime]
                        })(
                            <RangePicker
                                disabledDate={this.disabledDate}
                                format='YYYY-MM-DD'
                                placeholder={['开始时间', '结束时间']}
                            />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('queryCond', {
                            initialValue: name
                        })(
                            <Search
                                style={searchStyle}
                                placeholder='搜索订单号、机构名称'
                            />
                        )}
                    </FormItem>
                    <FormItem>
                        <Button htmlType='submit' type='primary'>
                            搜索
                        </Button>
                    </FormItem>
                    <FormItem>
                        <Button
                            type='primary'
                            htmlType='reset'
                            onClick={() => {
                                this.props.onReset()
                                resetFields()
                            }}
                        >
                            重置
                        </Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

@createForm()
class ModalForm extends Component {
    onSubmit(v) {
        this.props.onSubmit && this.props.onSubmit(v)
    }
    onClose = () => {
        this.props.onClose && this.props.onClose()
    }
    render() {
        const { getFieldDecorator } = this.props.form
        const styleFormItem = { marginBottom: 0 }
        const styleText = { width: '90%' }
        let modalProps = {
            title: '',
            visible: this.props.visible,
            onOk: this.onSubmit,
            onCancel: this.onClose,
            cancelText: '取消',
            okText: '确认'
        }
        let initialNote = this.props.initialNote
        return (
            <div>
                <Modal {...modalProps}>
                    <h3>{this.props.title}</h3>
                    <div className='confirm-order'>
                        {this.props.confirmText}
                    </div>
                    <div className='confirm-note'>{this.props.note}</div>
                    <Form>
                        <FormItem style={styleFormItem}>
                            {getFieldDecorator('confirmNote', {
                                initialValue: initialNote
                            })(<TextArea style={styleText} rows={4} />)}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }
}

@inject('OrdersStore')
@observer
class OrderList extends Component {
    constructor(props) {
        let permissionList = Storage.get('permissionList') || []
        super(props)
        this.state = {
            visibleModal: '',
            selectOrdId: null,
            selectOrgId: null,
            state: 1,
            pageNo: 1,
            query: {},
            note: '',
            hadConfirmPayment: permissionList.indexOf(60001) >= 0 || false, // 支付权限
            hadCancelOrder: permissionList.indexOf(60002) >= 0 || false // 取消订单权限
        }
    }
    componentDidMount() {
        let returnParams = G.getReturnParams('returnParams')
        let query = {}
        let pageNo = this.state.pageNo
        if (!returnParams || !returnParams.effective) {
            this.props.OrdersStore.getOrderList({})
        } else {
            query = returnParams.query
            pageNo = returnParams.pageNo
            let copyQuery = Object.assign({}, query, { pageNo: pageNo })
            this.props.OrdersStore.getOrderList(copyQuery)
        }
        G.delReturnParams('returnParams')
        this.setState({
            query: query,
            pageNo: pageNo
        })
    }
    get columns() {
        return [
            {
                title: '订单号',
                dataIndex: 'orderId',
                key: 'orderId'
            },
            {
                title: '创建时间',
                dataIndex: 'createTime',
                key: 'createTime'
            },
            {
                title: '支付时间',
                dataIndex: 'payTime',
                key: 'payTime'
            },
            {
                title: '机构名称',
                dataIndex: 'orgName',
                key: 'orgName'
            },
            {
                title: '手机号',
                dataIndex: 'mobile',
                key: 'mobile'
            },
            {
                title: '支付金额',
                dataIndex: 'payMoney',
                key: 'payMoney'
            },
            {
                title: '支付状态',
                dataIndex: 'state',
                key: 'state',
                render: (i, record) => <span>{DEFAULT_OPTION[i].text}</span>
            },
            {
                title: '备注',
                dataIndex: 'note',
                key: 'note',
                render: (text, record) => {
                    const style = {
                        width: '100%',
                        height: 30,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }
                    return (
                        <div style={style} title={text}>
                            {text}
                        </div>
                    )
                }
            },
            {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                render: (text, record) => (
                    <div>
                        <Button
                            type='primary'
                            size='small'
                            onClick={() => this.goToOrderDetail(text, record)}
                        >
                            查看详情
                        </Button>
                        {record.state === 2
                            && this.state.hadCancelOrder && (
                            <Button
                                type='primary'
                                size='small'
                                onClick={this.showDeleteOrderModal.bind(
                                    null,
                                    record
                                )}
                            >
                                    取消订单
                            </Button>
                        )}
                        {record.state === 2
                            && this.state.hadConfirmPayment && (
                            <Button
                                type='primary'
                                size='small'
                                onClick={this.showConfirmPaymentModal.bind(
                                    null,
                                    record
                                )}
                            >
                                    确认收款
                            </Button>
                        )}
                    </div>
                )
            }
        ]
    }
    goToOrderDetail(text, record) {
        G.setReturnParams('returnParams', {
            pageNo: this.state.pageNo,
            query: this.state.query
        })
        G.history.push({
            pathname: `/orgAdmin/orderDetail/${record.orderId}`
        })
    }
    showDeleteOrderModal = record => {
        this.setState({
            visibleModal: 'deleteOrderModal',
            selectOrdId: record.orderId,
            selectOrgId: record.orgId,
            note: record.note
        })
    }
    showConfirmPaymentModal = record => {
        this.setState({
            visibleModal: 'confirmPaymentModal',
            selectOrdId: record.orderId,
            selectOrgId: record.orgId,
            note: record.note
        })
    }
    handleCloseModal = () => {
        this.setState({
            visibleModal: '',
            selectOrdId: null,
            selectOrgId: null,
            state: null,
            note: ''
        })
    }
    loadOrganizationList(params) {
        this.props.OrdersStore.getOrderList(params)
    }
    handleOrderConfirm = params => {
        let { selectOrdId, selectOrgId, query } = this.state
        this.props.OrdersStore.updateOrderState(
            selectOrdId,
            selectOrgId,
            3,
            params.confirmNote || '',
            query,
            this.handleCloseModal.bind(this)
        )
    }
    handlePaymentConfirm = params => {
        let { selectOrdId, selectOrgId, query } = this.state
        this.props.OrdersStore.updateOrderState(
            selectOrdId,
            selectOrgId,
            1,
            params.confirmNote || '',
            query,
            this.handleCloseModal.bind(this)
        )
    }
    onReset() {
        const params = {}
        this.setState({
            query: params,
            pageNo: 1
        })
        this.loadOrganizationList(params)
    }
    handleChange(value) {
        const query = this.state.query
        this.setState({
            pageNo: value.current
        })
        const params = Object.assign(query, {
            pageNo: value.current
        })
        this.loadOrganizationList(params)
    }
    onSubmit(value) {
        let { timeLimit, type: state, queryCond: name } = value

        let startTime
            = timeLimit && timeLimit[0] && timeLimit[0].format().substr(0, 10)

        let endTime
            = timeLimit && timeLimit[1] && timeLimit[1].format().substr(0, 10)

        if (state === 0) {
            state = ''
        }

        name = name
            ? name.replace(/^(\s|\u00A0)+/, '').replace(/(\s|\u00A0)+$/, '')
            : undefined
        const params = {
            state,
            startTime,
            endTime,
            name: name
        }
        this.setState({
            query: params,
            pageNo: 1
        })
        this.loadOrganizationList(params)
    }
    render() {
        const {
            orderList,
            orderListTotal,
            listLoading
        } = this.props.OrdersStore
        const dataSource = mobx.toJS(orderList)
        const pagination = {
            total: orderListTotal,
            current: this.state.pageNo,
            showTotal: () => `共 ${orderListTotal} 条`
        }
        const initialValue = this.state.query
        let tableProps = {
            dataSource: dataSource,
            bordered: true,
            columns: this.columns,
            onChange: this.handleChange,
            pagination: pagination,
            loading: listLoading,
            locale: { emptyText: '暂无数据' }
        }
        return (
            <div className='list'>
                <SearchForm
                    onSubmit={this.onSubmit}
                    onReset={this.onReset}
                    initialValue={initialValue}
                />
                <Table {...tableProps} />
                <ModalForm
                    key={'modalOrder' + this.state.selectOrdId}
                    visible={this.state.visibleModal === 'deleteOrderModal'}
                    onSubmit={this.handleOrderConfirm}
                    onClose={this.handleCloseModal}
                    title='取消订单'
                    confirmText='确认取消该订单?'
                    note='备注'
                    initialNote={this.state.note}
                />
                <ModalForm
                    key={'modalPayment' + this.state.selectOrdId}
                    visible={this.state.visibleModal === 'confirmPaymentModal'}
                    onSubmit={this.handlePaymentConfirm}
                    onClose={this.handleCloseModal}
                    title='确认收款'
                    confirmText='确认该订单已收款?'
                    note='备注'
                    initialNote={this.state.note}
                />
            </div>
        )
    }
}

export default OrderList
