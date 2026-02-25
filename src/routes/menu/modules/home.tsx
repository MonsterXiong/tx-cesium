/**
 * 首页相关菜单配置
 */

import { lazy } from 'react'
import { HomeOutlined, DashboardOutlined } from '@ant-design/icons'
import type { MenuItem } from '../types'

/**
 * 首页菜单
 */
export const homeMenu: MenuItem[] = [
  {
    id: 'home',
    path: '/home',
    title: '首页',
    icon: <HomeOutlined />,
    order: 1,
    component: lazy(() => import('@/pages/home')),
  },
  {
    id: 'dashboard',
    path: '/dashboard',
    title: '仪表盘',
    icon: <DashboardOutlined />,
    order: 2,
    component: lazy(() => import('@/pages/dashboard')),
    requiresAuth: true,
  },
]
