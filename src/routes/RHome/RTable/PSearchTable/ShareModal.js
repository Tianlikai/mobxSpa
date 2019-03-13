import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

import ShareByQrModal from 'components/ShareByQrModal/index'; // eslint-disable-line

@inject('TableStore')
@observer
export default class ShareModal extends Component {
  static propTypes = {
    TableStore: PropTypes.object.isRequired,
  };

  render() {
    const { TableStore } = this.props;
    const { chooseImgByte } = TableStore;
    return <ShareByQrModal imgByte={chooseImgByte} {...this.props} />;
  }
}
