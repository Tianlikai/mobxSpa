import React, { Component } from 'react';

import { inject, observer } from 'mobx-react';

import PropTypes from 'prop-types';

import ShareByQrModal from 'components/ShareByQrModal/index'; // eslint-disable-line

@inject('TableSearchStore')
@observer
export default class ShareModal extends Component {
  static propTypes = {
    TableSearchStore: PropTypes.object.isRequired,
  };

  render() {
    const { TableSearchStore } = this.props;
    const { chooseImgByte } = TableSearchStore;
    return <ShareByQrModal imgByte={chooseImgByte} {...this.props} />;
  }
}
