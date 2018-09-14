import Component from 'components/Component'
import * as mobx from 'mobx'
import { observer, inject } from 'mobx-react'
import { Row, Col, Table, Icon, Tooltip } from 'antd'
import ProModal from '../../../components/myPromotionShareModal/ProModal'
import ImgWithSave from '../../../components/img/ImgWithSave'
import ModuleLine from '../ModuleLine'
import Storage from 'libs/storage'
import './promotionDetail.scss'

export const VIDEO_CUSTOM_URL = 'https://lcdns-pic.learnta.com/'

const InfoItem = props => {
    return (
        <div className='proInfo-item'>
            <span className='proInfo-item-label'>{props.label}</span>
            <span title={props.value}>{props.value}</span>
        </div>
    )
}

class FrameItem extends Component {
    render() {
        const classnames = this.props.showHint
            ? 'title-icon-right-show'
            : 'title-icon-right-none'
        return (
            <div className='data-frame-item'>
                <div className='item-title'>
                    {this.props.title}
                    <Tooltip title={this.props.titleHint}>
                        <Icon
                            className={classnames}
                            type='exclamation-circle-o'
                        />
                    </Tooltip>
                </div>
                <div className='item-value'>{this.props.value}</div>
                <div className='item-bar' />
                <div className='item-footer'>
                    {this.props.footerTitle}
                    <span className='item-footer-value'>
                        {this.props.footerValue}
                    </span>
                </div>
            </div>
        )
    }
}

@inject('ProDetailStore')
@inject('PromotionStore')
@observer
class PromotionDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pageNo: 1,
            query: {},
            visibleModal: Storage.get('fromCreatePromotion') || false
        }
    }
    componentDidMount() {
        const id = this.props.match.params.id
        const copyQuery = Object.assign({}, { pageNo: this.state.pageNo, id })
        this.props.ProDetailStore.getPromotionDetail(copyQuery)
        this.props.PromotionStore.getWeiCode({ promotionId: id })
        Storage.del('fromCreatePromotion')
    }
    componentWillUnmount() {
        this.props.PromotionStore.delWeiCode()
        this.props.ProDetailStore.clearPromotionDetail()
    }
    get columns() {
        return [
            {
                title: '账号',
                dataIndex: 'mobile',
                key: 'mobile'
            },
            {
                title: '姓名',
                dataIndex: 'userName',
                key: 'userName'
            },
            {
                title: '付款时间',
                dataIndex: 'payTime',
                key: 'payTime',
                width: 180
            },
            {
                title: '购买内容',
                dataIndex: 'courseName',
                key: 'courseName'
            },
            {
                title: '所属版本',
                dataIndex: 'pressName',
                key: 'pressName'
            },
            {
                title: '所属年级',
                dataIndex: 'grade',
                key: 'grade'
            },
            {
                title: '金额',
                dataIndex: 'payMoney',
                key: 'payMoney'
            },
            {
                title: '我的收益',
                dataIndex: 'share',
                key: 'share'
            }
        ]
    }
    loadOrganizationList(params) {
        this.props.ProDetailStore.getPromotionDetail(params)
    }
    handleChange(value) {
        const id = this.props.match.params.id
        this.setState({ pageNo: value.current })
        const params = Object.assign({ pageNo: value.current, id })
        this.loadOrganizationList(params)
    }
    handleCloseShareModal = () => {
        this.setState({
            visibleModal: false
        })
    }
    render() {
        const {
            detailList,
            detailListTotal,
            listLoading,
            basicInformation,
            dataOverview
        } = this.props.ProDetailStore
        const { chooseImgByte } = this.props.PromotionStore
        const dataSource = mobx.toJS(detailList)
        const loadingStyle = {
            width: '40px',
            height: '40px',
            margin: '30px'
        }
        const pagination = {
            total: detailListTotal,
            current: this.state.pageNo,
            showTotal: () => `共 ${detailListTotal} 条`
        }
        const tableProps = {
            dataSource: dataSource,
            columns: this.columns,
            onChange: this.handleChange,
            pagination: pagination,
            loading: listLoading,
            locale: { emptyText: '暂无数据' }
        }
        const titleValue = [
            '本次推广专属小程序二维码',
            '本次推广专属小程序链接'
        ]
        return (
            <div className='promotionDetail-container'>
                <ModuleLine title='推广详情' />
                <div className='proInfo-container'>
                    <div className='proInfo-left'>
                        {basicInformation
                            && Object.keys(basicInformation).map(key => (
                                <InfoItem
                                    key={key}
                                    label={basicInformation[key].label}
                                    value={basicInformation[key].value}
                                />
                            ))}
                    </div>
                    <div className='proInfo-right'>
                        <ImgWithSave
                            record={basicInformation}
                            recordType='object'
                            loadingStyle={loadingStyle}
                            imgByte={chooseImgByte}
                            titleDownImg='保存'
                        />
                    </div>
                </div>
                <ModuleLine title='数据总览' />
                <div className='data-frame-container'>
                    <Row type='flex' justify='space-between'>
                        {dataOverview
                            && dataOverview.map(col => (
                                <Col span={7}>
                                    <FrameItem
                                        key={col.key}
                                        title={col.title}
                                        showHint
                                        titleHint={col.hint}
                                        value={col.total}
                                        footerTitle={col.footer}
                                        footerValue={col.yesterday}
                                    />
                                </Col>
                            ))}
                    </Row>
                </div>
                <ModuleLine title='订单列表' />
                <Table {...tableProps} />
                <ProModal
                    className='special'
                    imgByte={chooseImgByte}
                    width={600}
                    showTitle
                    title='创建成功'
                    titleDownImg='保存'
                    record={basicInformation}
                    recordType='object'
                    visible={this.state.visibleModal}
                    handleClose={this.handleCloseShareModal}
                    titleValue={titleValue}
                />
            </div>
        )
    }
}

export default PromotionDetail
