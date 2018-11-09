import Component from 'components/Component'

import * as mobx from 'mobx'
import { Helmet } from 'react-helmet'
import { observer, inject } from 'mobx-react'

import SearchForm from './SearchForm'
import ModuleLine from 'components/ModuleLine'
import { WithBreadcrumb } from 'components/Breadcrumb'
import ProModal from 'components/MyPromotionShareModal/ProModal'

import { Button, Table } from 'antd'

import './style.scss'

@inject('TableSearch')
@observer
class MyPromotion extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visibleModal: false,
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
            this.props.TableSearch.getPromotionList({})
        } else {
            query = returnParams.query
            pageNo = returnParams.pageNo
            let copyQuery = Object.assign({}, query, { pageNo: pageNo })
            this.props.TableSearch.getPromotionList(copyQuery)
        }
        G.delReturnParams('returnParams')
        this.setState({ query: query, pageNo: pageNo })
    }
    get columns() {
        return [
            {
                title: '创建时间',
                dataIndex: 'createdAt',
                key: 'createdAt'
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
        G.history.push({ pathname: '/form/baseForm' })
    }
    redirectToDetail = record => {
        G.setReturnParams('returnParams', {
            pageNo: this.state.pageNo,
            query: this.state.query
        })
        G.history.push({ pathname: `/detail/baseDetail/${record.id}` })
    }
    handleOpenShareModal = record => {
        this.setState({
            visibleModal: true,
            record
        })
        this.props.TableSearch.getWeiCode({ promotionId: record.id, record })
    }
    handleCloseShareModal = () => {
        this.setState(
            {
                visibleModal: false,
                record: {}
            },
            () => this.props.TableSearch.delWeiCode()
        )
    }
    onReset(cb) {
        const params = {}
        this.setState({ query: params, pageNo: 1 }, () => cb && cb())
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
        this.props.TableSearch.getPromotionList(params)
    }
    render() {
        const { pageNo, query, record, visibleModal } = this.state
        const { routerData, TableSearch } = this.props
        const { config } = routerData

        const { table: tableData, chooseImgByte } = TableSearch
        const { list, count, loading } = tableData
        const dataSource = mobx.toJS(list)
        const emptyText = { emptyText: '暂无数据' }
        const pagination = {
            total: count,
            current: pageNo,
            showTotal: () => `共 ${count} 条`
        }
        const tableProps = {
            bordered: true,
            dataSource: dataSource,
            columns: this.columns,
            onChange: this.handleChange,
            pagination: pagination,
            loading: loading,
            locale: emptyText
        }

        const titleValue = [
            '本次推广专属小程序二维码',
            '本次推广专属小程序链接'
        ]
        return (
            <WithBreadcrumb config={config}>
                <Helmet>
                    <title>查询表格 - SPA</title>
                    <meta name='description' content='SPA' />
                </Helmet>
                <div className='list'>
                    <ModuleLine title='查询表格'>
                        <Button
                            onClick={this.redirectToCreatePromotion}
                            className='promotionBtn'
                            type='primary'
                            size='middle'
                        >
                            新增
                        </Button>
                    </ModuleLine>
                    <SearchForm
                        onReset={this.onReset}
                        onSubmit={this.onSubmit}
                        initialValue={query}
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
