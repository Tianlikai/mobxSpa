import Component from 'components/Component'
import { Form, Input } from 'antd'
import SelectButtonList from './SelectButtonList'

const FormItem = Form.Item

class SelectNumberItem extends Component {
    static defaultProps = {
        designatedNumber: {
            purchased: [[100, 200, 500], [1000, 2000, 5000, '自定义']],
            upgrade: [0, 1000, 10000, '自定义']
        }
    }
    /**
     * 计算页面 显示 普通模块/增购模块/升级模块
     * @return {numberType: 是增购还是升级, accountLabel: 动态标签名称}
     */
    handlePageChange = () => {
        let { selectProductType, purchasedService } = this.props
        let hadEvaluationService = purchasedService[0]['key'] || false
        let hadSystemService = purchasedService[1]['key'] || false
        let numberType = 'purchased'
        let accountLabel = '购买账号数'
        // 选中作业系统 购买过作业系统 选中的服务级别大于当前购买的作业系统服务
        if (
            selectProductType !== '1'
            && hadSystemService
            && selectProductType > hadSystemService
        ) { numberType = 'upgrade' }
        // 曾经购买过 智能评测 或 作业系统
        if (
            (hadEvaluationService && selectProductType === '1')
            || (hadSystemService && selectProductType !== '1')
        ) { accountLabel = '购买更多账号' }
        return { numberType, accountLabel }
    }
    handlePurchasedValidator = (rules, value, cb) => {
        // 自定义增购控制
        let r = /^\+?[1-9][0-9]*$/
        if (!r.test(value)) {
            cb('请输入正确的数量')
            return null
        }
        if (value < 100) {
            cb('至少购买100个用户')
            return null
        }
        this.props.handleCustomAccounting(value, 'custom')
        cb()
    }
    handleUpgradeValidator = (rules, value, cb) => {
        // 自定义升级控制
        let r = /^(0|[1-9][0-9]*)$/
        if (!r.test(value)) {
            cb('请输入正确的数量')
            return null
        }
        this.props.handleCustomAccounting(value, 'custom')
        cb()
    }
    render() {
        const {
            getFieldDecorator, // antd 表单阿皮
            designatedNumber, // 配置数据
            selectNumber, // 选中的数量
            customInputVisible, // 自定义输入，是否展示，外部控制
            handleAccounting, // 计算金额回掉
            openCustomInput, // 打开自定义输入回掉
            formItemLayout
        } = this.props
        // 计算页面 显示 普通模块/增购模块/升级模块
        let { numberType, accountLabel } = this.handlePageChange()
        const commonProps = { selectNumber, handleAccounting, openCustomInput }
        return (
            <FormItem
                className='accounting-item-number'
                {...formItemLayout}
                label={accountLabel}
            >
                {numberType === 'purchased' && (
                    <div className='buy-account-number'>
                        <SelectButtonList
                            data={designatedNumber[numberType][0]}
                            {...commonProps}
                        />
                        <SelectButtonList
                            data={designatedNumber[numberType][1]}
                            {...commonProps}
                        >
                            {customInputVisible
                                && getFieldDecorator('customNumber', {
                                    rules: [
                                        {
                                            required: true,
                                            validator: this
                                                .handlePurchasedValidator
                                        }
                                    ],
                                    validateTrigger: 'onBlur'
                                })(
                                    <Input
                                        maxLength={10}
                                        placeholder='请输入自定义数量大于等于100'
                                    />
                                )}
                        </SelectButtonList>
                    </div>
                )}
                {numberType === 'upgrade' && (
                    <div className='buy-account-number'>
                        <SelectButtonList
                            data={designatedNumber[numberType]}
                            {...commonProps}
                        >
                            {customInputVisible
                                && getFieldDecorator('customNumber', {
                                    rules: [
                                        {
                                            required: true,
                                            validator: this
                                                .handleUpgradeValidator
                                        }
                                    ],
                                    validateTrigger: 'onBlur'
                                })(
                                    <Input
                                        maxLength={10}
                                        placeholder='请输入自定义数量'
                                    />
                                )}
                        </SelectButtonList>
                    </div>
                )}
            </FormItem>
        )
    }
}

export default SelectNumberItem
