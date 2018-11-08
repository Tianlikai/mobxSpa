import Component from 'components/Component'

import { Helmet } from 'react-helmet'
import { inject, observer } from 'mobx-react'

import BForm from './BForm'
import Spinner from 'components/spiner/Spinner'
import ModuleLine from 'components/ModuleLine'
import { WithBreadcrumb } from 'components/Breadcrumb'

import './style.scss'

@inject('CreatePromotionStore')
@observer
class BaseForm extends Component {
    componentDidMount() {
        this.props.CreatePromotionStore.initialData()
    }
    handleSubmit = data => {
        this.props.CreatePromotionStore.CreatePromotion(data)
    }
    render() {
        const { routerData, CreatePromotionStore } = this.props
        const { config } = routerData

        const { regions, mathType, englishType, loading } = CreatePromotionStore

        return (
            <WithBreadcrumb config={config}>
                <div className='createPromotion-container'>
                    <Helmet>
                        <title>基础表单 - SPA</title>
                        <meta name='description' content='SPA' />
                    </Helmet>
                    <ModuleLine title={'新增推广'} />
                    {loading && <Spinner />}
                    {!loading && (
                        <BForm
                            regions={regions}
                            mathType={mathType}
                            englishType={englishType}
                            onSubmit={this.handleSubmit}
                        />
                    )}
                </div>
            </WithBreadcrumb>
        )
    }
}

export default BaseForm
