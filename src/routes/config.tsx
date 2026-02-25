/**
 * 路由配置
 * 从菜单配置自动生成路由
 */

import { lazy } from 'react'
import { flatRoutes } from './menu'
import type { MenuItem } from './menu'

/**
 * 路由元信息接口（兼容旧版）
 */
export interface RouteMeta {
  /** 路由标题 */
  title?: string
  /** 图标 */
  icon?: React.ReactNode
  /** 是否需要登录 */
  requiresAuth?: boolean
  /** 是否在菜单中隐藏 */
  hideInMenu?: boolean
  /** 权限标识 */
  permissions?: string[]
}

/**
 * 路由配置接口（兼容旧版）
 */
export interface RouteConfig {
  /** 路由路径 */
  path: string
  /** 路由元信息 */
  meta?: RouteMeta
  /** 子路由 */
  children?: RouteConfig[]
  /** 重定向 */
  redirect?: string
}

/**
 * 将菜单项转换为路由配置
 * @param menuItem 菜单项
 * @returns 路由配置
 */
function menuItemToRouteConfig(menuItem: MenuItem): RouteConfig {
  return {
    path: menuItem.path!,
    meta: {
      title: menuItem.title,
      icon: menuItem.icon,
      requiresAuth: menuItem.requiresAuth,
      hideInMenu: menuItem.hideInMenu,
      permissions: menuItem.permissions,
    },
    redirect: menuItem.redirect,
  }
}

/**
 * 路由配置数组（从菜单生成）
 */
export const routeConfig: RouteConfig[] = [
  // 根路由重定向
  {
    path: '/',
    redirect: '/home',
    meta: {
      hideInMenu: true,
    },
  },
  // 从菜单配置生成路由
  ...flatRoutes.map(menuItemToRouteConfig),
  // 404 页面
  {
    path: '/404',
    meta: {
      title: '404',
      hideInMenu: true,
    },
  },
  // 兜底路由
  {
    path: '*',
    redirect: '/404',
    meta: {
      hideInMenu: true,
    },
  },
]

/**
 * 路由组件映射（从菜单配置自动生成）
 */
export const routeComponents: Record<string, React.LazyExoticComponent<React.ComponentType>> = {}

// 从菜单配置生成组件映射
flatRoutes.forEach(item => {
  if (item.path && item.component) {
    routeComponents[item.path] = item.component
  }
})

// 添加 404 组件
routeComponents['/404'] = lazy(() => import('@/pages/not-found'))
