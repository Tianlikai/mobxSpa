import Component from 'components/Component'
import { observer, inject } from 'mobx-react'

import { Form, Input, Button } from 'antd'

import Spinner from 'components/spiner/Spinner'

import { createForm } from 'libs/antdUtils'

import { LABEL_LIST, ORDER_FIELD } from 'settings/consts'

import './orderDetail.scss'

const FormItem = Form.Item
const { TextArea } = Input

@createForm()
export class DetailForm extends Component {
    onSubmit(value) {
        this.props.onSubmit && this.props.onSubmit(value)
    }
    render() {
        const { getFieldDecorator } = this.props.form
        let { initialValues } = this.props
        if (!initialValues) {
            return null
        }
        let keys = ORDER_FIELD.slice()
        if (!initialValues.buyNum > 0 || initialValues.product === 6) {
            keys.splice(6, 1)
            keys.splice(7, 1)
        }
        switch (initialValues.state) {
            case '已支付': {
                keys.splice(3, 0, 'payTime')
                if (
                    !initialValues['nowNum']
                    || initialValues['type'] !== '升级服务'
                ) {
                    keys.splice(keys.indexOf('nowNum'), 1)
                }
                keys.splice(keys.length - 1, 0, 'payType')
                break
            }
            case '待支付':
            case '已取消': {
                if (
                    !initialValues['nowNum']
                    || initialValues['type'] !== '升级服务'
                ) {
                    keys.splice(keys.indexOf('nowNum'), 1)
                }
                break
            }
            default: {
                break
            }
        }
        const formItemLayout = {
            labelCol: {
                xs: { span: 12 },
                sm: { span: 4, offset: 2 }
            },
            wrapperCol: {
                xs: { span: 12 },
                sm: { span: 12 }
            }
        }
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0
                },
                sm: {
                    span: 3,
                    offset: 6
                }
            }
        }
        return (
            <Form onSubmit={this.onSubmit}>
                {keys.map(key => {
                    let label = LABEL_LIST[key]
                    if (key === 'buyNum') {
                        label
                            = initialValues['type'] === '升级服务'
                                ? label[1]
                                : label[0]
                    }
                    let text = initialValues[key]
                    if (key === 'note') {
                        return (
                            <FormItem
                                key={key}
                                {...formItemLayout}
                                className='orderDetail-item'
                                label={label}
                            >
                                {getFieldDecorator('orderNote', {
                                    initialValue: text
                                })(
                                    <TextArea
                                        disabled={!this.props.edit}
                                        placeholder='请输入订单备注'
                                        rows={4}
                                    />
                                )}
                            </FormItem>
                        )
                    }
                    return (
                        <FormItem
                            key={key}
                            className='orderDetail-item'
                            {...formItemLayout}
                            label={label}
                        >
                            <span className='ant-form-text'>{text}</span>
                        </FormItem>
                    )
                })}
                <FormItem className='orderDetail-item' {...tailFormItemLayout}>
                    <Button
                        htmlType='submit'
                        type={this.props.edit ? 'primary' : 'default'}
                    >
                        {this.props.edit ? '保存' : '编辑'}
                    </Button>
                </FormItem>
            </Form>
        )
    }
}

@inject('OrdersStore')
@observer
export default class OrderDetail extends Component {
    constructor(props) {
        super(props)
        this.state = { loading: true, edit: false }
    }
    componentDidMount() {
        this.setState({ loading: true })
        const id = this.props.match.params.id
        this.props.OrdersStore.getOrdDetail(id, () => {
            this.setState({ loading: false })
        })
    }
    componentWillUnmount() {
        this.props.OrdersStore.clearDetail()
    }
    handleSubmit = value => {
        let { edit } = this.state
        if (edit) {
            let { orderNote } = value
            let data = { note: orderNote }
            this.props.OrdersStore.editOrderNote(
                this.props.match.params.id,
                data,
                () => {
                    this.setState({ edit: !edit })
                }
            )
        } else {
            this.setState({ edit: !edit })
        }
    }
    render() {
        const initialValues = this.props.OrdersStore.orderDetail
        return (
            <div className='container'>
                <div className='content'>
                    <div className='orderDetail-container'>
                        {this.state.loading && <Spinner />}
                        <DetailForm
                            edit={this.state.edit}
                            onSubmit={this.handleSubmit}
                            initialValues={initialValues}
                        />
                    </div>
                </div>
                <div className='footer'>power to go</div>
            </div>
        )
    }
}
