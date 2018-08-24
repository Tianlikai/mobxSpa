import Component from 'components/Component'
import { Form, Input, Button, Table, Select, DatePicker } from 'antd'
import { observer, inject } from 'mobx-react'
import * as mobx from 'mobx'

import { createForm } from 'libs/antdUtils'

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
        const { getFieldDecorator, resetFields } = this.props.form
        const initialType = +this.props.initialValue.type
        return (
            <div className='search'>
                <Form layout='inline' onSubmit={this.onSubmit}>
                    <FormItem label='操作类型'>
                        {getFieldDecorator('type', {
                            initialValue: initialType || 0
                        })(
                            <Select>
                                <Option value={0}>全部</Option>
                                <Option value={1}>创建</Option>
                                <Option value={2}>禁用</Option>
                                <Option value={3}>启用</Option>
                                <Option value={4}>编辑</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('name', {
                            initialValue: this.props.initialValue.name || ''
                        })(
                            <Search
                                style={{ width: 185 }}
                                placeholder='搜索机构名称、操作人'
                            />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('startTime', {})(
                            <DatePicker
                                showTime
                                format='YYYY-MM-DD HH:mm:ss'
                                placeholder='开始时间'
                            />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('endTime', {})(
                            <DatePicker
                                showTime
                                format='YYYY-MM-DD HH:mm:ss'
                                placeholder='结束时间'
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
        console.log({ query })
        this.props.OrganizationStore.getOrganizationLog(query)
    }
    get columns() {
        return [
            {
                title: '操作类型',
                dataIndex: 'operationType',
                key: 'operationType'
            },
            {
                title: '机构名称',
                dataIndex: 'orgName',
                key: 'orgName'
            },
            {
                title: '操作描述',
                dataIndex: 'operationDescription',
                key: 'operationDescription'
            },
            {
                title: '操作人',
                dataIndex: 'username',
                key: 'username'
            },
            {
                title: '操作时间',
                dataIndex: 'createdAtFormat',
                key: 'createdAtFormat'
            }
        ]
    }

    loadOrganizationLog(params) {
        params.name = params.name
            ? params.name
                .replace(/^(\s|\u00A0)+/, '')
                .replace(/(\s|\u00A0)+$/, '')
            : undefined
        this.props.OrganizationStore.getOrganizationLog(params)
        // G.history.push(`/admin/logs${G.encodeQuery(params)}`)
    }
    onSubmit(value) {
        this.setState({ query: value, pageNo: 1 })
        console.log('submit', value)
        this.loadOrganizationLog(value)
    }
    onReset() {
        const params = {}
        this.setState({ query: params, pageNo: 1 })
        this.loadOrganizationLog(params)
    }
    handleChange(value) {
        console.log('change', value)
        const query = this.state.query
        const params = Object.assign(query, { pageNo: value.current })
        console.log('change', params)
        this.setState({ pageNo: value.current })
        this.loadOrganizationLog(params)
    }
    render() {
        const {
            organizationLog,
            organizationLogTotal,
            listLoading
        } = this.props.OrganizationStore
        const dataSource = mobx.toJS(organizationLog)
        const pagination = {
            total: organizationLogTotal,
            current: this.state.pageNo,
            showTotal: () => `共 ${organizationLogTotal} 条`
        }
        const initialValue = G.getQuery()
        return (
            <div className='list'>
                <SearchForm
                    onReset={this.onReset}
                    onSubmit={this.onSubmit}
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
            </div>
        )
    }
}

export default Form.create()(Logs)
