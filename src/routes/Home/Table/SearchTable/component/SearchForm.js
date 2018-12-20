import Component from 'components/Component'

import moment from 'moment'
import { createForm } from 'utils/antdUtils'

import { Form, Input, Button, DatePicker, Select } from 'antd'

import { GRADE } from 'settings/const'

const FormItem = Form.Item
const Search = Input.Search
const { RangePicker } = DatePicker
const Option = Select.Option

@createForm()
class SearchForm extends Component {
    handleReset = () => {
        const { form, onReset } = this.props
        const { resetFields } = form
        onReset && onReset(() => resetFields && resetFields())
    }
    onSubmit(v) {
        this.props.onSubmit && this.props.onSubmit(v)
    }
    render() {
        const { initialValue, form } = this.props
        const { getFieldDecorator } = form
        const searchStyle = { width: 220 }

        let { name, grade, startTime, endTime } = initialValue || {
            name: undefined,
            grade: undefined,
            startTime: undefined,
            endTime: undefined
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
                            onClick={this.handleReset}
                        >
                            重置
                        </Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

export default SearchForm
