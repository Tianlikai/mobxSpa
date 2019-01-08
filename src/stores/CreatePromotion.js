import { action, observable } from 'mobx';
import Storage from 'utils/storage'; // eslint-disable-line
import { message } from 'antd';

class CreatePromotion {
  @observable
  regions = Storage.get('area') || [];

  @observable
  mathType = [];

  @observable
  englishType = [];

  @observable
  loading = false;

  @action
  initialData() {
    this.loading = true;
    if (this.regions.length <= 0) {
      G.api.getArea().then((data) => {
        this.regions = data;
        Storage.set('area', data);
        this.finishInitial();
      });
    }
    G.api.getTextbookVersion({ urlParams: { type: 'Math_type' } }).then((data) => {
      this.mathType = data;
      this.finishInitial();
    });
    G.api.getTextbookVersion({ urlParams: { type: 'English_type' } }).then((data) => {
      this.englishType = data;
      this.finishInitial();
    });
  }

  @action
  CreatePromotion(data) {
    G.api
      .createPromotion({ data })
      .then((resp) => {
        const { id } = resp;
        G.history.replace(`/detail/baseDetail/${id}`);
        G.delReturnParams('returnParams');
        Storage.set('fromCreatePromotion', true);
      })
      .catch((e) => {
        message.error(e.message);
      });
  }

  finishInitial() {
    if (this.regions.length >= 0 && this.mathType.length >= 0 && this.englishType.length >= 0) {
      this.loading = false;
    }
  }
}

export default new CreatePromotion();
