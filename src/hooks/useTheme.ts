/**
 * 主题 Hook
 * 封装主题相关的逻辑和 Antd 主题配置
 */

import { useMemo } from 'react'
import { theme as antdTheme } from 'antd'
import type { ThemeConfig } from 'antd'
import { useThemeStore } from '@/stores'

/**
 * 使用主题 Hook
 * @returns 主题相关状态和方法，以及 Antd 主题配置
 */
export const useTheme = () => {
  const { mode, primaryColor, setMode, toggleMode, setPrimaryColor } = useThemeStore()

  // Antd 主题配置
  const antdThemeConfig: ThemeConfig = useMemo(() => {
    return {
      algorithm: mode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      token: {
        colorPrimary: primaryColor,
        borderRadius: 6,
        colorBgContainer: mode === 'dark' ? '#1f1f1f' : '#ffffff',
      },
      components: {
        Layout: {
          headerBg: mode === 'dark' ? '#141414' : '#ffffff',
          siderBg: mode === 'dark' ? '#141414' : '#ffffff',
          bodyBg: mode === 'dark' ? '#000000' : '#f5f5f5',
        },
        Menu: {
          itemBg: 'transparent',
          subMenuItemBg: 'transparent',
        },
      },
    }
  }, [mode, primaryColor])

  return {
    mode,
    primaryColor,
    setMode,
    toggleMode,
    setPrimaryColor,
    antdThemeConfig,
    isDark: mode === 'dark',
  }
}

