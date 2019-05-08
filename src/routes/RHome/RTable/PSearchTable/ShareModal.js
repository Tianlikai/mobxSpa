import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

import ShareByQrModal from '@/components/ShareByQrModal/index';

@inject('TableStore')
@observer
class ShareModal extends Component {
  static propTypes = {
    TableStore: PropTypes.object.isRequired,
  };

  render() {
    const { TableStore } = this.props;
    const { chooseImgByte } = TableStore;
    return <ShareByQrModal imgByte={chooseImgByte} {...this.props} />;
  }
}

export default ShareModal;
