import Component from 'components/Component'
import { inject, observer } from 'mobx-react'
import { Form, Input, Select, Button, Radio, Cascader } from 'antd'
import Spinner from '../../../components/spiner/Spinner'
import ModuleLine from '../ModuleLine'
import { createForm } from 'libs/antdUtils'
import { GRADE } from '../../../settings/consts'
import './createPromotion.scss'

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group

@createForm()
class OrderForm extends Component {
    onSubmit(values) {
        let {
            area: AREA,
            className,
            englishPress,
            englishTeacher,
            grade,
            mathPress,
            mathTeacher,
            school
        } = values
        const province = AREA[0] || ''
        const city = AREA[1] || ''
        const area = AREA[2] || ''
        const data = {
            province,
            city,
            area,
            className,
            englishPress,
            englishTeacher,
            grade,
            mathPress,
            mathTeacher,
            school
        }
        this.props.onSubmit && this.props.onSubmit(data)
    }
    render() {
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 7 }
            }
        }
        const formItemRadioLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 }
            },
            wrapperCol: {
                xs: { span: 24 },
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
                    span: 6,
                    offset: 6
                }
            }
        }
        const { regions, mathType, englishType } = this.props
        return (
            <div className='orderForm-container'>
                {true && (
                    <Form onSubmit={this.onSubmit}>
                        <FormItem
                            className='orderForm-item'
                            label='配置地区'
                            {...formItemLayout}
                        >
                            {getFieldDecorator('area', {
                                rules: [{ required: true }],
                                validateTrigger: 'onChange'
                            })(<Cascader options={regions} />)}
                        </FormItem>
                        <FormItem
                            className='orderForm-item'
                            label='配置学校'
                            {...formItemLayout}
                        >
                            {getFieldDecorator('school', {
                                rules: [{ required: true }],
                                validateTrigger: 'onChange'
                            })(
                                <Input
                                    maxLength='25'
                                    placeholder='输入学校名'
                                />
                            )}
                        </FormItem>
                        <FormItem
                            className='orderForm-item'
                            label='年级'
                            {...formItemLayout}
                        >
                            {getFieldDecorator('grade', {
                                validateTrigger: 'onChange'
                            })(
                                <Select placeholder='选择年级'>
                                    {GRADE.map((grade, i) => {
                                        if (i > 0) {
                                            return (
                                                <Option
                                                    key={grade.key}
                                                    value={grade.value}
                                                >
                                                    {grade.text}
                                                </Option>
                                            )
                                        }
                                    })}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            className='orderForm-item'
                            label='班级'
                            {...formItemLayout}
                        >
                            {getFieldDecorator('className', {
                                validateTrigger: 'onChange'
                            })(<Input maxLength='15' placeholder='输入班级' />)}
                        </FormItem>
                        <FormItem
                            className='orderForm-item'
                            label='英语老师'
                            {...formItemLayout}
                        >
                            {getFieldDecorator('englishTeacher', {
                                validateTrigger: 'onChange'
                            })(<Input placeholder='输入英语老师' />)}
                        </FormItem>
                        <FormItem
                            className='orderForm-item'
                            label='数学老师'
                            {...formItemLayout}
                        >
                            {getFieldDecorator('mathTeacher', {
                                validateTrigger: 'onChange'
                            })(<Input placeholder='输入数学老师' />)}
                        </FormItem>
                        <FormItem
                            className='orderForm-item special'
                            label='教材版本'
                            {...formItemLayout}
                        />
                        <FormItem
                            className='orderForm-item specialM'
                            label='数学版本'
                            {...formItemRadioLayout}
                        >
                            {getFieldDecorator('mathPress', {
                                rules: [{ required: true }],
                                validateTrigger: 'onChange',
                                initialValue: mathType[0]
                                    ? mathType[0].dictvalue
                                    : ''
                            })(
                                <RadioGroup>
                                    {mathType.map(version => (
                                        <Radio
                                            key={version.dictvalue}
                                            value={version.dictvalue}
                                        >
                                            {version.dicttext}
                                        </Radio>
                                    ))}
                                </RadioGroup>
                            )}
                        </FormItem>
                        <FormItem
                            className='orderForm-item specialE'
                            label='英语版本'
                            {...formItemRadioLayout}
                        >
                            {getFieldDecorator('englishPress', {
                                rules: [{ required: true }],
                                validateTrigger: 'onChange',
                                initialValue: englishType[0]
                                    ? englishType[0].dictvalue
                                    : ''
                            })(
                                <RadioGroup>
                                    {englishType.map(version => (
                                        <Radio
                                            key={version.dictvalue}
                                            value={version.dictvalue}
                                        >
                                            {version.dicttext}
                                        </Radio>
                                    ))}
                                </RadioGroup>
                            )}
                        </FormItem>
                        <FormItem {...tailFormItemLayout}>
                            <Button htmlType='submit' type='primary' size='big'>
                                立即创建
                            </Button>
                        </FormItem>
                    </Form>
                )}
            </div>
        )
    }
}

@inject('CreatePromotionStore')
@observer
class CreatePromotion extends Component {
    componentDidMount() {
        this.props.CreatePromotionStore.initialData()
    }
    handleSubmit = data => {
        this.props.CreatePromotionStore.CreatePromotion(data)
    }
    render() {
        const {
            regions,
            mathType,
            englishType,
            loading
        } = this.props.CreatePromotionStore
        return (
            <div className='createPromotion-container'>
                <ModuleLine title={'新增推广'} />
                {loading && <Spinner />}
                {!loading && (
                    <OrderForm
                        onSubmit={this.handleSubmit}
                        regions={regions}
                        mathType={mathType}
                        englishType={englishType}
                    />
                )}
            </div>
        )
    }
}

export default CreatePromotion
