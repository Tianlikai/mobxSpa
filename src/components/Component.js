import autoBind from 'libs/autoBind'

export default class Component extends React.Component {
    constructor(props) {
        super(props)
        autoBind(this)
    }

    render() {
        return null
    }
}
