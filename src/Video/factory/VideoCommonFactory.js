import AuthComponent from 'libs/AuthComponent'

import { routerShape } from 'react-router'

import FrameBox from 'widgets/FrameBox'
import Preview from 'widgets/Preview/Preview'
import GearBox from 'widgets/QuestionCard/GearBox'
import SelectPoints from 'widgets/QuestionCard/SelectPoints'

import SwitchOfList from '../component/SwitchOfList'

import { Pagination, Modal, message } from 'antd'

const BoxHeader = FrameBox.BoxHeader
const BoxContent = FrameBox.BoxContent

import { routePath } from 'libs/routes'
import Storage from '../../../helpers/Storage'
import { FILTER_VIDEO, STATUS_VIDEO } from '../../../config'

export const Title = props => <div className={props.classes}>{props.name}</div>

const factory = data => {
  const {
    key,
    title,
    currentKey: curKey,
    Select,
    SearchGroup,
    NavTabs,
    TableWithHeader,
    fetchVideoList,
    route: ROUTE
  } = data

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
        selectedVideos: [],

        selectData: {},
        filterData: {},

        showType: 'card',
        currentKey: curKey,

        url: '',
        fileName: '',
        preview: false,

        id: null,
        isTree: false,
        category: null
      }
      this.searchFn = this.searchFn.bind(this)
      this.onSizeChange = this.onSizeChange.bind(this)
      this.handleSelect = this.handleSelect.bind(this)
      this.handleDelete = this.handleDelete.bind(this)
      this.handleReBack = this.handleReBack.bind(this)
      this.handleReview = this.handleReview.bind(this)
      this.handleConnect = this.handleConnect.bind(this)
      this.handleEditVideo = this.handleEditVideo.bind(this)
      this.handleTabChange = this.handleTabChange.bind(this)
      this.historyToCreate = this.historyToCreate.bind(this)
      this.historyToPreview = this.historyToPreview.bind(this)
      this.handlePageChange = this.handlePageChange.bind(this)
      this.handleOpenConnect = this.handleOpenConnect.bind(this)
      this.handleOpenPreview = this.handleOpenPreview.bind(this)
      this.handleModifyVideo = this.handleModifyVideo.bind(this)
      this.handleSelectChange = this.handleSelectChange.bind(this)
      this.handleClosePreview = this.handleClosePreview.bind(this)
      this.handleRedirectToCard = this.handleRedirectToCard.bind(this)
      this.handleRedirectToTable = this.handleRedirectToTable.bind(this)
    }

    componentDidMount() {
      const { location } = this.props
      const { query } = location || {}
      const { from } = query || {}
      const returnState = Storage.get('returnState')
      if (from && returnState) {
        const data = JSON.parse(returnState)
        const { showType, pageSize, current, filterData, selectData } = data
        const params = {
          showType,
          pageSize,
          pageNo: current || 1,
          ...filterData,
          ...selectData
        }
        this.setState({
          showType: showType || 'card',
          pageSize: pageSize || 10,
          current: current || 1,
          filterData,
          selectData
        })
        Storage.set('returnState', null)
        this[fetchVideoList](params)
        return null
      }
      this[fetchVideoList]()
    }

    getVideoList(data = {}, listType = 1) {
      this.setState({ loading: true })
      const { currentKey } = this.state
      let params = {
        pageNo: 1,
        pageSize: 10,
        orgId: Storage.get('orgId') || 1000050,
        isOwn: currentKey === 'mine' ? 0 : 1
      }
      Object.keys(data).forEach(key => {
        if (data[key] || data[key === 0]) params[key] = data[key]
      })
      api
        .fetchVideoList({ params: { listType: listType }, data: params })
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

    getPendingVideoList(data = {}, listType = 2) {
      this.setState({ loading: true })
      let params = {
        page: 1,
        pageSize: 10,
        orgId: Storage.get('orgId') || 1000050
      }
      Object.keys(data).forEach(key => {
        if (data[key] || data[key === 0]) params[key] = data[key]
      })
      api
        .fetchVideoList({ params: { listType: listType }, data: params })
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

    getNoConnectList(data = {}) {
      this.setState({ loading: true })
      let params = {
        page: 1,
        pageSize: 10,
        orgId: Storage.get('orgId') || 1000050
      }
      Object.keys(data).forEach(key => {
        if (data[key] || data[key === 0]) params[key] = data[key]
      })
      api
        .fetchNoConnectVideoList({ data: params })
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

    getRecycleBinList(data = {}) {
      this.setState({ loading: true })
      const { currentKey } = this.state
      const listType = currentKey === 'mine' ? 1 : 2
      let params = {
        page: 1,
        pageSize: 10,
        orgId: Storage.get('orgId') || 1000050
      }
      Object.keys(data).forEach(key => {
        if (data[key] || data[key === 0]) params[key] = data[key]
      })
      api
        .fetchRecycleBinVideoList({ params: { listType }, data: params })
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

    // 页面跳转
    handleTabChange(key) {
      this.gotoPage(key)
    }

    // 视频编辑
    historyToCreate() {
      const { showType } = this.state
      const query = {
        from: ROUTE
      }
      const state = {
        showType
      }
      this.gotoPage(routePath.VIDEO_CREATE, {}, query, state)
    }

    handleEditVideo({ videoSource, id } = { videoSource: '', id: '' }) {
      const { showType, current, pageSize, selectData, filterData } = this.state
      const query = {
        from: ROUTE
      }
      const state = {
        showType,
        current,
        pageSize,
        selectData,
        filterData
      }
      const route = routePath.VIDEO_EDIT.replace(':videoId', id).replace(
        ':videoSource',
        videoSource
      )
      this.gotoPage(route, {}, query, state)
    }

    handleModifyVideo({ videoSource, id } = { videoSource: '', id: '' }) {
      const { showType, current, pageSize, selectData, filterData } = this.state
      const query = {
        from: ROUTE
      }
      const state = {
        showType,
        current,
        pageSize,
        selectData,
        filterData
      }
      const route = routePath.VIDEO_MODIFY.replace(':videoId', id).replace(
        ':videoSource',
        videoSource
      )
      this.gotoPage(route, {}, query, state)
    }

    historyToPreview() {
      const { showType, selectedVideos, videos } = this.state

      if (!selectedVideos.length) {
        return Modal.info({ title: '请选择视频' })
      }

      const list = selectedVideos.map(id => {
        const resp = videos.find(item => item.id === id)
        if (resp) return resp
      })

      const first = list.shift()

      const query = {
        from: ROUTE
      }

      const state = {
        list,
        showType
      }
      const route = routePath.VIDEO_REVIEW.replace(
        ':videoId',
        first.id
      ).replace(':videoSource', first.videoSource)
      this.gotoPage(route, {}, query, state)
    }

    handleReview({ videoSource, id } = { videoSource: '', id: '' }) {
      const { showType, current, pageSize, selectData, filterData } = this.state
      const query = {
        from: ROUTE
      }
      debugger
      const state = {
        showType,
        current,
        pageSize,
        selectData,
        filterData
      }
      const route = routePath.VIDEO_REVIEW.replace(':videoId', id).replace(
        ':videoSource',
        videoSource
      )
      this.gotoPage(route, {}, query, state)
    }

    // 列表业务
    handleClosePreview() {
      this.setState({ preview: false, url: '', fileName: '' })
    }

    handleOpenPreview({ url, fileName } = { url: '', fileName: '' }) {
      this.setState({ preview: true, url, fileName })
    }

    handleSelectChange(selectedRowKeys) {
      this.setState({ selectedVideos: selectedRowKeys })
    }

    handleDelete({ id, videoSource } = { id: '', videoSource: '' }) {
      Modal.confirm({
        title: '确认操作',
        content: '确认删除该视频？删除后视频会进入回收站。',
        okText: '确认',
        cancelText: '取消',
        onOk: this.handleDeleteVideo.bind(this, id, videoSource)
      })
    }

    handleReBack(
      { id, videoSource, hint } = { id: '', videoSource: '', hint: '' }
    ) {
      Modal.confirm({
        title: '确认操作',
        content: hint,
        okText: '确认',
        cancelText: '取消',
        onOk: this.handleReBackVideo.bind(this, id, videoSource)
      })
    }

    handleHideTree = () => {
      this.setState({
        isTree: false,
        category: null
      })
    }

    handleOpenConnect = record => {
      const { category: ca, id } = record

      if (ca || ca === 0) {
        this.setState({
          isTree: true,
          category: ca,
          id: id
        })
        return null
      }

      const { showType, selectedVideos, videos } = this.state

      if (!selectedVideos.length) {
        return Modal.info({ title: '请选择视频' })
      }

      const list = selectedVideos.map(id => {
        const resp = videos.find(item => item.id === id)
        if (resp) return resp.category
      })

      const set = new Set([...list])

      if (set.size > 1) {
        return message.warning('跨学科内容无法关联同一个知识点')
      } else {
        this.setState({
          isTree: true,
          category: Array.from(set)[0]
        })
      }
    }

    handleConnect = point => {
      const { selectedVideos, id } = this.state
      const kpointIds = point ? [point.id || point.treeId] : []
      let data = { kpointIds }

      if (id || id === 0) {
        data.videoId = [id]
      } else {
        data.videoId = selectedVideos
      }

      api
        .connectVideoPoint(data)
        .then(resp => {
          const { current, pageSize, filterData, selectData } = this.state
          const params = {
            pageSize,
            pageNo: current,
            ...selectData,
            ...filterData
          }
          this.setState({
            id: null,
            isTree: false,
            category: null,
            selectedVideos: []
          })
          message.success('关联成功')
          this[fetchVideoList](params)
        })
        .catch(err => {
          console.log(err)
        })
    }

    handleDeleteVideo(id, videoSource) {
      api
        .deleteVideoById({
          videoId: id,
          videoSource
        })
        .then(resp => {
          const { current, pageSize, filterData, selectData } = this.state
          const params = {
            pageSize,
            pageNo: current,
            ...selectData,
            ...filterData
          }
          this[fetchVideoList](params)
          message.success('视频删除成功')
        })
        .catch(() => {
          message.error('视频删除失败')
        })
    }

    handleReBackVideo(id, videoSource) {
      api
        .reBackVideoById({
          videoId: id,
          videoSource
        })
        .then(resp => {
          const { current, pageSize, filterData, selectData } = this.state
          const params = {
            pageSize,
            pageNo: current,
            ...selectData,
            ...filterData
          }
          this[fetchVideoList](params)
          message.success('视频恢复成功')
        })
        .catch(() => {
          message.error('视频恢复失败')
        })
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
      let { filterData, selectData, pageSize } = this.state
      let params = {
        pageSize,
        pageNo: page,
        ...selectData,
        ...filterData
      }
      this[fetchVideoList](params)
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
      this[fetchVideoList](params)
      this.setState({ current: 1, pageSize: pageSize })
    }

    // 搜索
    handleSelect(data) {
      let { selectData } = this.state
      let params = {}
      params.pageNo = 1
      params.pageSize = 10
      params = { ...params, ...selectData, ...data }
      this.setState({ filterData: data, selectedVideos: [] })
      this[fetchVideoList](params)
    }

    searchFn(values) {
      let { filterData } = this.state
      let params = { ...values, ...filterData }
      this[fetchVideoList](params)
      this.setState({ selectData: values, selectedVideos: [] })
    }

    render() {
      const {
        loading,
        videos,
        selectedVideos,
        showType,
        count,
        current,
        preview,
        url,
        fileName,
        isTree,
        category,
        pageSize,
        filterData,
        selectData
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
          {/* 临时写法 */}

          {key === 1 ? (
            <GearBox content=' + 添加视频' handleClick={this.historyToCreate} />
          ) : null}
          {key === 2 ? (
            <GearBox content='审核视频' handleClick={this.historyToPreview} />
          ) : null}
          {key === 3 ? (
            <GearBox
              content='关联知识点'
              handleClick={this.handleOpenConnect}
            />
          ) : null}

          <BoxHeader>
            <h4 className='storeHead'>{title}</h4>
          </BoxHeader>
          <BoxContent>
            {NavTabs ? (
              <NavTabs handleTabChange={this.handleTabChange} />
            ) : null}
            {Select ? <Select value={filterData} handleSelect={this.handleSelect} /> : null}
            {SearchGroup ? <SearchGroup value={selectData} searchFn={this.searchFn} /> : null}

            <SwitchOfList
              showType={showType}
              handleRedirectToCard={this.handleRedirectToCard}
              handleRedirectToTable={this.handleRedirectToTable}
            />

            <TableWithHeader
              loading={loading}
              clsTable={clsTable}
              videos={videos}
              selectedVideos={selectedVideos}
              listDisplay={listDisplay}
              handleReview={this.handleReview}
              handleDelete={this.handleDelete}
              handleReBack={this.handleReBack}
              handleEditVideo={this.handleEditVideo}
              handleOpenPreview={this.handleOpenPreview}
              handleItemConnect={this.handleOpenConnect}
              handleModifyVideo={this.handleModifyVideo}
              handleSelectChange={this.handleSelectChange}
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
                  pageSize={pageSize}
                />
              ) : null}
            </div>

            {preview && url && (
              <Preview
                type='video'
                data={url}
                className='videoPreviewModal'
                title={PreviewTitle}
                onCancel={this.handleClosePreview}
              />
            )}

            {isTree ? (
              <Modal
                className='treeModal'
                title='关联知识点'
                visible={isTree}
                footer={null}
                width={768}
                onCancel={this.handleHideTree}
              >
                <SelectPoints
                  selectPoint={this.handleConnect}
                  subjectType={category}
                />
              </Modal>
            ) : null}
          </BoxContent>
        </FrameBox>
      )
    }
  }

  return VideoBase
}

export default factory
