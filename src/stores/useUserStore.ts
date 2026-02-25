/**
 * 用户状态管理
 * 管理用户信息和登录状态
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserInfo } from '@/types/global'
import { STORAGE_KEYS } from '@/utils/storage'

/**
 * 用户状态接口
 */
interface UserState {
  /** 用户信息 */
  userInfo: UserInfo | null
  /** Token */
  token: string | null
  /** 是否已登录 */
  isLoggedIn: boolean
}

/**
 * 用户操作接口
 */
interface UserActions {
  /** 设置用户信息 */
  setUserInfo: (userInfo: UserInfo) => void
  /** 设置 Token */
  setToken: (token: string) => void
  /** 登录 */
  login: (userInfo: UserInfo, token: string) => void
  /** 登出 */
  logout: () => void
  /** 更新用户信息 */
  updateUserInfo: (userInfo: Partial<UserInfo>) => void
}

/**
 * 用户 Store
 */
export const useUserStore = create<UserState & UserActions>()(
  persist(
    set => ({
      // 状态
      userInfo: null,
      token: null,
      isLoggedIn: false,

      // 操作
      setUserInfo: userInfo => {
        set({ userInfo })
        console.log('[DEBUG_USER] 用户信息已更新:', userInfo)
      },

      setToken: token => {
        set({ token })
        console.log('[DEBUG_USER] Token 已更新')
      },

      login: (userInfo, token) => {
        set({
          userInfo,
          token,
          isLoggedIn: true,
        })
        console.log('[DEBUG_USER] 用户已登录:', userInfo.username)
      },

      logout: () => {
        set({
          userInfo: null,
          token: null,
          isLoggedIn: false,
        })
        console.log('[DEBUG_USER] 用户已登出')
      },

      updateUserInfo: userInfo => {
        set(state => ({
          userInfo: state.userInfo ? { ...state.userInfo, ...userInfo } : null,
        }))
        console.log('[DEBUG_USER] 用户信息已更新:', userInfo)
      },
    }),
    {
      name: STORAGE_KEYS.USER_INFO,
    },
  ),
)

