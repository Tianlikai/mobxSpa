import React from 'react';
import assign from 'object-assign';

const { Route, Switch, Redirect } = ReactRouterDOM;

/* eslint-disable */
/**
 * 生成一组路由
 * @param {*} routesConfig
 */
export const createRoutes = routesConfig => (
  <Switch>{routesConfig().map(config => createRoute(() => config))}</Switch>
);

// 路由映射表
window.dva_router_pathMap = {};

/**
 * 生成单个路由
 * @param {*} app
 * @param {*} routesConfig
 */
export const createRoute = routesConfig => {
  const routesResult = routesConfig();
  const { PERMISSIONS } = routesResult;
  const { component: Comp, path, indexRoute, title, ...otherProps } = routesResult;
  if (path && path !== '/') {
    window.dva_router_pathMap[path] = { path, title, ...otherProps };
  }
  const routeProps = assign(
    {
      key: path,
      render: props => {
        // 权限验证
        if (!G.checkPermission(PERMISSIONS)) return null;
        return <Comp routerData={otherProps} {...props} />;
      },
    },
    path && {
      path,
    },
  );

  if (indexRoute) {
    return [
      <Redirect key={`${path}_redirect`} exact from={path} to={indexRoute} />,
      <Route {...routeProps} />,
    ];
  }
  return <Route {...routeProps} />;
};
