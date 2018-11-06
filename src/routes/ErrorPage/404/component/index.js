import { Helmet } from 'react-helmet'

const styleOf404 = {
    textAlign: 'center',
    fontSize: 30,
    marginTop: 60
}

export default () => (
    <div style={styleOf404}>
        <Helmet>
            <title>404 - 论答CRM</title>
            <meta name='description' content='论答CRM' />
        </Helmet>
        没有找到相关页面
    </div>
)
