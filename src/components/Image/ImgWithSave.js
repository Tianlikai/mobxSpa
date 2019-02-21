import React from 'react';
import PropTypes from 'prop-types';

import { Button } from 'antd';

import Img from './Img';

import './ImgWithSave.scss';

const iiHoc = WrappedComponent => class extends WrappedComponent {
    static propTypes = {
      titleDownImg: PropTypes.string, // 按钮文案
      prefixUrl: PropTypes.string, // dataUrl 前缀
      imgByte: PropTypes.string, // dataUrl
      recordType: PropTypes.string, // 该条记录类型
      record: PropTypes.object, // 记录包含的信息 用于合成图片名称
    };

    handleDownloadQRCode = () => {
      const {
        recordType, imgByte, prefixUrl, record,
      } = this.props;
      const {
        address, school, grade, className,
      } = record || {
        address: '',
        school: '',
        grade: '',
        className: '',
      };
      let promotionName;
      if (recordType === 'string') {
        promotionName = `${address + school + grade + className}推广`;
      } else if (recordType === 'object') {
        promotionName = `${address.value + school.value + grade.value + className.value}推广`;
      }
      const target = `${prefixUrl}${imgByte}`;
      const downloadLink = document.createElement('a');
      downloadLink.setAttribute('href', target);
      downloadLink.setAttribute('download', `${promotionName}.png`);
      downloadLink.click();
    };

    render() {
      const { titleDownImg } = this.props;
      return (
        <div className="code">
          {super.render()}
          <Button
            className="code-btn"
            type="primary"
            size="middle"
            onClick={this.handleDownloadQRCode}
          >
            {titleDownImg}
          </Button>
        </div>
      );
    }
};

const ImgWithSave = iiHoc(Img);
export default ImgWithSave;
