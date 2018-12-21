/* eslint-disable */
import { Modal as AntdModal, Form, Input, Button, Breadcrumb, Icon } from 'antd'
// import { default as CustomModal } from '../widgets/Modal'

const FormItem = Form.Item
const BItem = Breadcrumb.Item

/**
 * {key, title, href}
 */
export function renderBreadcrumb(items = []) {
    // 自动添加 Home
    let homeLink = G.getLink('HOME')
    let firstItem = items[0]

    if (firstItem && firstItem.href !== homeLink) {
        items.unshift({ title: <Icon type='home' />, href: G.getLink('HOME') })
    } else if (firstItem && firstItem.href === homeLink && !firstItem.title) {
        firstItem.title = <Icon type='home' />
    }

    // 保证要有 key
    items.forEach((it, index) => {
        if (!it.key) it.key = it.href || 'index-' + index
    })

    // 最后一个 item 不需要 href
    delete items[items.length - 1].href

    return (
        <Breadcrumb separator='>'>
            {items.map(it => (
                <BItem
                    {...it}
                    title={typeof it.title === 'string' ? it.title : ''}
                >
                    {it.title}
                </BItem>
            ))}
        </Breadcrumb>
    )
}

export function renderModal(
    context,
    stateKey,
    modalProps,
    ctor,
    ctorProps = {},
    Modal = AntdModal
) {
    let data = context.state[stateKey]
    if (!data) return null
    let closeModal = () => context.setState({ [stateKey]: null })
    if (!modalProps.closeModal) modalProps.closeModal = closeModal
    if (!ctorProps.closeModal) ctorProps.closeModal = closeModal
    let className = modalProps.title ? modalProps.title : 'antd-no-title-modal'

    if (typeof data === 'object') ctorProps = { ...data, ...ctorProps }

    return (
        <Modal
            className={className}
            visible
            onCancel={closeModal}
            onOk={closeModal}
            {...modalProps}
        >
            {React.createElement(ctor, ctorProps)}
        </Modal>
    )
}

// export function renderCustomModal(
//     context,
//     stateKey,
//     modalProps,
//     ctor,
//     ctorProps = {}
// ) {
//     return renderModal(
//         context,
//         stateKey,
//         modalProps,
//         ctor,
//         ctorProps,
//         CustomModal
//     )
// }

const defautFormItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 14 }
}

/**
 * 需要 bind 到 Component 上
 *
 * item: {key, label, hidden, isCheck, component, getComponent, props, extra}
 */
export function renderForm(
    items,
    {
        data = {},
        layout = defautFormItemLayout,
        formProps = {},
        noWrap,
        noFooter,
        footer,
        submitText = '提交'
    } = {},
    context = null
) {
    context = context || this
    let {
        form: { getFieldDecorator }
    } = context.props
    layout = layout || {}
    items = items.filter(item => !item.hidden).map(item => {
        let props = item.props || {}
        if (item.required) {
            props.rules = props.rules || []
            // CheckboxGroup 使用 whitespace 就总会报错
            if (item.component.type === Input) {
                let whitespace
                    = 'whitespace' in item
                        ? item.whitespace
                        : item.component.type === Input
                props.rules.unshift({
                    required: true,
                    whitespace,
                    message:
                        typeof item.required === 'string'
                            ? item.required
                            : '此字段不能为空'
                })
            } else {
                props.rules.unshift({
                    required: true,
                    message:
                        typeof item.required === 'string'
                            ? item.required
                            : '此字段不能为空'
                })
            }
        }
        return (
            <FormItem
                className={item.key + 'FormItem'}
                {...layout}
                key={item.key}
                label={item.label}
            >
                {getFieldDecorator(item.key, {
                    initialValue: data[item.key],
                    valuePropName: item.isCheck ? 'checked' : 'value',
                    ...props
                })(item.component || item.getComponent())}
                {item.extra}
            </FormItem>
        )
    })

    if (!noFooter && !footer) {
        let loading = context.isLoading
        let wrapperCol
            = layout.wrapperCol && layout.labelCol
                ? {
                    span: layout.wrapperCol.span,
                    offset: layout.labelCol.span
                }
                : null
        footer = (
            <FormItem key='footer' wrapperCol={wrapperCol}>
                <Button
                    type='primary'
                    size='large'
                    htmlType='submit'
                    loading={loading}
                >
                    {submitText + (loading ? '中...' : '')}
                </Button>
            </FormItem>
        )
    }

    if (noWrap) {
        if (footer && !noFooter) items.push(footer)
        return items
    }

    return (
        <Form onSubmit={context.onSubmit} {...formProps}>
            {items}
            {footer}
        </Form>
    )
}

export function createForm(options, antdFormOptions) {
    return Component => {
        return Form.create(antdFormOptions)(
            class extends Component {
                onSubmit(e) {
                    e.preventDefault()
                    let { form, onSubmit } = this.props

                    form.validateFieldsAndScroll((errors, data) => {
                        if (errors) return
                        let prom
                        if (super.onSubmit) {
                            prom = super.onSubmit(data)
                        } else if (onSubmit) {
                            prom = onSubmit(data)
                        } else {
                            console.warn(
                                Component.name + ' 没有实现 onSubmit 方法'
                            )
                        }
                        if (prom && prom.then) {
                            this.doLoading()
                            prom.then(this.doneLoading, this.doneLoading)
                        }
                    })
                }

                render() {
                    return super.render({
                        renderForm: renderForm.bind(this)
                    })
                }
            }
        )
    }
}
