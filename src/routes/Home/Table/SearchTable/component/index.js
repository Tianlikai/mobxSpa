import Component from 'components/Component'
import { WithBreadcrumb } from 'components/Breadcrumb'

import * as mobx from 'mobx'
import moment from 'moment'
import { observer, inject } from 'mobx-react'

import { Form, Input, Button, Table, DatePicker, Select } from 'antd'

import { createForm } from 'libs/antdUtils'

import ProModal from 'components/MyPromotionShareModal/ProModal'
import ModuleLine from 'components/ModuleLine'

import { GRADE } from 'settings/consts'

import './style.scss'

const FormItem = Form.Item
const Search = Input.Search
const { RangePicker } = DatePicker
const Option = Select.Option

@createForm()
class SearchForm extends Component {
    onSubmit(v) {
        this.props.onSubmit && this.props.onSubmit(v)
    }
    render() {
        const { getFieldDecorator, resetFields } = this.props.form
        const searchStyle = { width: 220 }
        let { startTime, endTime, name, grade } = this.props.initialValue || {
            name: undefined,
            startTime: undefined,
            endTime: undefined,
            grade: undefined
        }
        startTime = startTime
            ? moment(startTime, 'YYYY-MM-DD HH:MM:SS')
            : undefined
        endTime = endTime ? moment(endTime, 'YYYY-MM-DD HH:MM:SS') : undefined
        return (
            <div className='search'>
                <Form layout='inline' onSubmit={this.onSubmit}>
                    <FormItem label='年级'>
                        {getFieldDecorator('grade', {
                            initialValue: grade || ''
                        })(
                            <Select>
                                {GRADE.map(grade => (
                                    <Option key={grade.key} value={grade.value}>
                                        {grade.text}
                                    </Option>
                                ))}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label='时间范围'>
                        {getFieldDecorator('timeLimit', {
                            initialValue: [startTime, endTime]
                        })(
                            <RangePicker
                                format='YYYY-MM-DD HH:MM:SS'
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
                                placeholder='请输入学校，班级'
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

@inject('PromotionStore')
@observer
class MyPromotion extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visibleModal: false,
            address: '',
            pageNo: 1,
            query: {},
            record: {}
        }
    }
    componentDidMount() {
        let returnParams = G.getReturnParams('returnParams')
        let query = {}
        let pageNo = this.state.pageNo
        if (!returnParams || !returnParams.effective) {
            this.props.PromotionStore.getPromotionList({})
        } else {
            query = returnParams.query
            pageNo = returnParams.pageNo
            let copyQuery = Object.assign({}, query, { pageNo: pageNo })
            this.props.PromotionStore.getPromotionList(copyQuery)
        }
        G.delReturnParams('returnParams')
        this.setState({ query: query, pageNo: pageNo })
    }
    get columns() {
        return [
            {
                title: '创建时间',
                dataIndex: 'createdAt',
                key: 'createdAt',
                width: 180
            },
            {
                title: '地区',
                dataIndex: 'address',
                key: 'address'
            },
            {
                title: '学校',
                dataIndex: 'school',
                key: 'school'
            },
            {
                title: '年级',
                dataIndex: 'grade',
                key: 'grade'
            },
            {
                title: '班级',
                dataIndex: 'className',
                key: 'className'
            },
            {
                title: '用户数',
                dataIndex: 'registerNumber',
                key: 'registerNumber'
            },
            {
                title: '订单金额',
                dataIndex: 'totalPayMoney',
                key: 'totalPayMoney'
            },
            {
                title: '我的收益',
                dataIndex: 'totalShare',
                key: 'totalShare'
            },
            {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                width: 155,
                render: (text, record) => {
                    const shareStyle = {
                        width: 70,
                        color: '#1574D4',
                        marginRight: 5,
                        cursor: 'pointer'
                    }
                    const detailStyle = {
                        width: 70,
                        color: '#1574D4',
                        marginLeft: 5,
                        cursor: 'pointer'
                    }
                    return (
                        <div className='operations-orgGo'>
                            <span
                                style={shareStyle}
                                onClick={() =>
                                    this.handleOpenShareModal(record)
                                }
                            >
                                立即分享
                            </span>
                            <span
                                style={detailStyle}
                                onClick={() => this.redirectToDetail(record)}
                            >
                                查看详情
                            </span>
                        </div>
                    )
                }
            }
        ]
    }
    redirectToCreatePromotion = () => {
        G.setReturnParams('returnParams', {
            pageNo: this.state.pageNo,
            query: this.state.query
        })
        G.history.push({ pathname: '/myAgent/createPromotion' })
    }
    redirectToDetail = record => {
        G.setReturnParams('returnParams', {
            pageNo: this.state.pageNo,
            query: this.state.query
        })
        G.history.push({ pathname: `/myAgent/promotionDetail/${record.id}` })
    }
    handleOpenShareModal = record => {
        this.setState({
            visibleModal: true,
            record
        })
        this.props.PromotionStore.getWeiCode({ promotionId: record.id, record })
    }
    handleCloseShareModal = () => {
        this.setState(
            {
                visibleModal: false,
                record: {}
            },
            () => this.props.PromotionStore.delWeiCode()
        )
    }
    onReset() {
        const params = {}
        this.setState({ query: params, pageNo: 1 })
        this.loadOrganizationList(params)
    }
    handleChange(value) {
        const query = this.state.query
        this.setState({ pageNo: value.current })
        const params = Object.assign(query, { pageNo: value.current })
        this.loadOrganizationList(params)
    }
    onSubmit(value) {
        let { timeLimit, queryCond: name, grade } = value
        let startTime
            = timeLimit
            && timeLimit[0]
            && timeLimit[0].format('YYYY-MM-DD HH:mm:ss')
        let endTime
            = timeLimit
            && timeLimit[1]
            && timeLimit[1].format('YYYY-MM-DD HH:mm:ss')
        name = name
            ? name.replace(/^(\s|\u00A0)+/, '').replace(/(\s|\u00A0)+$/, '')
            : undefined
        const params = { startTime, endTime, name, grade: grade || undefined }
        this.setState({ query: params, pageNo: 1 })
        this.loadOrganizationList(params)
    }
    loadOrganizationList(params) {
        this.props.PromotionStore.getPromotionList(params)
    }
    render() {
        const { pageNo, query, record, visibleModal } = this.state
        const { routerData, PromotionStore } = this.props
        const { config } = routerData

        const {
            promotionList,
            promotionListotal,
            listLoading,
            chooseImgByte
        } = PromotionStore
        const dataSource = mobx.toJS(promotionList)
        const pagination = {
            total: promotionListotal,
            current: pageNo,
            showTotal: () => `共 ${promotionListotal} 条`
        }
        const titleValue = [
            '本次推广专属小程序二维码',
            '本次推广专属小程序链接'
        ]
        const initialValue = query
        let tableProps = {
            dataSource: dataSource,
            columns: this.columns,
            onChange: this.handleChange,
            pagination: pagination,
            loading: listLoading,
            locale: { emptyText: '暂无数据' }
        }
        return (
            <WithBreadcrumb config={config}>
                <div className='list'>
                    <ModuleLine title='我的推广'>
                        <Button
                            onClick={this.redirectToCreatePromotion}
                            className='promotionBtn'
                            type='primary'
                            size='middle'
                        >
                            新增推广
                        </Button>
                    </ModuleLine>
                    <SearchForm
                        onSubmit={this.onSubmit}
                        onReset={this.onReset}
                        initialValue={initialValue}
                    />
                    <Table {...tableProps} />
                    <ProModal
                        imgByte={chooseImgByte}
                        width={600}
                        showTitle={false}
                        titleDownImg='保存'
                        record={record}
                        recordType='string'
                        visible={visibleModal}
                        handleClose={this.handleCloseShareModal}
                        titleValue={titleValue}
                    />
                </div>
            </WithBreadcrumb>
        )
    }
}

export default MyPromotion
