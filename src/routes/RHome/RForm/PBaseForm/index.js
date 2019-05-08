import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';

import Spinner from '@/components/Spinner/Spinner';
import ModuleLine from '@/components/ModuleLine';
import { WithBreadcrumb } from '@/components/Breadcrumb/index';

import BForm from './BForm';

import './style.scss';

@inject('FormStore')
@observer
class BaseForm extends Component {
  static propTypes = {
    FormStore: PropTypes.object.isRequired,
    routerData: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { FormStore } = this.props;
    FormStore.initialData();
  }

  handleSubmit = (values) => {
    const {
      area: AREA,
      className,
      englishPress,
      englishTeacher,
      grade,
      mathPress,
      mathTeacher,
      school,
    } = values;

    const {
      FormStore,
      history: { replace },
    } = this.props;
    FormStore.CreatePromotion(
      {
        province: AREA[0] || '',
        city: AREA[1] || '',
        area: AREA[2] || '',
        className,
        englishPress,
        englishTeacher,
        grade,
        mathPress,
        mathTeacher,
        school,
      },
      (id) => {
        replace(`/detail/baseDetail/${id}`);
      },
    );
  };

  render() {
    const { routerData, FormStore } = this.props;
    const { config } = routerData;

    const {
      regions, mathType, englishType, loading,
    } = toJS(FormStore);

    return (
      <WithBreadcrumb config={config}>
        <div className="PBaseForm">
          <Helmet>
            <title>基础表单 - SPA</title>
            <meta name="description" content="SPA" />
          </Helmet>
          <ModuleLine title="新增推广" />

          {loading ? (
            <Spinner />
          ) : (
            <BForm
              regions={regions}
              mathType={mathType}
              englishType={englishType}
              onSubmit={this.handleSubmit}
            />
          )}
        </div>
      </WithBreadcrumb>
    );
  }
}

export default BaseForm;
