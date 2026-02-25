/**
 * 空白布局组件
 * 用于登录页等不需要导航的页面
 */

import { Outlet } from 'react-router-dom'

/**
 * 空白布局组件
 * @returns React 组件
 */
const BlankLayout: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  )
}

export default BlankLayout

