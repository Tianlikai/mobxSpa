import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
// import { toJS } from 'mobx'
// import { inject, observer } from 'mobx-react';

import Spinner from 'components/Spinner/Spinner'; // eslint-disable-line
import ModuleLine from 'components/ModuleLine'; // eslint-disable-line
import { WithBreadcrumb } from 'components/Breadcrumb'; // eslint-disable-line

import MyForm from './MyForm';

import './style.scss';

// @inject('FormStore')
// @observer
class UploadForm extends Component {
  static propTypes = {
    // FormStore: PropTypes.object.isRequired,
    routerData: PropTypes.object.isRequired,
    // history: PropTypes.object.isRequired,
  };

  componentDidMount() {
    // const { FormStore } = this.props;
    // FormStore.initialData();
  }

  handleSubmit = () => {};

  render() {
    const {
      routerData,
      //  FormStore
    } = this.props;
    const { config } = routerData;

    // const {
    //   regions, mathType, englishType, loading,
    // } = toJS(FormStore);

    return (
      <WithBreadcrumb config={config}>
        <div className="createPromotion-container">
          <Helmet>
            <title>上传表单 - SPA</title>
            <meta name="description" content="SPA" />
          </Helmet>
          <ModuleLine title="新增记录（上传表单）" />
          <MyForm onSubmit={this.handleSubmit} />
        </div>
      </WithBreadcrumb>
    );
  }
}

export default UploadForm;
