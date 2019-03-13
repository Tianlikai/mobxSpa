import React from 'react';
import { Helmet } from 'react-helmet';

const styleOf404 = {
  textAlign: 'center',
  fontSize: 30,
  marginTop: 60,
};

export default () => (
  <div style={styleOf404}>
    <Helmet>
      <title>404 - SPA</title>
      <meta name="description" content="SPA" />
    </Helmet>
    没有找到相关页面
  </div>
);
