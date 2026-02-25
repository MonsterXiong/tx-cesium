/**
 * 应用入口文件
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { appConfig } from '@/config'
import 'virtual:uno.css'
import '@/styles/global.css'

// 动态设置页面标题
document.title = appConfig.systemName

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
