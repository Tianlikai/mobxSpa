import AuthComponent from 'libs/AuthComponent'

import { Modal, Form, Input } from 'antd'

const FormItem = Form.Item
const TextArea = Input.TextArea

class TextAreaForm extends AuthComponent {
    onSubmit(v) {
        const { validateFields } = this.props.form
        validateFields((err, fieldsValue) => {
            if (err) return null
            this.props.onSubmit && this.props.onSubmit(fieldsValue)
        })
    }
    onClose = () => {
        this.props.onClose && this.props.onClose()
    }
    render() {
        const { form, title, visible } = this.props
        const { getFieldDecorator } = form

        const styleFormItem = { marginBottom: 0 }

        const modalProps = {
            title: title,
            visible: visible,
            onOk: this.onSubmit,
            onCancel: this.onClose,
            cancelText: '取消',
            okText: '确认',
            width: 768
        }

        return (
            <div>
                <Modal {...modalProps}>
                    <Form>
                        <FormItem style={styleFormItem}>
                            {getFieldDecorator('reason', {
                                rules: [
                                    { required: true, message: '不可为空!' }
                                ]
                            })(
                                <TextArea
                                    placeholder='请填写不通过的理由'
                                    rows={5}
                                />
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }
}

export default Form.create()(TextAreaForm)
