/**
 * 图表相关菜单配置
 */

import { lazy } from 'react'
import { BarChartOutlined } from '@ant-design/icons'
import type { MenuItem } from '../types'

/**
 * 图表菜单
 */
export const chartMenu: MenuItem[] = [
  {
    id: 'active-chart',
    path: '/active-chart',
    title: '活动图表',
    icon: <BarChartOutlined />,
    order: 20,
    component: lazy(() => import('@/pages/active-chart/index.jsx')),
  },
]
