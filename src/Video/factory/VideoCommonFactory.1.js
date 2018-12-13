import AuthComponent from 'libs/AuthComponent'

import Storage from 'helpers/Storage'
import { routerShape } from 'react-router'

import FrameBox from 'widgets/FrameBox'
import Preview from 'widgets/Preview/Preview'
import BaseSelect from 'widgets/Layout/BaseSelect'
import GearBox from 'widgets/QuestionCard/GearBox'
import SelectGroup from 'widgets/Layout/SelectGroup'

import ListCard from '../component/ListCard'
import IconCircle from '../component/IconCircle'
import SwitchOfList from '../component/SwitchOfList'

import { Pagination, Tabs, Table, Modal } from 'antd'

const BoxHeader = FrameBox.BoxHeader
const BoxContent = FrameBox.BoxContent

const TabPane = Tabs.TabPane

import { routePath } from 'libs/routes'
import { FILTER_VIDEO, STATUS_VIDEO } from '../../../config'

export const Title = props => <div className={props.classes}>{props.name}</div>

const factory = data => {
  const { currentKey: curKey } = data

  class VideoBase extends AuthComponent {
    static contextTypes = {
      router: routerShape
    }

    constructor(props, context) {
      super(props, context)
      this.state = {
        loading: false,

        count: 0,
        current: 1,
        pageSize: 10,

        videos: [],
        tagList: [],
        createList: [],

        selectData: {},
        filterData: {},

        showType: 'card',
        currentKey: curKey,

        url: '',
        fileName: '',
        preview: false
      }
      this.searchFn = this.searchFn.bind(this)
      this.onSizeChange = this.onSizeChange.bind(this)
      this.handleSelect = this.handleSelect.bind(this)
      this.handleDelete = this.handleDelete.bind(this)
      this.handleEditVideo = this.handleEditVideo.bind(this)
      this.handleTabChange = this.handleTabChange.bind(this)
      this.historyToCreate = this.historyToCreate.bind(this)
      this.handlePageChange = this.handlePageChange.bind(this)
      this.handleOpenPreview = this.handleOpenPreview.bind(this)
      this.handleClosePreview = this.handleClosePreview.bind(this)
      this.handleRedirectToCard = this.handleRedirectToCard.bind(this)
      this.handleRedirectToTable = this.handleRedirectToTable.bind(this)
    }

    componentDidMount() {
      const { location } = this.props
      const { query } = location || {}
      const { from, showType } = query || {}
      if (from === 'mine') {
        this.setState({ showType })
      } else if (from === 'school') {
        this.setState({ showType })
      } else {
        this.setState({})
      }

      this.getVideoList()
      this.getLabelList()
      // this.getCreateList()
    }

    // 页面跳转
    handleTabChange(key) {
      if (key === 'mine') {
        this.gotoPage(routePath.VIDEO_PERSONAL)
      } else if (key === 'school') {
        this.gotoPage(routePath.VIDEO_SCHOOL)
      }
    }

    getVideoList(data = {}) {
      this.setState({ loading: true })
      const { currentKey } = this.state
      let params = {
        page: 1,
        pageSize: 10,
        orgId: Storage.get('orgId') || 1000050,
        isOwn: currentKey === 'mine' ? 0 : 1
      }
      Object.keys(data).forEach(key => {
        if (data[key] || data[key === 0]) params[key] = data[key]
      })
      api
        .fetchVideoList({ params: { listType: 1 }, data: params })
        .then(resp => {
          const { count } = resp
          let { items } = resp
          items.forEach(item => (item.key = item.id))
          this.setState({
            count,
            loading: false,
            videos: items
          })
        })
        .catch(err => console.log(err))
    }

    getLabelList() {
      api
        .fetchVideoLabelList()
        .then(resp => {
          const res = resp
          const list = []
          res.forEach(r => {
            list.push({
              value: r,
              text: r
            })
          })
          this.setState({ tagList: list })
        })
        .catch(err => console.log(err))
    }

    getCreateList() {
      api
        .fetchVideoCreateList()
        .then(resp => {
          console.log(resp)
        })
        .catch(err => console.log(err))
    }

    get columns() {
      return [
        {
          title: '视频ID',
          dataIndex: 'id',
          key: 'id'
        },
        {
          title: '创建时间',
          dataIndex: 'time',
          key: 'time'
        },
        {
          title: '视频名称',
          dataIndex: 'fileName',
          key: 'fileName'
        },
        {
          title: '知识点关联',
          dataIndex: 'connect',
          key: 'connect'
        },
        {
          title: '自定义标签',
          dataIndex: 'selfLabel',
          key: 'selfLabel'
        },
        {
          title: '审核状态',
          dataIndex: 'state',
          key: 'state',
          render: (text, record) => {
            let stateText
            if (text || text === 0) {
              stateText = STATUS_VIDEO[text + 1].text
            }
            let bcg = ''
            switch (text) {
              case 0:
                bcg = '#2c5b8f'
                break
              case 1:
                bcg = '#FF9E16'
                break
              case 2:
                bcg = '#FF591A'
                break
              case 3:
                bcg = '#77BC2B'
                break
            }

            return (
              <div>
                <IconCircle size={10} bcg={bcg} />
                <span>{stateText}</span>
              </div>
            )
          }
        },
        {
          title: '创建人',
          dataIndex: 'creatorName',
          key: 'creatorName'
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          className: 'td-action',
          render: (text, record) => {
            return (
              <div className='table-method'>
                <span onClick={this.handleOpenPreview.bind(this, record)}>
                  预览
                </span>
                <span onClick={null}>审核</span>
                <span onClick={this.handleEditVideo.bind(this, record)}>
                  编辑
                </span>
                <span onClick={this.handleDelete.bind(this, record)}>删除</span>
              </div>
            )
          }
        }
      ]
    }

    get searchMessage() {
      let { currentKey, createList, tagList } = this.state
      let item = [
        {
          type: 'select',
          label: '创建人',
          key: 'createByName',
          class: 'update-state',
          errorMessage: '',
          params: [
            {
              value: '',
              text: '全部'
            },
            ...createList
          ],
          defaultValue: ''
        }
      ]
      let selectList = [
        {
          type: 'select',
          label: '视频状态',
          key: 'state',
          placeholder: '请输入视频状态',
          class: 'update-state',
          errorMessage: '',
          params: STATUS_VIDEO,
          defaultValue: ''
        },
        {
          type: 'select',
          label: '知识点关联状态',
          key: 'isRelaKPoint',
          class: 'update-state',
          errorMessage: '',
          params: [
            {
              value: '',
              text: '全部'
            },
            {
              value: '0',
              text: '尚未关联知识点'
            },
            {
              value: '1',
              text: '已关联知识点'
            }
          ],
          defaultValue: ''
        },
        {
          type: 'select',
          label: '自定义标签',
          key: 'userDefinedTag',
          class: 'update-state',
          errorMessage: '',
          params: [
            {
              value: '',
              text: '全部'
            },
            ...tagList
          ],
          defaultValue: ''
        }
      ]
      let inputList = [
        {
          type: 'input',
          label: '',
          key: 'videoKeyName',
          placeholder: '按视频关键词搜索',
          errorMessage: ''
        },
        {
          type: 'input',
          label: '',
          key: 'id',
          placeholder: '按视频ID词搜索',
          errorMessage: ''
        },
        {
          type: 'input',
          label: '',
          key: 'kPointKeyName',
          placeholder: '知识点关键词搜索',
          errorMessage: ''
        }
      ]
      if (currentKey === 'school') selectList = selectList.concat(item)
      inputList = selectList.concat(inputList)
      return inputList
    }

    historyToCreate() {
      const { showType } = this.state
      const query = {
        from: 'mine',
        showType
      }
      this.gotoPage(routePath.VIDEO_CREATE, {}, query)
    }

    handleEditVideo({ videoSource, id } = { videoSource: '', id: '' }) {
      const { showType } = this.state
      const query = {
        from: 'mine',
        showType
      }
      const route = routePath.VIDEO_EDIT.replace(':videoId', id).replace(
        ':videoSource',
        videoSource
      )
      this.gotoPage(route, {}, query)
    }

    // 列表业务
    handleClosePreview() {
      this.setState({ preview: false, url: '', fileName: '' })
    }

    handleOpenPreview({ url, fileName } = { url: '', fileName: '' }) {
      this.setState({ preview: true, url, fileName })
    }

    handleDelete({ id } = { id: '' }) {
      Modal.confirm({
        title: '确认操作',
        content: '确认删除该视频？删除后视频会进入回收站。',
        okText: '确认',
        cancelText: '取消',
        onOk: this.handleDeleteVideo.bind(this, id)
      })
    }

    handleDeleteVideo(id) {
      console.log(id)
    }

    // 列表显示方式
    handleRedirectToCard() {
      const { showType } = this.state
      if (showType === 'card') return
      this.setState({
        showType: 'card'
      })
    }

    handleRedirectToTable() {
      const { showType } = this.state
      if (showType === 'table') return
      this.setState({
        showType: 'table'
      })
    }

    // 页吗
    handlePageChange(page) {
      let { filterData, selectData } = this.state
      let params = {
        pageNo: page,
        ...selectData,
        ...filterData
      }
      this.getVideoList(params)
      this.setState({ current: page })
    }

    onSizeChange(page, pageSize) {
      let { filterData, selectData } = this.state
      let params = {
        pageNo: 1,
        pageSize: pageSize,
        ...selectData,
        ...filterData
      }
      this.getVideoList(params)
      this.setState({ current: 1, pageSize: pageSize })
    }

    // 搜索
    handleSelect(data) {
      let { selectData } = this.state
      let params = {}
      params.pageNo = 1
      params.pageSize = 10
      params = { ...params, ...selectData, ...data }
      this.setState({ filterData: data })
      this.getVideoList(params)
    }

    searchFn(values) {
      let { filterData } = this.state
      let params = { ...values, ...filterData }
      this.getVideoList(params)
      this.setState({ selectData: values })
    }

    render() {
      const {
        loading,
        videos,
        showType,
        count,
        current,
        preview,
        url,
        fileName,
        currentKey
      } = this.state
      const listDisplay = showType === 'card'
      const clsTable =
        showType === 'card' ? 'selfTable displayNone' : 'selfTable'

      const PreviewTitle = (
        <Title
          name={
            fileName.length > 50 ? fileName.substring(0, 50) + '...' : fileName
          }
          classes={'previewTitle'}
        />
      )

      return (
        <FrameBox>
          <GearBox content='添加视频' handleClick={this.historyToCreate} />
          <BoxHeader>
            <h4 className='storeHead'>全部视频</h4>
          </BoxHeader>
          <BoxContent>
            <Tabs defaultActiveKey={currentKey} onChange={this.handleTabChange}>
              <TabPane tab='我的题目' key='mine' />
              <TabPane tab='学校题目' key='school' />
            </Tabs>
            <BaseSelect
              listData={FILTER_VIDEO}
              handleSelect={this.handleSelect}
            />

            <div className='pSelect'>
              <SelectGroup
                searchMessage={this.searchMessage}
                searchFn={this.searchFn}
              />
            </div>

            <SwitchOfList
              showType={showType}
              handleRedirectToCard={this.handleRedirectToCard}
              handleRedirectToTable={this.handleRedirectToTable}
            />

            <ListCard
              data={videos}
              loading={loading}
              display={listDisplay}
              handleDelete={this.handleDelete}
              handleEditVideo={this.handleEditVideo}
              handleOpenPreview={this.handleOpenPreview}
            />

            <Table
              className={clsTable}
              bordered
              dataSource={videos}
              columns={this.columns}
              pagination={null}
              loading={loading}
            />

            <div className='pageFooter'>
              {videos.length ? (
                <Pagination
                  showQuickJumper
                  showSizeChanger
                  showTotal={() => `共 ${count} 条`}
                  onChange={this.handlePageChange}
                  onShowSizeChange={this.onSizeChange}
                  current={current}
                  total={count}
                />
              ) : null}
            </div>
            {/* </Tabs> */}
            {/* <TabPane tab='我的题目' key='mine'> */}
            {/* <BaseSelect
                  listData={FILTER_VIDEO}
                  handleSelect={this.handleSelect}
                />

                <div className='pSelect'>
                  <SelectGroup
                    searchMessage={this.searchMessage}
                    searchFn={this.searchFn}
                  />
                </div>

                <SwitchOfList
                  showType={showType}
                  handleRedirectToCard={this.handleRedirectToCard}
                  handleRedirectToTable={this.handleRedirectToTable}
                />

                <ListCard
                  data={videos}
                  display={listDisplay}
                  handleDelete={this.handleDelete}
                  handleEditVideo={this.handleEditVideo}
                  handleOpenPreview={this.handleOpenPreview}
                />

                <Table
                  className={clsTable}
                  bordered
                  dataSource={videos}
                  columns={this.columns}
                  pagination={null}
                />

                <div className='pageFooter'>
                  {videos.length ? (
                    <Pagination
                      showQuickJumper
                      showSizeChanger
                      showTotal={() => `共 ${count} 条`}
                      onChange={this.handlePageChange}
                      onShowSizeChange={this.onSizeChange}
                      current={current}
                      total={count}
                    />
                  ) : null}
                </div> */}
            {/* </TabPane> */}
            {/* <TabPane tab='学校题目' key='school'> */}
            {/* <BaseSelect
                  listData={FILTER_VIDEO}
                  handleSelect={this.handleSelect}
                />

                <div className='pSelect'>
                  <SelectGroup
                    searchMessage={this.searchMessage}
                    searchFn={this.searchFn}
                  />
                </div>

                <SwitchOfList
                  showType={showType}
                  handleRedirectToCard={this.handleRedirectToCard}
                  handleRedirectToTable={this.handleRedirectToTable}
                />

                <ListCard
                  data={videos}
                  display={listDisplay}
                  handleDelete={this.handleDelete}
                  handleEditVideo={this.handleEditVideo}
                  handleOpenPreview={this.handleOpenPreview}
                />

                <Table
                  className={clsTable}
                  bordered
                  dataSource={videos}
                  columns={this.columns}
                  pagination={null}
                />

                <div className='pageFooter'>
                  {videos.length ? (
                    <Pagination
                      showQuickJumper
                      showSizeChanger
                      showTotal={() => `共 ${count} 条`}
                      onChange={this.handlePageChange}
                      onShowSizeChange={this.onSizeChange}
                      current={current}
                      total={count}
                    />
                  ) : null}
                </div> */}
            {/* </TabPane> */}
            {preview && url && (
              <Preview
                type='video'
                data={url}
                title={PreviewTitle}
                onCancel={this.handleClosePreview}
              />
            )}
          </BoxContent>
        </FrameBox>
      )
    }
  }

  return VideoBase
}

export default factory
