/**
 * 主题状态管理
 * 管理主题模式（亮色/暗色）和主题色
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ThemeMode } from '@/types/global'
import { STORAGE_KEYS } from '@/utils/storage'

/**
 * 主题状态接口
 */
interface ThemeState {
  /** 主题模式 */
  mode: ThemeMode
  /** 主题色 */
  primaryColor: string
}

/**
 * 主题操作接口
 */
interface ThemeActions {
  /** 设置主题模式 */
  setMode: (mode: ThemeMode) => void
  /** 切换主题模式 */
  toggleMode: () => void
  /** 设置主题色 */
  setPrimaryColor: (color: string) => void
}

/**
 * 主题 Store
 */
export const useThemeStore = create<ThemeState & ThemeActions>()(
  persist(
    set => ({
      // 状态
      mode: 'light',
      primaryColor: '#1677ff',

      // 操作
      setMode: mode => {
        set({ mode })
        // 更新 DOM 属性
        document.documentElement.setAttribute('data-theme', mode)
        console.log('[DEBUG_THEME] 主题模式已切换:', mode)
      },

      toggleMode: () => {
        set(state => {
          const newMode = state.mode === 'light' ? 'dark' : 'light'
          document.documentElement.setAttribute('data-theme', newMode)
          console.log('[DEBUG_THEME] 主题模式已切换:', newMode)
          return { mode: newMode }
        })
      },

      setPrimaryColor: color => {
        set({ primaryColor: color })
        // 更新 CSS 变量
        document.documentElement.style.setProperty('--color-primary', color)
        console.log('[DEBUG_THEME] 主题色已更新:', color)
      },
    }),
    {
      name: STORAGE_KEYS.THEME,
      onRehydrateStorage: () => state => {
        // 恢复主题设置
        if (state) {
          document.documentElement.setAttribute('data-theme', state.mode)
          if (state.primaryColor) {
            document.documentElement.style.setProperty('--color-primary', state.primaryColor)
          }
        }
      },
    },
  ),
)

