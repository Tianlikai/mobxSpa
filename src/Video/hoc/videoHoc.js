import React, { Component } from 'react'

const videoHoc = config => WrappedComponent => {
  return class extends Component {
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

    // 列表业务
    handleClosePreview() {
      this.setState({ preview: false, url: '', fileName: '' })
    }

    handleOpenPreview({ url, fileName } = { url: '', fileName: '' }) {
      this.setState({ preview: true, url, fileName })
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
        })
        .catch(err => {
          console.err(err)
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
      let { filterData, selectData } = this.state
      let params = {
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
      this.setState({ filterData: data })
      this[fetchVideoList](params)
    }

    searchFn(values) {
      let { filterData } = this.state
      let params = { ...values, ...filterData }
      this[fetchVideoList](params)
      this.setState({ selectData: values })
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }
}
export default videoHoc
