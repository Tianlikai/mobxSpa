import Component from 'components/Component'
import { Form, Button, Modal, DatePicker, message } from 'antd'
import Spinner from '../../../components/spiner/Spinner'
import { observer, inject } from 'mobx-react'
import { createForm } from 'libs/antdUtils'
import moment from 'moment'
import Storage from 'libs/storage'
import './productinfo.scss'

const FormItem = Form.Item
@createForm()
class DateModalForm extends Component {
    onSubmit(v) {
        const params = v
        params.disableTime = params.disableTime && params.disableTime.format()
        this.props.onSubmit && this.props.onSubmit(params)
    }
    onClose = () => {
        this.props.onClose && this.props.onClose()
    }
    disabledDate = current => {
        return current && current < moment()
    }
    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <div className='search'>
                <Modal
                    title=''
                    visible={this.props.visible}
                    onOk={this.onSubmit}
                    onCancel={this.onClose}
                    cancelText='取消'
                    okText='确认'
                >
                    <h3>设置延期</h3>
                    <Form layout='inline'>
                        <FormItem label='禁用时间'>
                            {getFieldDecorator('disableTime', {})(
                                <DatePicker
                                    showTime
                                    format='YYYY-MM-DD HH:mm:ss'
                                    placeholder='禁用时间'
                                    disabledDate={this.disabledDate}
                                />
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }
}

class Item extends Component {
    render() {
        return (
            <div>
                <span className='pd-span-left'>{this.props.label}</span>
                <span className='pd-span'>{this.props.value}</span>
                {this.props.children}
            </div>
        )
    }
}
class TextShow extends Component {
    render() {
        let { productInfo, hadExtensionAuthority } = this.props
        let {
            cepingService: cp,
            teachingService: t,
            newCepingService: ncp
        } = productInfo || {
            cepingService: null,
            teachingService: null,
            newCepingService: null
        }
        const config = [
            { key: 'buyTime', label: '开通时间:' },
            { key: 'endTime', label: '到期时间:' },
            { key: 'accountNum', label: '账号总数:' },
            { key: 'laveNum', label: '账号余量:' },
            { key: 'disableTime', label: '机构禁用时间:' }
        ]
        return (
            <div className='pd-wrapper'>
                {cp && !ncp ? (
                    <div className='product-detail'>
                        <div className='product-detail-title'>
                            {cp.productName}
                        </div>
                        <Item
                            key={config[0].key}
                            label={config[0].label}
                            value={cp.buyTime}
                        />
                        <Item
                            key={config[2].key}
                            label={config[2].label}
                            value={cp.accountNum}
                        />
                        <Item
                            key={config[3].key}
                            label={config[3].label}
                            value={cp.laveNum}
                        >
                            {cp.outrideNum > 0 && (
                                <span className='pd-span-over'>{`(已超出${
                                    cp.outrideNum
                                })`}</span>
                            )}
                        </Item>
                        {cp.endTime
                            && cp.outrideNum > 0 && (
                            <Item
                                key={config[4].key}
                                label={config[4].label}
                                value={cp.endTime}
                            >
                                {hadExtensionAuthority && (
                                    <Button
                                        onClick={this.props.showModal}
                                        size='small'
                                        type='primary'
                                    >
                                            延期
                                    </Button>
                                )}
                            </Item>
                        )}
                    </div>
                ) : !ncp ? (
                    <div className='product-detail-no'>未购买智能测评</div>
                ) : null}

                {ncp && (
                    <div className='product-detail'>
                        <div className='product-detail-title'>
                            {ncp.productName}
                        </div>
                        <Item
                            key={config[0].key}
                            label={config[0].label}
                            value={ncp.buyTime}
                        />
                        <Item
                            key={config[1].key}
                            label={config[1].label}
                            value={ncp.endTime}
                        />
                    </div>
                )}

                {t ? (
                    <div className='product-detail'>
                        <div className='product-detail-title'>
                            {t.productName}
                        </div>
                        <Item
                            key={config[0].key}
                            label={config[0].label}
                            value={t.buyTime}
                        />
                        <Item
                            key={config[1].key}
                            label={config[1].label}
                            value={t.endTime}
                        />
                        <Item
                            key={config[2].key}
                            label={config[2].label}
                            value={t.accountNum}
                        />
                        <Item
                            key={config[3].key}
                            label={config[3].label}
                            value={t.laveNum}
                        />
                    </div>
                ) : (
                    <div className='product-detail-no'>未购买教学服务</div>
                )}

                {this.props.children}
            </div>
        )
    }
}

@inject('OrganizationStore')
@observer
export default class ProductInfo extends Component {
    constructor(props) {
        super(props)
        let permissionList = Storage.get('permissionList') || []
        this.state = {
            visible: false,
            loading: false,
            hadExtensionAuthority: permissionList.indexOf(60004) >= 0 || false
        }
    }
    componentDidMount() {
        this.setState({ loading: true })
        this.loadingProductInfo()
    }
    componentWillUnmount() {
        this.props.OrganizationStore.clearProductInfo()
    }
    loadingProductInfo = () => {
        const id = this.props.match.params.id
        this.props.OrganizationStore.getProductInfo(id, () => {
            this.setState({ loading: false, visible: false })
        })
    }
    showModal = () => {
        this.setState({ visible: true })
    }
    handleClose = () => {
        this.setState({ visible: false })
    }
    handleDelaySetting = params => {
        let { disableTime } = params
        if (!disableTime) {
            return null
        }
        let orgId = this.props.match.params.id
        let disabledTime = moment(disableTime).format('YYYY-MM-DD HH:mm:ss')
        G.api
            .extensionTime({ data: { orgId, disabledTime } })
            .then(data => {
                message.success('延期成功')
                this.loadingProductInfo()
            })
            .catch(e => {
                message.error(e.message)
            })
    }
    render() {
        let productInfo = this.props.OrganizationStore.productInfo
        return (
            <div className='container'>
                <div className='content'>
                    <div className='subTitle'>
                        机构管理 / 机构列表 / <span>产品信息</span>
                    </div>
                    <div className='editor'>
                        {!this.state.loading && (
                            <TextShow
                                hadExtensionAuthority={
                                    this.state.hadExtensionAuthority
                                }
                                productInfo={productInfo}
                                showModal={this.showModal}
                            >
                                <DateModalForm
                                    visible={this.state.visible}
                                    onClose={this.handleClose}
                                    onSubmit={this.handleDelaySetting}
                                />
                            </TextShow>
                        )}
                        {this.state.loading && <Spinner />}
                    </div>
                </div>
                <div className='footer'>power to go</div>
            </div>
        )
    }
}
