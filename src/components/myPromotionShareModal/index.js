import Component from '../Component'
import {Modal, Button} from 'antd'
import Spinner from 'components/spiner/Spinner'
import './myPromotionShareModal.scss'

const Title = (props) => <div className={props.className}>
    <h5>{props.value}</h5>
</div>

export class WeiCode extends Component {
    handleDownloadQRCode = () => {
        const {recordType} = this.props
        const {address, school, grade, className} = this.props.record || {address: '', school: '', grade: '', className: ''}
        let promotionName
        if (recordType === 'string') {
            promotionName = address + school + grade + className + '推广'
        } else if (recordType === 'object') {
            promotionName = address.value + school.value + grade.value + className.value + '推广'
        }
        const target = document.getElementsByClassName('weiCode')[0].currentSrc
        const downloadLink = document.createElement('a')
        downloadLink.setAttribute('href', target)
        downloadLink.setAttribute('download', `${promotionName}.png`)
        downloadLink.click()
    }
    render() {
        return (
            <div className='code'>
                <div className='pCode' id='pCode'>
                    {!this.props.imgByte && <Spinner style={this.props.style} />}
                    {this.props.imgByte && <img className='weiCode' src={`data:image/gif;base64,${this.props.imgByte}`} />}
                </div>
                {this.props.imgByte && <div className='downImg'>
                    <Button type='primary' size='middle' onClick={this.handleDownloadQRCode}>{this.props.titleDownImg}</Button>
                </div>}
            </div>
        )
    }
}

export default class MyPromotionShareModal extends Component {
    handleClose = () => {
        this.props.handleClose && this.props.handleClose()
    }
  
    handleCopyUrl = () => {
        let {address} = this.props
        let input = this.refs.input
        input.value = address
        input.select()
        document.execCommand('copy')
        Modal.success({
            content: '复制成功'
        })
    }

    render() {
        const {
            className,
            title: titleText, // 标题
            visible, // 是否显示
            showTitle,
            width,
            height,
            imgByte
        } = this.props
        const title = <div style={{textAlign: 'center'}} >{titleText}</div>
        const WeiCodeStyle = {'display': 'block', 'width': '40px', margin: '100px auto'}
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
        return <Modal {...props}>
            <div className='content'>
                <div className='cont-left'>
                    <Title className='title' value={this.props.titleValue[0]} />
                    <WeiCode record={this.props.record} recordType={this.props.recordType} style={WeiCodeStyle} imgByte={imgByte} titleDownImg={this.props.titleDownImg} />
                </div>
            </div>
        </Modal>
    }
}
