import Component from '../../components/Component'
import MyIncome from './MyIncome'
import MyPromotion from './MyPromotion'
import CreatePromotion from './CreatePromotion'
import PromotionDetail from './PromotionDetail'
import MyInformation from './MyInformation'
import Container from '../../layouts/Container'
import {PERMISSIONS} from '../../config'

const {Route, Switch} = ReactRouterDOM

const NAV = {
    myIncome: ['我的代理', '我的分成'],
    myPromotion: ['我的代理', '我的推广'],
    myInformation: ['我的代理', '我的信息'],
    createPromotion: ['我的代理', '新增推广'],
    promotionDetail: ['我的代理', '推广详情']
}

const MyIncomeWrapper = Container(NAV.myIncome)(MyIncome)
const MyPromotionWrapper = Container(NAV.myPromotion)(MyPromotion)
const CreatePromotionWrapper = Container(NAV.createPromotion)(CreatePromotion)
const PromotionDetailWrapper = Container(NAV.promotionDetail)(PromotionDetail)
const MyInformationWrapper = Container(NAV.myInformation)(MyInformation)

const ROUTE = [
    {
        path: '/myIncome',
        component: MyIncomeWrapper,
        exact: false,
        PERMISSIONS: [PERMISSIONS.myIncome]
    },
    {
        path: '/myPromotion',
        component: MyPromotionWrapper,
        exact: false,
        PERMISSIONS: [PERMISSIONS.myPromotion]
    },
    {
        path: '/createPromotion',
        component: CreatePromotionWrapper,
        exact: false,
        PERMISSIONS: true
    },
    {
        path: '/promotionDetail/:id',
        component: PromotionDetailWrapper,
        exact: false,
        PERMISSIONS: true
    },
    {
        path: '/myInformation',
        component: MyInformationWrapper,
        exact: false,
        PERMISSIONS: [PERMISSIONS.myInformation]
    }
]

export default class OrgAdmin extends Component {
    render() {
        return (
            <Switch>
                {ROUTE.map(route => {
                    if (G.checkPermission(route.PERMISSIONS)) return <Route exact={route.exact} path={`${this.props.match.url}${route.path}`} component={route.component} />
                })}
            </Switch>
        )
    }
}
