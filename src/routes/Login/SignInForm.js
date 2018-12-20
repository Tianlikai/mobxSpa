import Component from 'components/Component'

import PropTypes from 'prop-types'

import { Form, Input, Button } from 'antd'

import { createForm } from 'utils/antdUtils'

@createForm()
class SignInForm extends Component {
    static propTypes = {
        onSubmit: PropTypes.func
    }

    onSubmit(values) {
        const { onSubmit } = this.props
        if (onSubmit) onSubmit(values)
    }

    get formItems() {
        return [
            {
                key: 'username',
                component: <Input size='large' placeholder='请输入帐号' />,
                props: {
                    validate: [
                        {
                            trigger: 'onChange',
                            rules: [{ required: true, message: '请填写帐号' }]
                        }
                    ]
                }
            },
            {
                key: 'password',
                component: (
                    <Input
                        size='large'
                        type='password'
                        placeholder='请输入密码'
                    />
                ),
                props: {
                    rules: [{ required: true, message: '请填写密码' }]
                }
            }
        ]
    }

    render({ renderForm }) {
        return (
            <Form onSubmit={this.onSubmit}>
                {renderForm(this.formItems, {
                    data: { username: G.loginName },
                    noWrap: true,
                    noFooter: true,
                    layout: false
                })}
                <Button
                    htmlType='submit'
                    className='submit'
                    loading={this.isLoading}
                >
                    {this.isLoading ? '登录中...' : '登录'}
                </Button>
            </Form>
        )
    }
}

export default SignInForm
