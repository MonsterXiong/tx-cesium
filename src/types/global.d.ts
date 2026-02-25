/**
 * 全局类型定义
 */

/**
 * 主题模式类型
 */
export type ThemeMode = 'light' | 'dark'

/**
 * 路由元信息接口
 */
export interface RouteMeta {
  /** 路由标题 */
  title?: string
  /** 图标 */
  icon?: React.ReactNode
  /** 是否需要登录 */
  requiresAuth?: boolean
  /** 是否在菜单中隐藏 */
  hideInMenu?: boolean
  /** 权限标识 */
  permissions?: string[]
  /** 面包屑导航 */
  breadcrumb?: boolean
}

/**
 * 路由配置接口
 */
export interface RouteConfig {
  /** 路由路径 */
  path: string
  /** 路由元信息 */
  meta?: RouteMeta
  /** 子路由 */
  children?: RouteConfig[]
  /** 组件 */
  element?: React.ReactNode
  /** 重定向 */
  redirect?: string
}

/**
 * 用户信息接口
 */
export interface UserInfo {
  /** 用户ID */
  id: string | number
  /** 用户名 */
  username: string
  /** 昵称 */
  nickname?: string
  /** 头像 */
  avatar?: string
  /** 邮箱 */
  email?: string
  /** 角色 */
  roles?: string[]
  /** 权限 */
  permissions?: string[]
}

/**
 * 响应数据结构
 */
export interface ResponseData<T = any> {
  /** 状态码 */
  code: number
  /** 消息 */
  message: string
  /** 数据 */
  data: T
  /** 是否成功 */
  success: boolean
}

/**
 * 分页参数
 */
export interface PaginationParams {
  /** 当前页码 */
  page: number
  /** 每页数量 */
  pageSize: number
}

/**
 * 分页响应数据
 */
export interface PaginationResponse<T = any> {
  /** 列表数据 */
  list: T[]
  /** 总数 */
  total: number
  /** 当前页码 */
  page: number
  /** 每页数量 */
  pageSize: number
}

/**
 * 环境变量类型扩展
 */
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_BASE_API: string
  readonly VITE_APP_PORT: number
  readonly VITE_CESIUM_BASE_URL: string
  readonly VITE_CESIUM_ACCESS_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

