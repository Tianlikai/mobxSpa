import Component from 'components/Component'
import { Form, Input, Button, Table, Modal, Select } from 'antd'
import { observer, inject } from 'mobx-react'
import * as mobx from 'mobx'
import { ORG_STATE } from '../../settings/consts'
import { createForm } from 'libs/antdUtils'

const FormItem = Form.Item
const Search = Input.Search
const Option = Select.Option

@createForm()
class SearchForm extends Component {
    onSubmit(v) {
        this.props.onSubmit(v)
    }
    render() {
        const { getFieldDecorator, resetFields } = this.props.form
        let initialValue = this.props.initialValue || {
            name: undefined,
            state: ''
        }
        let { name, state } = initialValue
        return (
            <div className='search'>
                <Form layout='inline' onSubmit={this.onSubmit}>
                    <FormItem>
                        {getFieldDecorator('type', {
                            initialValue: state || '0'
                        })(
                            <Select>
                                {Object.keys(ORG_STATE).map(key => (
                                    <Option key={key} value={key}>
                                        {ORG_STATE[key]}
                                    </Option>
                                ))}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('queryCond', {
                            initialValue: name
                        })(
                            <Search
                                style={{ width: 270 }}
                                placeholder='搜索机构编号、机构名称、手机号码'
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

@inject('OrganizationStore')
@observer
class PartnerList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            selectId: null,
            state: 1,
            pageNo: 1,
            query: {}
        }
    }
    componentDidMount() {
        const query = G.getQuery()
        this.props.OrganizationStore.getOrganizationList(query)
    }
    get columns() {
        return [
            {
                title: '机构编号',
                dataIndex: 'id',
                key: 'id'
            },
            {
                title: '机构名称',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: '手机号码',
                dataIndex: 'mobile',
                key: 'mobile'
            },
            {
                title: '创建人',
                dataIndex: 'createdBy',
                key: 'createdBy'
            },
            {
                title: '教师账号数',
                dataIndex: 'teacherNum',
                key: 'teacherNum'
            },
            {
                title: '学生账号数',
                dataIndex: 'studentNum',
                key: 'studentNum'
            },
            {
                title: '状态',
                dataIndex: 'countState',
                key: 'countState',
                render: (text, record) => (
                    <span>{ORG_STATE[record.countState]}</span>
                )
            },
            {
                title: '创建时间',
                dataIndex: 'createdAtFormat',
                key: 'createdAtFormat'
            },
            {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                render: (text, record) => {
                    return (
                        <div>
                            <Button
                                type='primary'
                                size='small'
                                onClick={() => this.goToEditPage(text, record)}
                            >
                                基本信息
                            </Button>
                            <Button
                                type='primary'
                                size='small'
                                onClick={() =>
                                    this.goToProductInfoPage(text, record)
                                }
                            >
                                产品信息
                            </Button>
                            <Button
                                type='primary'
                                size='small'
                                onClick={() => this.showModal(text, record)}
                            >
                                {record.state === 0 ? '禁用' : '启用'}
                            </Button>
                        </div>
                    )
                }
            }
        ]
    }

    goToEditPage(text, record) {
        const id = record.id
        G.history.push({ pathname: `/orgAdmin/orgList/${id}` })
    }
    goToProductInfoPage(text, record) {
        const id = record.id
        G.history.push({ pathname: `/orgAdmin/product/${id}` })
    }
    showModal(text, record) {
        console.log(record)
        this.setState({
            visible: true,
            selectId: record.id,
            state: record.state
        })
    }

    closeModal() {
        this.setState({
            visible: false,
            selectId: null,
            state: null
        })
    }

    toggleOrgState() {
        console.log(this.state)
        const id = this.state.selectId
        const state = this.state.state
        const newState = typeof state === 'number' ? 1 - state : 0
        console.log(id)
        this.props.OrganizationStore.disableOrg(
            id,
            newState,
            this.closeModal.bind(this)
        )
    }

    loadOrganizationList(params) {
        this.props.OrganizationStore.getOrganizationList(params)
        // G.history.push(`/admin/orgList${G.encodeQuery(params)}`)
    }

    onSubmit(value) {
        let { queryCond: name, type: state } = value
        name = name
            ? name.replace(/^(\s|\u00A0)+/, '').replace(/(\s|\u00A0)+$/, '')
            : undefined
        const params = { name: name, state: state !== '0' ? state : undefined }
        this.setState({ query: params, pageNo: 1 })
        this.loadOrganizationList(params)
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

    render() {
        const {
            organizationList,
            organizationListTotal,
            listLoading
        } = this.props.OrganizationStore
        const dataSource = mobx.toJS(organizationList)
        const pagination = {
            total: organizationListTotal,
            showTotal: () => `共 ${organizationListTotal} 条`
        }
        const initialValue = this.state.query
        return (
            <div className='list'>
                <SearchForm
                    onSubmit={this.onSubmit}
                    onReset={this.onReset}
                    initialValue={initialValue}
                />
                <Table
                    dataSource={dataSource}
                    bordered
                    columns={this.columns}
                    onChange={this.handleChange}
                    pagination={pagination}
                    loading={listLoading}
                    locale={{ emptyText: '暂无数据' }}
                />
                <Modal
                    title=''
                    visible={this.state.visible}
                    onOk={this.toggleOrgState}
                    onCancel={this.closeModal}
                    cancelText='取消'
                    okText='确认'
                >
                    <h3>
                        确认
                        {this.state.state === 0 ? '禁用' : '启用'}
                        该账号？
                    </h3>
                </Modal>
            </div>
        )
    }
}

export default PartnerList
