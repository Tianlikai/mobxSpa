import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Modal } from 'antd';

import ImgWithSave from '@/components/Image/ImgWithSave';

import './style.scss';

const Title = (props) => {
  const { className, value } = props;
  return (
    <div className={className}>
      <h5>{value}</h5>
    </div>
  );
};

Title.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string,
};

export default class ShareByQrModal extends Component {
  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    visible: PropTypes.bool,
    showTitle: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    imgByte: PropTypes.string,
    titleValue: PropTypes.string,
    record: PropTypes.object,
    recordType: PropTypes.string,
    titleDownImg: PropTypes.string,
    handleClose: PropTypes.func,
  };

  handleClose = () => {
    const { handleClose } = this.props;
    if (handleClose) handleClose();
  };

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
      titleDownImg,
      ...others
    } = this.props;

    const titleStyle = { textAlign: 'center' };
    const title = <div style={titleStyle}>{titleText}</div>;

    const props = {
      title: showTitle ? title : null,
      className: classnames('goPoints', { [className]: className }),
      closable: true,
      visible,
      width: width || 800,
      height: height || 400,
      footer: null,
      onCancel: this.handleClose,
      ...others,
    };

    const loadingStyle = {
      width: '40px',
      height: '40px',
      margin: '80px auto',
    };
    return (
      <Modal {...props}>
        <div className="content">
          <div className="cont-left">
            <Title className="title" value={titleValue ? titleValue[0] : ''} />
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
    );
  }
}
