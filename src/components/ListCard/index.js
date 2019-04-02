import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import { Spin, Checkbox } from 'antd';

import Card from './Card';

import './style.scss';

const commonUtil = (data) => {
  const pageIds = data.map(item => item.id);
  const currentPage = new Set([...pageIds]);
  const currentSize = currentPage.size; // now 总数

  return { currentPage, currentSize };
};

export default class ListCard extends React.Component {
  static defaultProps = {
    fixWrapper: 'videoCardList',
    fixSelect: 'videoSelectAllBtn',
    fixContent: 'videoListContent',
  };

  static propTypes = {
    fixWrapper: PropTypes.string,
    fixSelect: PropTypes.string,
    fixContent: PropTypes.string,
    className: PropTypes.string,
    display: PropTypes.bool,
    loading: PropTypes.bool,
    data: PropTypes.array,
    selectedRowKeys: PropTypes.array,
    handleChange: PropTypes.func,
  };

  constructor(props) {
    super(props);
    const { selectedRowKeys } = props;
    this.state = {
      selectedRowKeys: selectedRowKeys ? new Set(selectedRowKeys) : new Set([]), // 总数
      indeterminate: false,
      checkAll: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { data, selectedRowKeys: selectedVideos } = props;
    if (selectedVideos) {
      const { currentPage, currentSize } = commonUtil(data);

      const oldPage = new Set([...selectedVideos]);

      const { selectedRowKeys } = state;
      const ids = new Set([...selectedRowKeys]);

      const intersect = new Set([...currentPage].filter(x => ids.has(x)));

      return {
        selectedRowKeys: oldPage,
        indeterminate: intersect.size && intersect.size < currentSize,
        checkAll: intersect.size !== 0 && intersect.size === currentSize,
      };
    }
    return null;
  }

  handleChange = (id) => {
    const { data } = this.props;

    const { currentPage, currentSize } = commonUtil(data);

    const { selectedRowKeys } = this.state;
    const ids = new Set([...selectedRowKeys]);

    if (ids.has(id)) {
      ids.delete(id);
    } else {
      ids.add(id);
    }

    const intersect = new Set([...currentPage].filter(x => ids.has(x)));

    this.setState(
      {
        selectedRowKeys: ids,
        indeterminate: intersect.size && intersect.size < currentSize,
        checkAll: intersect.size !== 0 && intersect.size === currentSize,
      },
      () => {
        const { handleChange } = this.props;
        const array = Array.from(ids);
        handleChange(array);
      },
    );
  };

  handleCheckAll = (e) => {
    const { data } = this.props;
    const { currentPage } = commonUtil(data);

    const { selectedRowKeys } = this.state;
    const ids = new Set([...selectedRowKeys]);

    const { checked } = e.target;

    const set = checked
      ? new Set([...ids, ...currentPage])
      : new Set([...ids].filter(x => !currentPage.has(x)));

    this.setState(
      {
        selectedRowKeys: set,
        indeterminate: false,
        checkAll: checked,
      },
      () => {
        const { handleChange } = this.props;
        const array = Array.from(set);
        handleChange(array);
      },
    );
  };

  render() {
    const { indeterminate, checkAll, selectedRowKeys } = this.state;
    const {
      display,
      data,
      loading,
      selectedRowKeys: selectedVideos,
      className: cn,
      fixWrapper,
      fixSelect,
      fixContent,
      ...props
    } = this.props;

    const classes = classnames(fixWrapper, {
      'root-listCard': display,
      displayNone: !display,
      loading,
    });

    return (
      <div className={classes}>
        {selectedVideos && data && data.length > 0 ? (
          <Checkbox
            className={`check ${fixSelect}`}
            indeterminate={indeterminate}
            checked={checkAll}
            onChange={this.handleCheckAll}
          >
            全选
          </Checkbox>
        ) : null}

        <div className={`listRoot ${fixContent}`}>
          {data
            && data.map(card => (
              <Card
                key={card.id}
                {...card}
                {...props}
                selectedVideos={selectedVideos}
                selectedRowKeys={selectedRowKeys}
                onChange={this.handleChange}
              />
            ))}
          {loading ? (
            <div className="spinLoading">
              <Spin />
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
