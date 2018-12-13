import AuthComponent from 'libs/AuthComponent'

import { routerShape } from 'react-router'

import FrameBox from 'widgets/FrameBox'
import Prompt from 'widgets/QuestionCard/Prompt'

import MulSelect from './MulSelect'
import ConnectPoint from './ConnectPoint'
import FormUpLoader from './FormUpLoader'

import { Button, Form, Radio, Input, Select, Icon, Modal } from 'antd'

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

class ModifyForm extends AuthComponent {
  static contextTypes = {
    router: routerShape
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
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
    this.gotoPage(routePath.VIDEO_PENDING_MODIFY)
  }

  getData = () => {
    const { form, videoId } = this.props
    let d
    form.validateFields((errors, params) => {
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

  handleSave = () => {
    const params = this.getData()
    if (!params) return null
    const data = { state: 0, ...params }
    api
      .videoSaveQuestion(data)
      .then(resp => {
        this.handleHistoryBack()
      })
      .catch(() => {
        console.log('wrong')
      })
  }

  handleReview = () => {
    const params = this.getData()
    if (!params) return null
    const data = { state: 1, ...params }
    api
      .videoSaveQuestion(data)
      .then(resp => {
        this.handleReviewBack()
      })
      .catch(() => {
        console.log('wrong')
      })
  }

  handlePush = () => {
    const params = this.getData()
    if (!params) return null
    api
      .videoPush(params)
      .then(resp => {
        this.handleReviewBack()
      })
      .catch(() => {
        console.log('wrong')
      })
  }

  render() {
    const { title, form, isSuperRight, initValue } = this.props

    let initCategory
    let initRemark = ''
    let initDefinedTags = []
    let initVideo = {}
    let initPoint
    let errHint
    if (initValue) {
      const {
        category,
        remark,
        userDefinedTags,
        fileName,
        url,
        kpoint,
        reason
      } = initValue
      initCategory = category
      initRemark = remark
      initDefinedTags = userDefinedTags
      initVideo = { name: fileName, medias: url }
      initPoint = kpoint ? kpoint[0] : undefined
      errHint = reason
    }
    const { category, optionChildren, warningInfo, kPoint } = this.state

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

          {isSuperRight ? (
            <Button
              className='self-right-submit'
              size='large'
              type='primary'
              onClick={this.handlePush}
            >
              发布
            </Button>
          ) : (
            <Button
              className='self-right-submit'
              size='large'
              type='primary'
              onClick={this.handleReview}
            >
              提交审核
            </Button>
          )}
        </BoxHeader>
        <div className='quesForm'>
          {errHint ? (
            <Prompt status='warning'>
              不通过原因：{errHint || '题目答案错误，需修改'}
            </Prompt>
          ) : null}
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
              <Button style={marginLeft} onClick={this.handleHistoryBack}>
                取消
              </Button>
              <Button type='primary' onClick={this.handleSave}>
                保存并退出
              </Button>
            </div>
          </div>
        </div>
      </FrameBox>
    )
  }
}

export default Form.create()(ModifyForm)
