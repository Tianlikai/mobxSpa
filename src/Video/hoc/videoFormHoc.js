import AuthComponent from 'libs/AuthComponent'
import { routePath } from 'libs/routes'

import { routerShape } from 'react-router'

import FrameBox from 'widgets/FrameBox'
import MulSelect from '../component/MulSelect'
import ConnectPoint from '../component/ConnectPoint'
import FormUpLoader from '../component/FormUpLoader'

import { Button, Form, Radio, Input, Select, message } from 'antd'

import Storage from '../../../helpers/Storage'
import { Q_CATEGORY } from '../../../config'

const BoxHeader = FrameBox.BoxHeader
const BoxContent = FrameBox.BoxContent

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
const RadioButton = Radio.Button

const videoFormHoc = config => {
  const { TopMethod, PromptReason, FixedFooter } = config || {}

  class BaseForm extends AuthComponent {
    static contextTypes = {
      router: routerShape
    }

    constructor(props, context) {
      super(props, context)
      this.state = {
        category: undefined,
        kPoint: undefined,
        warningInfo: false
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
      const len = Object.keys(value).length
      if (!len) return callback('请上传视频')
      const { name, medias } = value
      if (!name || !medias) return callback('请上传视频')
      callback()
      return null
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

    render() {
      const {
        query,
        videoId,
        title,
        form,
        isSuperRight,
        initValue,
        videoSource,
        state: { list, showType }
      } = this.props

      let initCategory
      let initRemark = ''
      let initDefinedTags = []
      let initVideo = {}
      let initPoint
      let errHint
      let STATE = 0

      if (initValue) {
        const {
          category,
          remark,
          userDefinedTags,
          fileName,
          url,
          kpoint,
          reason,
          state
        } = initValue
        initCategory = category
        initRemark = remark
        initDefinedTags = userDefinedTags
        initVideo = { name: fileName, medias: url }
        initPoint = kpoint ? kpoint[0] : undefined
        errHint = reason
        STATE = state
      }

      const { category, optionChildren, warningInfo, kPoint } = this.state

      const { getFieldDecorator } = form

      const layout = {
        labelCol: { span: 3 },
        wrapperCol: { span: 18 }
      }

      const selStyle = { width: 250 }

      const mimeType = ['video/mp4', 'video/quicktime']
      return (
        <FrameBox>
          {TopMethod ? (
            <TopMethod
              title={title}
              STATE={STATE}
              videoSource={videoSource}
              isSuperRight={isSuperRight}
              getData={this.getData}
              handleHistoryBack={this.handleHistoryBack}
            />
          ) : null}
          <div className='quesForm'>
            {PromptReason ? <PromptReason errHint={errHint} /> : null}
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

                <FormItem {...layout} className='defaultFormItem' label='备注'>
                  {getFieldDecorator('remark', {
                    initialValue: initRemark
                  })(<Input style={selStyle} placeholder=' 请输入备注' />)}
                </FormItem>

                <FormItem
                  {...layout}
                  className='defaultFormItem'
                  label='自定义标签'
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
                    <ConnectPoint category={category} />
                  )}
                </FormItem>
              </div>
            </Form>

            {FixedFooter ? (
              <FixedFooter
                list={list}
                query={query}
                videoId={videoId}
                showType={showType}
                videoSource={videoSource}
                getData={this.getData}
                handleHistoryBack={this.handleHistoryBack}
              />
            ) : null}
          </div>
        </FrameBox>
      )
    }
  }
  return Form.create()(BaseForm)
}

export default videoFormHoc
