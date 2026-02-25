/**
 * App 根组件
 * 配置 Antd、主题和路由
 */

import { ConfigProvider, App as AntdApp } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { useTheme } from '@/hooks'
import { AppRouter } from '@/routes'

/**
 * App 组件
 * @returns React 组件
 */
function App() {
  const { antdThemeConfig } = useTheme()

  return (
    <ConfigProvider locale={zhCN} theme={antdThemeConfig}>
      <AntdApp>
        <AppRouter />
      </AntdApp>
    </ConfigProvider>
  )
}

export default App
