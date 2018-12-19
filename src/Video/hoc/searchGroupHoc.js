import AuthComponent from 'libs/AuthComponent'
import Storage from '../../../helpers/Storage'

const searchGroupHoc = config => WrappedComponent => {
    const { source, createBy } = config
    return class extends AuthComponent {
        state = {
            tagList: [],
            createList: []
        }

        componentDidMount() {
            this.getLabelList()
            if (createBy) this.getCreateList()
        }

        getLabelList = () => {
            const params = {
                orgId: Storage.get('orgId'),
                source: source
            }

            api.fetchVideoLabelList({ query: params })
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

        getCreateList = () => {
            const params = {
                orgId: Storage.get('orgId'),
                source: source
            }

            api.fetchVideoCreateList({ query: params })
                .then(resp => {
                    const res = resp
                    const list = []
                    res.forEach(r => {
                        list.push({
                            value: r.userId,
                            text: r.name
                        })
                    })
                    this.setState({ createList: list })
                })
                .catch(err => console.log(err))
        }

        searchFn = values => {
            const { searchFn } = this.props
            if (searchFn) searchFn(values)
        }

        resetForm = () => {
            const { searchFn } = this.props
            if (searchFn) searchFn({})
        }

        render() {
            const { tagList, createList } = this.state
            const selfs = {
                tagList,
                createList,
                searchFn: this.searchFn,
                resetForm: this.resetForm
            }
            return <WrappedComponent {...selfs} {...this.props} />
        }
    }
}

export default searchGroupHoc
