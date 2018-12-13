import AuthComponent from 'libs/AuthComponent'

import { routerShape } from 'react-router'

import FrameBox from 'widgets/FrameBox'

import MulSelect from './MulSelect'
import TextAreaForm from './TextAreaForm'
import ConnectPoint from './ConnectPoint'
import FormUpLoader from './FormUpLoader'

import { Button, Form, Radio, Input, Select, Icon, Modal, TextArea } from 'antd'

import { routePath } from 'libs/routes'
import Storage from '../../../../helpers/Storage'
import { Q_CATEGORY } from '../../../../config'
import './style.scss'

const BoxHeader = FrameBox.BoxHeader
const BoxContent = FrameBox.BoxContent

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
const RadioButton = Radio.Button

class UpdateForm extends AuthComponent {
  static contextTypes = {
    router: routerShape
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      visible: false,
      category: undefined,
      kPoint: undefined,
      warningInfo: false,
      optionChildren: []
    }
  }

  componentWillReceiveProps(nextProps) {
    const { initValue } = nextProps
    if (initValue) {
      const { category } = initValue
      this.setState({ category })
    }
  }

  validatorVideo(rule, value, callback) {
    if (Object.keys(value).length) {
      callback()
      return null
    } else {
      callback('请上传视频')
    }
  }

  handleChangeCategory = data => {
    const {
      target: { value }
    } = data
    this.setState({ category: value })
  }

  handleHistoryBack = () => {
    const { query, state } = this.props
    const { from } = query || {}
    if (from) {
      Storage.set('returnState', JSON.stringify(state))
      this.gotoPage(routePath[from], {}, query)
    } else {
      this.context.router.goBack()
    }
  }

  handleReviewBack = () => {
    this.gotoPage(routePath.VIDEO_SCHOOL)
  }

  getData = () => {
    const { form, videoId } = this.props
    let d
    form.validateFields((errors, params) => {
      if (errors) return null
      const {
        video: { medias, name },
        kPointIds,
        ...restParams
      } = params
      const kPoint = kPointIds ? [kPointIds.id || kPointIds.treeId] : []

      let data = {
        orgId: Storage.get('orgId'),
        cover: `https://lcdns-vv.learnta.com/res/${medias}?vframe/jpg/offset/2`,
        url: medias,
        fileName: name,
        kpointIds: kPoint,
        ...restParams
      }

      if (videoId || videoId === 0) {
        data.id = videoId
      }

      d = data
    })
    return d
  }

  handleOpenTextArea = () => {
    this.setState({ visible: true })
  }

  handleCloseTextArea = () => {
    this.setState({ visible: false })
  }

  handlePassConfirm = values => {
    Modal.confirm({
      title: '操作确认',
      content: '确认审核通过？',
      iconType: 'exclamation-circle',
      cancelText: '取消',
      okText: '确认',
      onOk: this.handlePass.bind(this, values)
    })
  }

  handleFail = values => {
    const {
      videoId,
      state: { list }
    } = this.props
    const data = {
      state: 2,
      id: videoId,
      ...values
    }
    api
      .reviewVideo(data)
      .then(resp => {
        this.handleCloseTextArea()
        if (list && list.length) {
          this.handleOver()
        } else {
          this.gotoPage(routePath.VIDEO_PENDING_REVIEW)
        }
      })
      .catch(err => console.log(err))
  }

  handlePass = () => {
    const {
      videoId,
      state: { list }
    } = this.props

    const data = {
      state: 3,
      id: videoId
    }
    api
      .reviewVideo(data)
      .then(resp => {
        if (list && list.length) {
          this.handleOver()
        } else {
          this.gotoPage(routePath.VIDEO_PENDING_REVIEW)
        }
      })
      .catch(err => console.log(err))
  }

  handleOver = () => {
    const {
      state: { list, showType },
      query
    } = this.props

    if (list.length) {
      const copyList = list.slice()
      const next = copyList.shift()

      const state = {
        list: copyList,
        showType
      }

      const route = routePath.VIDEO_REVIEW.replace(':videoId', next.id).replace(
        ':videoSource',
        next.videoSource
      )
      this.gotoPage(route, {}, query, state)
    } else {
      this.gotoPage(routePath.VIDEO_PENDING_REVIEW)
    }
  }

  render() {
    const { title, form, isSuper, isSuperRight, initValue, state } = this.props
    const { list } = state

    let initCategory
    let initRemark = ''
    let initDefinedTags = []
    let initVideo = {}
    let initPoint
    if (initValue) {
      const {
        category,
        remark,
        userDefinedTags,
        fileName,
        url,
        kpoint
      } = initValue
      initCategory = category
      initRemark = remark
      initDefinedTags = userDefinedTags
      initVideo = { name: fileName, medias: url }
      initPoint = kpoint ? kpoint[0] : undefined
    }

    const {
      category,
      optionChildren,
      warningInfo,
      kPoint,
      visible
    } = this.state

    const { getFieldDecorator } = form

    const layout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 18 }
    }

    const marginLeft = { marginLeft: 10 }
    const selStyle = { width: 250 }

    const mimeType = ['video/mp4', 'video/quicktime']

    return (
      <FrameBox>
        <BoxHeader>
          <Button
            className='self-left-back'
            size='large'
            type='default'
            onClick={this.handleHistoryBack}
          >
            <Icon type='left' />
            返回
          </Button>

          <h4 className='storeHead'>{title}</h4>
        </BoxHeader>
        <div className='quesForm'>
          <Form className='table-bordered'>
            <div className='formStyle'>
              <FormItem {...layout} label='学科'>
                {getFieldDecorator('category', {
                  initialValue: initCategory,
                  rules: [{ required: true, message: '请选择一门学科' }]
                })(
                  <RadioGroup onChange={this.handleChangeCategory}>
                    <RadioButton value={Q_CATEGORY.MATH}>数学</RadioButton>
                    <RadioButton value={Q_CATEGORY.ENGLISH}>英语</RadioButton>
                  </RadioGroup>
                )}
              </FormItem>

              <FormItem {...layout} label='视频名称'>
                {getFieldDecorator('video', {
                  initialValue: initVideo,
                  rules: [
                    { required: true, message: '请上传视频' },
                    { validator: this.validatorVideo }
                  ]
                })(<FormUpLoader mimeType={mimeType} />)}
              </FormItem>

              <FormItem
                {...layout}
                className='defaultFormItem'
                label={<span className='defaultLabel'>备注</span>}
              >
                {getFieldDecorator('remark', {
                  initialValue: initRemark
                })(<Input style={selStyle} placeholder=' 请输入备注' />)}
              </FormItem>

              <FormItem
                {...layout}
                className='defaultFormItem'
                label={<span className='defaultLabel'>自定义标签</span>}
              >
                {getFieldDecorator('userDefinedTags', {
                  initialValue: initDefinedTags
                })(<MulSelect warningInfo={warningInfo} />)}
              </FormItem>

              <FormItem
                {...layout}
                className='defaultFormItem'
                label='关联知识点'
              >
                {getFieldDecorator('kPointIds', { initialValue: initPoint })(
                  <ConnectPoint
                    category={category}
                    handleOpenTree={this.handleOpenTree}
                  />
                )}
              </FormItem>
            </div>
          </Form>

          <div className='fixFooter'>
            <div className='addBtn'>
              <Button style={marginLeft} onClick={this.handleOpenTextArea}>
                审核不通过
              </Button>
              <Button type='primary' onClick={this.handlePassConfirm}>
                审核通过
              </Button>
              {list ? (
                <Button style={marginLeft} onClick={this.handleOver}>
                  跳过
                </Button>
              ) : null}
            </div>
          </div>
        </div>

        {visible ? (
          <TextAreaForm
            key='ModalForm'
            visible={visible}
            title='不通过理由'
            onClose={this.handleCloseTextArea}
            onSubmit={this.handleFail}
          />
        ) : null}
      </FrameBox>
    )
  }
}

export default Form.create()(UpdateForm)
