import { observable, action } from 'mobx';

const SearchListObj = {
  loading: false,
  page: 1,
  pageSize: 10,
  keyWord: '',
  listItems: [],
  byId: {},
  errorMessage: '',
  needReload: false,
  changePage(page) {
    this.page = page;
  },
};

const SearchListAction = {
  changePage: action,
};

const Demo = observable(SearchListObj, SearchListAction);

export default Demo;
