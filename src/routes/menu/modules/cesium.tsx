/**
 * Cesium 地图相关菜单配置
 */

import { lazy } from 'react'
import { GlobalOutlined } from '@ant-design/icons'
import type { MenuItem } from '../types'

/**
 * Cesium 菜单
 */
export const cesiumMenu: MenuItem[] = [
  {
    id: 'cesium-view',
    path: '/cesium-view',
    title: 'Cesium 地图',
    icon: <GlobalOutlined />,
    order: 10,
    component: lazy(() => import('@/pages/cesium-view')),
  },
]
