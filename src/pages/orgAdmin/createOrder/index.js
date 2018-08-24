import Component from 'components/Component'
import { Form, Input, Select, Button, message } from 'antd'
import { createForm } from 'libs/antdUtils'
import SelectNumberItem from '../selectNumberItem'
import Spinner from '../../../components/spiner/Spinner'
import { DAFAULT_TEXT, DEFAULT_CLASSES, UNIT } from '../../../settings/consts'
import './createOrder.scss'

const FormItem = Form.Item
const Option = Select.Option
const { TextArea } = Input

@createForm()
class OrderForm extends Component {
    constructor(props) {
        super(props)
        this.timer = null
        this.state = {
            institutionName: '请输入机构编号',
            selectProductType: '1', // 选中商品编号 商品编号 === 7 时为充值
            selectNumber: 100, // 选中的账号数量 默认100
            unitPrice: 0, // 商品单价 由后端控制
            totalPrice: 0, // 商品总价
            purchasedService: [{}, {}], // 当前机构购买的服务
            productType: undefined, // 可购买的服务列表
            amount: undefined, // 充值金额
            amountError: false, // 充值金额是否报错
            orgId: undefined, // 机构id
            customInputVisible: false, // 是否自定义数量
            loading: false,
            countLoading: false
        }
    }
    componentDidMount() {
        this.setState({ loading: true })
        G.api.getInitService().then(data => {
            let initProductType = []
            let totalPrice
            data.forEach((item, i) => {
                let service = {
                    key: '' + item.cid,
                    value: item.name,
                    unitPrice: Number(item.price)
                }
                if (item.cid === 8) {
                    totalPrice = Number(item.price)
                    initProductType.unshift(service)
                } else {
                    initProductType.push(service)
                }
            })
            this.setState({
                selectProductType: initProductType[0].key,
                unitPrice: 0,
                totalPrice: totalPrice,
                productType: initProductType,
                loading: false
            })
        })
    }
    componentWillUnmount() {
        clearTimeout(this.timer)
    }
    openCustomInput = () => {
        if (!this.state.customInputVisible) {
            this.setState({
                customInputVisible: true,
                selectNumber: null
            })
        }
    }
    getSelectedProductSubscript = (selectProductType, productType) => {
        return productType.findIndex(
            product => product.key === selectProductType
        )
    }
    validatorAmount = e => {
        let { value } = e.target
        const reg = /^(0|[1-9][0-9]*)(\.[0-9]{0,2})?$/
        if ((reg.test(value) && !isNaN(value)) || value === '') {
            this.setState({ amount: value, amountError: false })
        }
    }
    handleAccounting = (n, isCustom) => {
        this.setState({ countLoading: true })
        let { orgId, selectProductType } = this.state
        let type = Number(selectProductType) > 4 ? 3 : 2 // selectProductType大于4为 升级版或充值
        let data = {
            orgId: orgId || '',
            type: type,
            cid: selectProductType,
            countNumber: n
        }
        G.api
            .getOrderTotalAmount({ data })
            .then(data => {
                this.setState({
                    totalPrice: Number(data),
                    selectNumber: Number(n),
                    countLoading: false,
                    customInputVisible: isCustom === 'custom'
                })
            })
            .catch(e => {
                message.error(e.message)
            })
    }
    handleProductTypeChange = value => {
        let { productType, selectProductType, selectNumber } = this.state
        if (selectProductType === value) {
            return null
        }
        if (value === '7') {
            this.setState({
                selectProductType: value,
                amount: undefined
            })
            return null
        } else if (value === '8') {
            this.setState({
                selectProductType: value,
                amount: undefined,
                totalPrice: 5000
            })
            return null
        }
        let i = this.getSelectedProductSubscript(value, productType)
        let unitPrice = productType[i].unitPrice
        selectNumber = productType[i].value.indexOf('升级') >= 0 ? 0 : 100
        this.setState(
            {
                selectProductType: value,
                selectNumber: selectNumber,
                unitPrice: unitPrice,
                customInputVisible: false,
                amount: undefined
            },
            () => {
                this.handleAccounting(selectNumber)
            }
        )
    }
    handleSearchOrgControl = (rules, value, cb) => {
        let r = /^\+?[0-9]{6,7}$/
        if (!r.test(value) && value !== '1') {
            clearTimeout(this.timer)
            cb('请输入正确的机构编号')
            return null
        }
        if (this.timer == null) {
            this.timer = setTimeout(() => {
                this.handleSearchOrg(rules, value, cb)
            }, 400)
        } else {
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.handleSearchOrg(rules, value, cb)
            }, 400)
        }
    }
    handleSearchOrg = (rules, value, cb) => {
        let params = { urlParams: { orgId: value } }
        G.api
            .getOpenService(params)
            .then(data => {
                if (!data) {
                    cb('未查询到该机构信息!')
                } else {
                    let { name, orgServiceList, orgServiceEntityList } = data
                    let purchasedService = [{}, {}]
                    let productType = []
                    orgServiceList.forEach(service => {
                        if (!service) return null
                        let {
                            type,
                            laveNum,
                            accountNum,
                            name,
                            outrideNum
                        } = service
                        if (type === 1) {
                            purchasedService[0] = {
                                key: '1',
                                name,
                                outrideNum,
                                accountBalance: laveNum,
                                totalAccounts: accountNum
                            }
                        } else if (type === 6) {
                            purchasedService[0] = {
                                key: '' + type,
                                name,
                                accountBalance: null,
                                totalAccounts: null
                            }
                        } else {
                            purchasedService[1] = {
                                key: '' + type,
                                name,
                                accountBalance: laveNum,
                                totalAccounts: accountNum
                            }
                        }
                    })
                    let totalPrice
                    orgServiceEntityList
                        && orgServiceEntityList.forEach(product => {
                            let {
                                cid: key,
                                name: value,
                                price: unitPrice
                            } = product
                            if (key === 8) {
                                totalPrice = Number(product.price)
                                productType.unshift({
                                    key: '' + key,
                                    value,
                                    unitPrice: Number(unitPrice)
                                })
                            } else {
                                productType.push({
                                    key: '' + key,
                                    value,
                                    unitPrice: Number(unitPrice)
                                })
                            }
                        })
                    this.setState(
                        {
                            selectProductType: productType[0].key,
                            orgId: value,
                            institutionName: name,
                            purchasedService: purchasedService,
                            productType,
                            selectNumber: 0,
                            unitPrice: 0,
                            totalPrice: totalPrice,
                            customInputVisible: false
                        },
                        () => {
                            cb()
                        }
                    )
                }
            })
            .catch(e => {
                message.error(e.message)
            })
    }
    onSubmit(values) {
        let { orgId, confirmNote: note, customNumber } = values
        let {
            unitPrice: price,
            totalPrice: payMoney,
            selectNumber: buyNum,
            productType,
            selectProductType,
            amount
        } = this.state
        let pos = this.getSelectedProductSubscript(
            selectProductType,
            productType
        )
        let name = productType[pos]['value']
        note = note || ''
        let data = {
            orgId,
            cid: selectProductType,
            name,
            price,
            buyNum,
            payMoney,
            note
        }
        if (selectProductType === '7') {
            if (!amount || amount === '0') {
                this.setState({ amountError: true })
                return null
            }
            data.type = 1 // 充值服务
            data.payMoney = amount.endsWith('.')
                ? amount.substr(0, amount.length - 1)
                : amount
        } else if (selectProductType === '8') {
            data.type = 4
            data.price = ''
            data.buyNum = ''
        } else {
            let type = name.indexOf('升级') >= 0 ? 3 : 2 // 2: 购买服务 3: 升级服务
            data.type = type
            data.buyNum = buyNum || customNumber || 0
            data.payMoney = Number(payMoney).toFixed(2)
        }
        G.api
            .createOrder({ data })
            .then(data => {
                message.success('订单创建成功')
                G.history.replace('/orgAdmin/orderList')
            })
            .catch(e => {
                message.error(e.message)
            })
    }
    render() {
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 5 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 13 }
            }
        }
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0
                },
                sm: {
                    span: 5,
                    offset: 5
                }
            }
        }

        let {
            selectNumber,
            customInputVisible,
            productType,
            loading,
            countLoading,
            selectProductType,
            institutionName,
            unitPrice,
            totalPrice,
            purchasedService
        } = this.state

        const SelectNumberItemProps = {
            selectProductType,
            purchasedService,
            selectNumber: selectNumber,
            formItemLayout: formItemLayout,
            customInputVisible: customInputVisible,
            getFieldDecorator: getFieldDecorator,
            handleAccounting: this.handleAccounting,
            handleCustomAccounting: this.handleAccounting,
            openCustomInput: this.openCustomInput
        }
        const styleSpinner = {
            display: 'block',
            width: '30px',
            margin: '4px auto'
        }
        const unitText = selectProductType === '1' ? UNIT[0] : UNIT[1]
        let selectValue = productType
            ? productType[0].value
            : '智能课堂（支持1对多/1对1）'
        let pos
            = productType
            && this.getSelectedProductSubscript(selectProductType, productType)
        if (pos && pos > 0) {
            selectValue = productType[pos].value
        }
        let amountProps = this.state.amountError
            ? { help: '充值金额不能为"0"或空', validateStatus: 'error' }
            : null
        return (
            <div>
                {loading && <Spinner />}
                {!loading && (
                    <Form onSubmit={this.onSubmit}>
                        <FormItem
                            className='orderForm-item'
                            label='机构编号'
                            {...formItemLayout}
                        >
                            {getFieldDecorator('orgId', {
                                rules: [
                                    {
                                        required: true,
                                        validator: this.handleSearchOrgControl
                                    }
                                ],
                                validateTrigger: 'onChange'
                            })(<Input placeholder='最多7位数字' />)}
                        </FormItem>

                        <FormItem
                            className='orderForm-item-name'
                            {...formItemLayout}
                            label='机构名称'
                        >
                            <span className='ant-form-text'>
                                {institutionName}
                            </span>
                        </FormItem>

                        <FormItem
                            className='orderForm-item-service'
                            {...formItemLayout}
                            label='开通服务'
                        >
                            {purchasedService.map((service, i) => {
                                let {
                                    name,
                                    key,
                                    totalAccounts,
                                    accountBalance,
                                    outrideNum
                                } = service
                                let outerText = outrideNum
                                    ? `; 已超出:${outrideNum})`
                                    : ')'
                                if (!key) {
                                    return (
                                        <div className={DEFAULT_CLASSES[i]}>
                                            {DAFAULT_TEXT[i]}
                                        </div>
                                    )
                                } else {
                                    return (
                                        <div
                                            key={key}
                                            className={
                                                DEFAULT_CLASSES[i] + ' ' + 'own'
                                            }
                                        >
                                            {name}
                                            {totalAccounts && (
                                                <span
                                                >{`(账号总数:${totalAccounts}; 账号余量:${accountBalance}${outerText}`}</span>
                                            )}
                                        </div>
                                    )
                                }
                            })}
                        </FormItem>

                        <FormItem
                            className='accounting-item-type'
                            label='商品类型'
                            {...formItemLayout}
                        >
                            <Select
                                value={selectValue}
                                onChange={this.handleProductTypeChange}
                            >
                                {productType
                                    && productType.map(product => {
                                        let { key, value } = product
                                        return (
                                            <Option key={key}>{value}</Option>
                                        )
                                    })}
                            </Select>
                        </FormItem>

                        {selectProductType !== '7'
                            && selectProductType !== '8'
                            && selectProductType !== '9' && (
                            <SelectNumberItem {...SelectNumberItemProps} />
                        )}

                        {selectProductType !== '7'
                            && selectProductType !== '8'
                            && selectProductType !== '9' && (
                            <FormItem
                                className='accounting-item'
                                {...formItemLayout}
                                label='单价'
                            >
                                <span className='ant-form-text'>
                                    {`${unitPrice.toFixed(2)}${unitText}`}
                                </span>
                            </FormItem>
                        )}

                        {selectProductType !== '7' && (
                            <FormItem
                                className='accounting-item'
                                {...formItemLayout}
                                label='总价'
                            >
                                {!countLoading && (
                                    <span className='ant-form-text'>
                                        {`¥${totalPrice.toFixed(2)}`}
                                    </span>
                                )}
                                {countLoading && (
                                    <span className='ant-form-text'>
                                        <Spinner style={styleSpinner} />
                                    </span>
                                )}
                            </FormItem>
                        )}

                        {selectProductType === '7' && (
                            <FormItem
                                {...amountProps}
                                required='true'
                                className='orderForm-item'
                                label='充值金额'
                                {...formItemLayout}
                            >
                                <Input
                                    maxLength='10'
                                    onChange={this.validatorAmount}
                                    value={this.state.amount}
                                    placeholder='请输入充值金额'
                                />
                            </FormItem>
                        )}

                        <FormItem {...formItemLayout} label='订单备注'>
                            {getFieldDecorator('confirmNote', {
                                rules: [
                                    { message: '请输入订单备注' },
                                    { validator: this.validator }
                                ],
                                validateTrigger: 'onBlur'
                            })(
                                <TextArea
                                    placeholder='请输入订单备注'
                                    rows={4}
                                />
                            )}
                        </FormItem>

                        <FormItem {...tailFormItemLayout}>
                            <Button htmlType='submit' type='primary'>
                                创建
                            </Button>
                        </FormItem>
                    </Form>
                )}
            </div>
        )
    }
}
export default class CreatePartner extends Component {
    render() {
        return (
            <div className='container'>
                <div className='content'>
                    <div className='createOrder-container'>
                        <OrderForm />
                    </div>
                </div>
                <div className='footer'>power to go</div>
            </div>
        )
    }
}
