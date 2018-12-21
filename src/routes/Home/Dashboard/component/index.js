import React from 'react';
import { Helmet } from 'react-helmet';

const Dashboard = () => {
  const style = {
    textAlign: 'center',
    fontSize: 30,
    marginTop: 60,
  };
  return (
    <div style={style}>
      <Helmet>
        <title>仪表盘 - SPA</title>
        <meta name="description" content="SPA" />
      </Helmet>
      欢迎来到SPA系统
    </div>
  );
};

export default Dashboard;
