/**
 * 路由主配置
 * 使用 React Router v6 实现路由管理
 */

import { Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Spin } from 'antd'
import BasicLayout from '@/layouts/BasicLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { routeConfig, routeComponents } from './config'
import type { RouteConfig } from '@/types/global'

/**
 * 加载中组件
 */
const Loading = () => (
  <div className="flex-center" style={{ height: '100vh' }}>
    <Spin size="large" tip="加载中...">
      <div style={{ minHeight: '200px' }} />
    </Spin>
  </div>
)

/**
 * 渲染路由
 * @param routes 路由配置数组
 * @returns 路由元素
 */
const renderRoutes = (routes: RouteConfig[]) => {
  return routes.map(route => {
    const { path, redirect } = route

    // 处理重定向
    if (redirect) {
      return <Route key={path} path={path} element={<Navigate to={redirect} replace />} />
    }

    // 获取组件
    const Component = routeComponents[path]

    if (!Component) {
      return null
    }

    // 判断是否需要路由守卫
    // const requiresAuth = route.meta?.requiresAuth ?? false
    const requiresAuth = false
    const element = (
      <Suspense fallback={<Loading />}>
        <Component />
      </Suspense>
    )

    return (
      <Route
        key={path}
        path={path}
        element={requiresAuth ? <ProtectedRoute>{element}</ProtectedRoute> : element}
      />
    )
  })
}

/**
 * 路由组件
 * @returns React Router 组件
 */
export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BasicLayout />}>
          {renderRoutes(routeConfig)}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

