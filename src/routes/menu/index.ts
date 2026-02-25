/**
 * 菜单配置汇总与工具函数
 * 自动导入 modules 目录下所有菜单配置
 */

import type { MenuProps } from 'antd'
import type { MenuItem } from './types'

// 导出类型
export type { MenuItem } from './types'

/**
 * 自动导入 modules 目录下所有 .tsx 文件（支持子目录）
 * 使用 Vite 的 import.meta.glob 实现
 */
const menuModules = import.meta.glob<{ [key: string]: MenuItem[] }>(
  './modules/**/*.tsx',
  { eager: true }
)

/**
 * 从模块中提取所有菜单数组
 * 约定：导出名以 Menu 结尾的数组会被自动收集
 */
function collectMenusFromModules(): MenuItem[] {
  const allMenus: MenuItem[] = []

  for (const [, module] of Object.entries(menuModules)) {
    for (const [exportName, exportValue] of Object.entries(module)) {
      if (exportName.endsWith('Menu') && Array.isArray(exportValue)) {
        allMenus.push(...exportValue)
      }
    }
  }

  return allMenus
}

/**
 * 递归排序菜单项
 * @param items 菜单项数组
 * @returns 排序后的菜单项数组
 */
export function sortMenuItems(items: MenuItem[]): MenuItem[] {
  return [...items]
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
    .map(item => ({
      ...item,
      children: item.children ? sortMenuItems(item.children) : undefined,
    }))
}

/**
 * 扁平化菜单，提取所有有路由路径的项
 * @param items 菜单项数组
 * @returns 扁平化后的菜单项数组
 */
export function flattenMenuRoutes(items: MenuItem[]): MenuItem[] {
  const result: MenuItem[] = []

  const traverse = (menuItems: MenuItem[]) => {
    for (const item of menuItems) {
      // 有 path 的项加入结果
      if (item.path) {
        result.push(item)
      }
      // 递归处理子菜单
      if (item.children?.length) {
        traverse(item.children)
      }
    }
  }

  traverse(items)
  return result
}

/**
 * 将菜单配置转换为 Ant Design Menu 组件所需的 items 格式
 * @param items 菜单项数组
 * @returns Antd Menu items 数组
 */
export function menuToAntdItems(items: MenuItem[]): MenuProps['items'] {
  return items
    .filter(item => !item.hideInMenu)
    .map(item => {
      const menuItem: NonNullable<MenuProps['items']>[number] = {
        key: item.path || item.id,
        icon: item.icon,
        label: item.title,
      }

      // 处理子菜单
      if (item.children?.length) {
        const visibleChildren = item.children.filter(child => !child.hideInMenu)
        if (visibleChildren.length > 0) {
          ;(menuItem as any).children = menuToAntdItems(visibleChildren)
        }
      }

      return menuItem
    })
}

/**
 * 汇总所有菜单配置（自动收集 + 排序）
 */
export const menuConfig: MenuItem[] = sortMenuItems(collectMenusFromModules())

/**
 * 所有路由配置（扁平化）
 */
export const flatRoutes: MenuItem[] = flattenMenuRoutes(menuConfig)
