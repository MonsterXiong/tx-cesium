/**
 * 路由守卫组件
 * 用于保护需要登录才能访问的路由
 */

import { Navigate } from 'react-router-dom'
import { useUserStore } from '@/stores'

interface ProtectedRouteProps {
  children: React.ReactNode
}

/**
 * 路由守卫组件
 * @param children - 需要保护的路由组件
 * @returns 已认证则渲染子组件，未认证则重定向到登录页
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn } = useUserStore()

  // 如果未登录，重定向到登录页（这里假设登录页路径为 /login）
  if (!isLoggedIn) {
    console.log('[DEBUG_APP] 用户未登录，重定向到登录页')
    return <Navigate to="/login" replace />
  }

  // 已登录，渲染子组件
  return <>{children}</>
}

