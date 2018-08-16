import Component from 'components/Component'

export default class SelectButtonList extends Component {
    openCustomInput = () => {
        this.props.openCustomInput && this.props.openCustomInput()
    }
    render() {
        let {data, selectNumber, handleAccounting, children} = this.props
        return (
            <div className='number-container'>
                {data.map((item, key) => {
                    let classes = item === selectNumber ? 'number-container-item active' : 'number-container-item'
                    if (item === '自定义') return <div key={key} onClick={this.openCustomInput} className={classes}>{item}</div>
                    return <div key={key} onClick={handleAccounting.bind(null, item)} className={classes}>{item}</div>
                })}
                {children}
            </div>
        )
    }
}
