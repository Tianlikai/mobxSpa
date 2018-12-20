import React from 'react';
import PropTypes from 'prop-types';
import Spinner from '../Spinner/Spinner';

import './Img.scss';

const Img = (props) => {
  const {
    imgByte, loadingStyle, prefixCls, prefixUrl, className,
  } = props;
  const cName = className ? `${prefixCls} ${className}` : prefixCls;
  return (
    <div className={cName}>
      {!imgByte && <Spinner style={loadingStyle} />}
      {imgByte && (
        <img alt="spinner" className={`${prefixCls}-img`} src={`${prefixUrl}${imgByte}`} />
      )}
    </div>
  );
};

Img.defaultProps = {
  prefixCls: 'pCode',
  prefixUrl: 'data:image/gif;base64,',
};

Img.propTypes = {
  prefixCls: PropTypes.string,
  prefixUrl: PropTypes.string,
  className: PropTypes.string, // img dataUrl
  imgByte: PropTypes.string,
  loadingStyle: PropTypes.object, // 载入图片过程中loading的样式
};

export default Img;
