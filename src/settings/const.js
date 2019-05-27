const ORG_STATE = {
  0: '全部',
  1: '正常',
  2: '欠费',
  3: '延期',
  4: '禁用',
};

const ACTION_STATE = ['启用', '禁用'];

const OPTION = [
  { key: 'all', value: 0, text: '全部' },
  { key: 'done', value: 1, text: '已支付' },
  { key: 'wait', value: 2, text: '待支付' },
  { key: 'delete', value: 3, text: '已取消' },
];

const DEFAULT_FORM_OPTION = OPTION.slice();

const DEFAULT_OPTION = OPTION.slice().concat({
  key: 'fail',
  value: 4,
  text: '支付失败',
});

const ORD_LOG_STATE = {
  0: '全部',
  1: '创建订单',
  2: '取消订单',
  3: '确认收款',
};

const LABEL_LIST = {
  orderId: '订单号',
  state: '支付状态',
  createTime: '创建时间',
  payTime: '支付时间',
  orgName: '机构名称',
  type: '订单类型',
  commodity: '商品名称',
  nowNum: '现有账号数',
  buyNum: ['购买账号数', '新购账号总数'],
  payMoney: '支付金额',
  price: '单价',
  payType: '支付方式',
  note: '订单备注',
};

const ORDER_FIELD = [
  'orderId',
  'state',
  'createTime',
  'orgName',
  'type',
  'commodity',
  'price',
  'nowNum',
  'buyNum',
  'payMoney',
  'note',
];

const ORDER_TYPE = {
  1: '充值',
  2: '购买账号',
  3: '升级服务',
  4: '智能测评（5000元）',
};

const UNIT = ['元/学生/年', '元/学生/年'];

const PAY_TYPE = {
  1: '微信',
  2: '支付宝',
  3: '账户余额',
  4: '对公转账',
};

const DAFAULT_TEXT = ['未开通测评服务账号', '未开通教学服务账号'];
const DEFAULT_CLASSES = ['assessmentService', 'teachingServices'];

const GRADE = [
  { key: '', value: '', text: '全部' },
  { key: 7, value: 7, text: '七年级' },
  { key: 8, value: 8, text: '八年级' },
  { key: 9, value: 9, text: '九年级' },
];

const SYSTEM_IDS = {
  BD_ORG: 10,
  LT_ADMIN: 13,
  OPERATION_ADMIN: 15,
};

const QINIU_DOMAIN = 'https://lcdns-pic.your.com/';

const STATUS_VIDEO = [
  {
    value: '',
    text: '全部',
  },
  {
    value: '0',
    text: '未提审',
  },
  {
    value: '1',
    text: '待审核',
  },
  {
    value: '2',
    text: '需修改',
  },
  {
    value: '3',
    text: '审核通过',
  },
];

export {
  OPTION, // 订单列表状态 通用
  ORG_STATE, // 机构列表状态
  ACTION_STATE,
  DEFAULT_FORM_OPTION, // 订单列表 默认下拉选项
  DEFAULT_OPTION, // 默认选项
  LABEL_LIST, // 订单详情列表 所有字段
  ORDER_TYPE, // 订单类型
  ORD_LOG_STATE, // 订单日子列表 状态
  UNIT, // 单价 单位
  PAY_TYPE, // 支付方式
  DAFAULT_TEXT, // 创建订单页: 开通服务列表 默认值
  DEFAULT_CLASSES,
  ORDER_FIELD,
  GRADE, // 年级表
  SYSTEM_IDS,
  QINIU_DOMAIN,
  STATUS_VIDEO, // 视频状态
};
