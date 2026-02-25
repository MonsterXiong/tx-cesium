/**
 * 应用全局状态管理
 * 管理应用级别的全局状态（侧边栏、面包屑等）
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEYS } from '@/utils/storage'

/**
 * 应用状态接口
 */
interface AppState {
  /** 侧边栏是否折叠 */
  sidebarCollapsed: boolean
  /** 是否显示面包屑 */
  showBreadcrumb: boolean
  /** 是否显示标签页 */
  showTabs: boolean
  /** 全局加载状态 */
  loading: boolean
}

/**
 * 应用操作接口
 */
interface AppActions {
  /** 切换侧边栏折叠状态 */
  toggleSidebar: () => void
  /** 设置侧边栏折叠状态 */
  setSidebarCollapsed: (collapsed: boolean) => void
  /** 设置面包屑显示状态 */
  setShowBreadcrumb: (show: boolean) => void
  /** 设置标签页显示状态 */
  setShowTabs: (show: boolean) => void
  /** 设置全局加载状态 */
  setLoading: (loading: boolean) => void
}

/**
 * 应用 Store
 */
export const useAppStore = create<AppState & AppActions>()(
  persist(
    set => ({
      // 状态
      sidebarCollapsed: false,
      showBreadcrumb: true,
      showTabs: true,
      loading: false,

      // 操作
      toggleSidebar: () => {
        set(state => {
          const collapsed = !state.sidebarCollapsed
          console.log('[DEBUG_APP] 侧边栏折叠状态:', collapsed)
          return { sidebarCollapsed: collapsed }
        })
      },

      setSidebarCollapsed: collapsed => {
        set({ sidebarCollapsed: collapsed })
        console.log('[DEBUG_APP] 侧边栏折叠状态:', collapsed)
      },

      setShowBreadcrumb: show => {
        set({ showBreadcrumb: show })
      },

      setShowTabs: show => {
        set({ showTabs: show })
      },

      setLoading: loading => {
        set({ loading })
      },
    }),
    {
      name: STORAGE_KEYS.SIDEBAR_COLLAPSED,
    },
  ),
)

