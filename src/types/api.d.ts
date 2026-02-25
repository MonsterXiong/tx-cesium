/**
 * API 接口类型定义
 */

/**
 * 登录请求参数
 */
export interface LoginParams {
  username: string
  password: string
  remember?: boolean
}

/**
 * 登录响应数据
 */
export interface LoginResponse {
  token: string
  userInfo: import('./global').UserInfo
}

/**
 * 刷新 Token 响应
 */
export interface RefreshTokenResponse {
  token: string
}

// 在这里可以继续添加更多 API 接口类型定义

