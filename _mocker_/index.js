/* eslint-disable */
const fs = require('fs');
const path = require('path');
const qs = require('qs');
const login = require('./login');
const org = require('./org');
const order = require('./order');
const agent = require('./agent');
const orgLog = require('./orgLog');
const orderLog = require('./orderLog');
const list = require('./list');

const proxy = {
  'POST /__api/8/user/login': login,
  'GET /__api/11/org/list': function(req, res) {
    console.log('GET mock: /__api/11/org/list');
    const { name, pageNo, itemsPerPage, state } = qs.parse(req._parsedUrl.query);
    const { items, count } = org.getOrgList(name, pageNo, itemsPerPage, state);
    res.json({
      code: '0',
      data: {
        items: items,
        count: count,
      },
      err: null,
      message: 'success!',
      successful: true,
    });
  },
  'PUT /__api/11/org/updateOrganisationStateById': function(req, res) {
    console.log('PUT /__api/11/org/updateOrganisationStateById');
    let { organizationId, state } = req.body;
    const result = org.updateOrderById(organizationId, state);
    if (result) {
      res.json({
        code: '0',
        data: 'success',
        err: null,
        message: 'success!',
        successful: true,
      });
    } else {
      res.json({
        code: '1',
        data: 'error',
        err: null,
        message: 'error!',
        successful: true,
      });
    }
  },
  'GET /__api/13/productOrder/getOrderList': function(req, res) {
    console.log('GET mock: /__api/13/productOrder/getOrderList');
    const { name, pageNo, itemsPerPage, state, startTime, endTime } = qs.parse(
      req._parsedUrl.query,
    );
    const { items, count } = order.getOrderList(
      name,
      pageNo,
      itemsPerPage,
      state,
      startTime,
      endTime,
    );
    res.json({
      code: '0',
      data: {
        items: items,
        count: count,
      },
      err: null,
      message: 'success!',
      successful: true,
    });
  },
  'PUT /__api/13/productOrder/updateStateById': function(req, res) {
    console.log('PUT /__api/13/productOrder/updateStateById');
    let { orderId, note, state } = req.body;
    const result = order.updateOrderById(orderId, note, state);
    if (result) {
      res.json({
        code: '0',
        data: 'success',
        err: null,
        message: 'success!',
        successful: true,
      });
    } else {
      res.json({
        code: '1',
        data: 'error',
        err: null,
        message: 'error!',
        successful: true,
      });
    }
  },
  'GET /__api/11/promotion/getMyProfit': function(req, res) {
    console.log('GET mock: /__api/11/promotion/getMyProfit');
    const { pageNo, itemsPerPage } = qs.parse(req._parsedUrl.query);
    const { items, totalShare, settled, settling, noSettle, count } = agent.getMyShare(
      pageNo,
      itemsPerPage,
    );
    res.json({
      code: '0',
      data: {
        totalShare,
        settled,
        settling,
        noSettle,
        totalCourseOrderNumber: count,
        courseOrderlist: items,
      },
      err: null,
      message: 'success!',
      successful: true,
    });
  },
  'GET /table/__api/11/promotion/getPromotionList': function(req, res) {
    console.log('GET mock: /__api/11/promotion/getPromotionList');
    const { name, pageNo, itemsPerPage, grade, startTime, endTime } = qs.parse(
      req._parsedUrl.query,
    );
    const { items, count } = agent.getProList(
      name,
      pageNo,
      itemsPerPage,
      grade,
      startTime,
      endTime,
    );
    res.json({
      code: '0',
      data: {
        count: count,
        items: items,
      },
      err: null,
      message: 'success!',
      successful: true,
    });
  },
  'POST /list/__api/2/video/orgVideo/list/1': function(req, res) {
    console.log('POST mock: /__api/2/video/orgVideo/list/1');
    const { isOwn, pageNo, pageSize } = req.body;
    const { items, count } = list.getList(pageNo, pageSize);
    res.json({
      code: '0',
      data: {
        count: count,
        items: items,
      },
      err: null,
      message: 'success!',
      successful: true,
    });
  },
  'GET /list/__api/11/promotion/getPromotionList': function(req, res) {
    console.log('GET mock: /__api/11/promotion/getPromotionList');
    const { name, pageNo, itemsPerPage, grade, startTime, endTime } = qs.parse(
      req._parsedUrl.query,
    );
    const { items, count } = agent.getProList(
      name,
      pageNo,
      itemsPerPage,
      grade,
      startTime,
      endTime,
    );
    res.json({
      code: '0',
      data: {
        count: count,
        items: items,
      },
      err: null,
      message: 'success!',
      successful: true,
    });
  },
  'GET /__api/11/promotion/getAgent': function(req, res) {
    console.log('GET mock: /__api/11/promotion/getAgent');
    const data = agent.getMyInfo();
    res.json({
      code: '0',
      data: data,
      err: null,
      message: 'success!',
      successful: true,
    });
  },
  'GET /__api/11/org/log/list': function(req, res) {
    console.log('GET mock: /__api/11/org/log/list');
    const { name, pageNo, itemsPerPage, operationType, startTime, endTime } = qs.parse(
      req._parsedUrl.query,
    );
    const { items, count } = orgLog.getLog(
      name,
      pageNo,
      itemsPerPage,
      operationType,
      startTime,
      endTime,
    );
    res.json({
      code: '0',
      data: {
        items: items,
        count: count,
      },
      err: null,
      message: 'success!',
      successful: true,
    });
  },
  'GET /__api/13/org/getOrderLogList': function(req, res) {
    console.log('GET mock: /__api/13/org/getOrderLogList');
    const { name, pageNo, itemsPerPage, type, startTime, endTime } = qs.parse(req._parsedUrl.query);
    const { items, count } = orderLog.getLog(name, pageNo, itemsPerPage, type, startTime, endTime);
    res.json({
      code: '0',
      data: {
        items: items,
        count: count,
      },
      err: null,
      message: 'success!',
      successful: true,
    });
  },
  'POST /detail/baseDetail/__api/11/promotion/getPromotionQrCode': function(req, res) {
    let url = path.resolve(__dirname, 'images', 'md.jpg');
    console.log('POST mock: /__api/11/promotion/getPromotionQrCode');
    fs.readFile(url, function(err, file) {
      if (err) {
        res.json({
          code: '1',
          data: null,
          err: '读取图片失败',
          message: '读取图片失败',
          successful: false,
        });
      } else {
        res.json({
          code: '0',
          data: file.toString('base64'),
          err: null,
          message: 'success!',
          successful: true,
        });
      }
    });
  },
  'POST /table/__api/11/promotion/getPromotionQrCode': function(req, res) {
    let url = path.resolve(__dirname, 'images', 'md.jpg');
    console.log('POST mock: /__api/11/promotion/getPromotionQrCode');
    fs.readFile(url, function(err, file) {
      if (err) {
        res.json({
          code: '1',
          data: null,
          err: '读取图片失败',
          message: '读取图片失败',
          successful: false,
        });
      } else {
        res.json({
          code: '0',
          data: file.toString('base64'),
          err: null,
          message: 'success!',
          successful: true,
        });
      }
    });
  },
  'GET /detail/baseDetail/__api/11/promotion/getPromotionDetail': function(req, res) {
    console.log('GET mock: /__api/11/promotion/getPromotionDetail');
    const { promotionId, pageNo, itemsPerPage } = qs.parse(req._parsedUrl.query);
    const result = agent.getPromotionById(promotionId);
    const data = Object.assign({}, result);
    res.json({
      code: '0',
      data: data,
      err: null,
      message: 'success!',
      successful: true,
    });
  },
  'GET /__api/11/public/getArea': function(req, res) {
    console.log('GET mock: /__api/11/public/getArea');
    const area = require('./files/area.json');
    res.json(area);
  },
  'GET /form/__api/11/public/getDict/Math_type': function(req, res) {
    console.log('GET mock: /__api/11/public/getDict/Math_type');
    res.json({
      code: '0',
      message: 'success',
      httpCode: '200',
      err: null,
      data: [
        {
          dictvalue: '1',
          dicttext: '通用版',
        },
        {
          dictvalue: '2',
          dicttext: '人教版',
        },
        {
          dictvalue: '3',
          dicttext: '浙教版',
        },
        {
          dictvalue: '4',
          dicttext: '苏科版',
        },
        {
          dictvalue: '5',
          dicttext: '北师大版',
        },
      ],
      successful: true,
    });
  },
  'GET /form/__api/11/public/getDict/English_type': function(req, res) {
    res.json({
      code: '0',
      message: 'success',
      httpCode: '200',
      err: null,
      data: [
        {
          dictvalue: '1',
          dicttext: '通用版',
        },
        {
          dictvalue: '2',
          dicttext: '人教版',
        },
        {
          dictvalue: '3',
          dicttext: '外研版',
        },
        {
          dictvalue: '4',
          dicttext: '苏教译林版',
        },
        {
          dictvalue: '5',
          dicttext: '上海牛津版',
        },
      ],
      successful: true,
    });
  },
  'POST /form/__api/11/promotion/addPromotion': function(req, res) {
    console.log('POST mock: /__api/11/promotion/addPromotion');
    const {
      area,
      city,
      className,
      englishTeacher,
      englishPress,
      grade,
      mathPress,
      mathTeacher,
      province,
      school,
    } = req.body;
    const data = agent.createPromotion(
      area,
      city,
      className,
      englishTeacher,
      englishPress,
      grade,
      mathPress,
      mathTeacher,
      province,
      school,
    );
    res.json({
      code: '0',
      data: data,
      err: null,
      message: 'success!',
      successful: true,
    });
  },
};

module.exports = proxy;
