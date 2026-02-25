/**
 * API 接口统一导出
 */

import { request } from '../request'
import type { LoginParams, LoginResponse } from '@/types/api'
import type { UserInfo } from '@/types/global'

/**
 * 用户相关 API
 */
export const userApi = {
  /**
   * 登录
   * @param data 登录参数
   * @returns Promise
   */
  login(data: LoginParams): Promise<LoginResponse> {
    return request.post('/auth/login', data)
  },

  /**
   * 登出
   * @returns Promise
   */
  logout(): Promise<void> {
    return request.post('/auth/logout')
  },

  /**
   * 获取用户信息
   * @returns Promise
   */
  getUserInfo(): Promise<UserInfo> {
    return request.get('/user/info')
  },

  /**
   * 刷新 Token
   * @returns Promise
   */
  refreshToken(): Promise<{ token: string }> {
    return request.post('/auth/refresh')
  },
}

// 可以继续添加其他模块的 API
// export const otherApi = { ... }

