import React, { Component } from 'react';

import * as mobx from 'mobx';
import { Helmet } from 'react-helmet';
import { observer, inject } from 'mobx-react';

import { Row, Col, Table } from 'antd';

import Storage from 'utils/storage'; // eslint-disable-line

import ModuleLine from 'components/ModuleLine'; // eslint-disable-line
import ImgWithSave from 'components/Image/ImgWithSave'; // eslint-disable-line
import { WithBreadcrumb } from 'components/Breadcrumb'; // eslint-disable-line
import ShareByQrModal from 'components/ShareByQrModal'; // eslint-disable-line

import InfoItem from './InfoItem';
import FrameItem from './FrameItem';

import './style.scss';

@inject('ProDetailStore')
@inject('TableSearchStore')
@observer
class BaseDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNo: 1,
      visibleModal: Storage.get('fromCreatePromotion') || false,
    };
  }

  componentDidMount() {
    const {
      match: {
        params: { id },
      },
      ProDetailStore,
      TableSearchStore,
    } = this.props;
    const { pageNo } = this.state;
    const copyQuery = Object.assign({}, { pageNo, id });
    ProDetailStore.getPromotionDetail(copyQuery);
    TableSearchStore.getWeiCode({ promotionId: id });
    Storage.del('fromCreatePromotion');
  }

  componentWillUnmount() {
    const { ProDetailStore, TableSearchStore } = this.props;
    TableSearchStore.delWeiCode();
    ProDetailStore.clearPromotionDetail();
  }

  get columns() {
    return [
      {
        title: '账号',
        dataIndex: 'mobile',
        key: 'mobile',
      },
      {
        title: '姓名',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: '付款时间',
        dataIndex: 'payTime',
        key: 'payTime',
      },
      {
        title: '购买内容',
        dataIndex: 'courseName',
        key: 'courseName',
      },
      {
        title: '教材版本',
        dataIndex: 'version',
        key: 'version',
      },
      {
        title: '所属年级',
        dataIndex: 'grade',
        key: 'grade',
      },
      {
        title: '金额',
        dataIndex: 'payMoney',
        key: 'payMoney',
      },
      {
        title: '我的收益',
        dataIndex: 'share',
        key: 'share',
      },
    ];
  }

  loadOrganizationList = (params) => {
    const { ProDetailStore } = this.props;
    ProDetailStore.getPromotionDetail(params);
  };

  handleChange = (value) => {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    this.setState({ pageNo: value.current });
    const params = Object.assign({ pageNo: value.current, id });
    this.loadOrganizationList(params);
  };

  handleCloseShareModal = () => {
    this.setState({
      visibleModal: false,
    });
  };

  render() {
    const { visibleModal, pageNo } = this.state;
    const { routerData, TableSearchStore, ProDetailStore } = this.props;
    const { config } = routerData;

    const { table: tableData, basicInformation, dataOverview } = ProDetailStore;

    const { loading, count, list } = tableData;

    const { chooseImgByte } = TableSearchStore;
    const dataSource = mobx.toJS(list);
    const pagination = {
      total: count,
      current: pageNo,
      showTotal: () => `共 ${count} 条`,
    };
    const emptyText = { emptyText: '暂无数据' };
    const tableProps = {
      bordered: true,
      dataSource,
      columns: this.columns,
      pagination,
      loading,
      locale: emptyText,
      onChange: this.handleChange,
    };

    const loadingStyle = {
      width: '40px',
      height: '40px',
      margin: '30px',
    };

    const titleValue = ['本次推广专属小程序二维码', '本次推广专属小程序链接'];
    return (
      <WithBreadcrumb config={config}>
        <div className="promotionDetail-container">
          <Helmet>
            <title>基础详情 - SPA</title>
            <meta name="description" content="SPA" />
          </Helmet>
          <ModuleLine title="推广详情" />
          <div className="proInfo-container">
            <div className="proInfo-left">
              {basicInformation
                && Object.keys(basicInformation).map(key => (
                  <InfoItem
                    key={key}
                    label={basicInformation[key].label}
                    value={basicInformation[key].value}
                  />
                ))}
            </div>
            <div className="proInfo-right">
              <ImgWithSave
                record={basicInformation}
                recordType="object"
                loadingStyle={loadingStyle}
                imgByte={chooseImgByte}
                titleDownImg="保存"
              />
            </div>
          </div>
          <ModuleLine title="数据总览" />
          <div className="data-frame-container">
            <Row type="flex" justify="space-between">
              {dataOverview
                && dataOverview.map(col => (
                  <Col span={7}>
                    <FrameItem
                      key={col.key}
                      title={col.title}
                      showHint
                      titleHint={col.hint}
                      value={col.total}
                      footerTitle={col.footer}
                      footerValue={col.yesterday}
                    />
                  </Col>
                ))}
            </Row>
          </div>
          <ModuleLine title="订单列表" />
          <Table {...tableProps} />
          <ShareByQrModal
            key="base-detail-modal"
            className="special"
            imgByte={chooseImgByte}
            width={600}
            showTitle
            title="创建成功"
            titleDownImg="保存"
            record={basicInformation}
            recordType="object"
            visible={visibleModal}
            titleValue={titleValue}
            handleClose={this.handleCloseShareModal}
          />
        </div>
      </WithBreadcrumb>
    );
  }
}

export default BaseDetail;
