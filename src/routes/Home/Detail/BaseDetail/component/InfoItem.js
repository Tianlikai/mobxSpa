import React from 'react';
import PropTypes from 'prop-types';

const InfoItem = (props) => {
  const { label, value } = props;
  return (
    <div className="proInfo-item">
      <span className="proInfo-item-label">{label}</span>
      <span title={value}>{value}</span>
    </div>
  );
};

InfoItem.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
};

export default InfoItem;
