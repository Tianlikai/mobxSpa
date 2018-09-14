import Component from '../Component'
import { Modal } from 'antd'
import ImgWithSave from '../img/ImgWithSave'

import './style.scss'

const Title = props => (
    <div className={props.className}>
        <h5>{props.value}</h5>
    </div>
)

export default class ProModal extends Component {
    handleClose = () => {
        this.props.handleClose && this.props.handleClose()
    }
    render() {
        const {
            className,
            title: titleText, // 标题
            visible, // 是否显示
            showTitle,
            width,
            height,
            imgByte,
            titleValue,
            record,
            recordType,
            titleDownImg
        } = this.props

        const titleStyle = { textAlign: 'center' }
        const title = <div style={titleStyle}>{titleText}</div>

        const props = {
            title: showTitle ? title : null,
            className: className ? `goPoints ${className}` : 'goPoints',
            closable: true,
            visible,
            width: width || 800,
            height: height || 400,
            footer: null,
            onCancel: this.handleClose
        }

        const loadingStyle = {
            width: '40px',
            height: '40px',
            margin: '80px auto'
        }

        return (
            <Modal {...props}>
                <div className='content'>
                    <div className='cont-left'>
                        <Title className='title' value={titleValue[0]} />
                        <ImgWithSave
                            imgByte={imgByte}
                            record={record}
                            recordType={recordType}
                            titleDownImg={titleDownImg}
                            loadingStyle={loadingStyle}
                        />
                    </div>
                </div>
            </Modal>
        )
    }
}
