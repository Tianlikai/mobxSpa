import React from 'react';
import PropTypes from 'prop-types';

import { Progress, Icon } from 'antd';

import './style.scss';

export default class UpLoadWithProgress extends React.Component {
  static propTypes = {
    file: PropTypes.object,
  };

  componentDidMount() {}

  render() {
    const { file } = this.props;
    const { name } = file;
    return (
      <div className="upload_section">
        <div className="upload_section_top">{name}</div>
        <div className="upload_section_middle">
          <Progress />
        </div>
        <div className="upload_section_bottom">
          <Icon />
          <Icon />
          <Icon />
        </div>
      </div>
    );
  }
}
