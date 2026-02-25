/**
 * 用户相关枚举
 */

export const userRole = {
  ADMIN: { value: 'admin', label: '管理员', color: 'red' },
  USER: { value: 'user', label: '普通用户', color: 'blue' },
  GUEST: { value: 'guest', label: '访客', color: 'default' },
} as const

export const userStatus = {
  NORMAL: { value: 'normal', label: '正常', color: 'green' },
  DISABLED: { value: 'disabled', label: '禁用', color: 'red' },
  LOCKED: { value: 'locked', label: '锁定', color: 'orange' },
} as const
