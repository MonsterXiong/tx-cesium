/**
 * 系统管理菜单配置
 * 展示多级菜单结构示例
 */

import { lazy } from 'react'
import { SettingOutlined, UserOutlined, TeamOutlined, MenuOutlined } from '@ant-design/icons'
import type { MenuItem } from '../types'

/**
 * 系统管理菜单（多级菜单示例）
 */
export const systemMenu: MenuItem[] = [
  {
    id: 'system',
    title: '系统管理',
    icon: <SettingOutlined />,
    order: 100,
    // 无 path 和 component，作为父级菜单容器
    children: [
      {
        id: 'system-user',
        path: '/system/user',
        title: '用户管理',
        icon: <UserOutlined />,
        order: 1,
        component: lazy(() => import('@/pages/system/user')),
        requiresAuth: true,
      },
      {
        id: 'system-role',
        path: '/system/role',
        title: '角色管理',
        icon: <TeamOutlined />,
        order: 2,
        component: lazy(() => import('@/pages/system/role')),
        requiresAuth: true,
      },
      {
        id: 'system-menu',
        path: '/system/menu',
        title: '菜单管理',
        icon: <MenuOutlined />,
        order: 3,
        component: lazy(() => import('@/pages/system/menu')),
        requiresAuth: true,
      },
    ],
  },
]
