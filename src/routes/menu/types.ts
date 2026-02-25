/**
 * 菜单路由类型定义
 * 统一管理菜单与路由配置的类型
 */

/**
 * 菜单路由配置接口
 */
export interface MenuItem {
  /** 唯一标识（用于 key） */
  id: string
  /** 路由路径，父级菜单可不填 */
  path?: string
  /** 菜单标题 */
  title: string
  /** 图标（直接使用 React 组件，如 <HomeOutlined />） */
  icon?: React.ReactNode
  /** 排序权重，数字越小越靠前，默认 999 */
  order?: number
  /** 子菜单 */
  children?: MenuItem[]
  /** 是否在菜单中隐藏 */
  hideInMenu?: boolean
  /** 是否需要登录 */
  requiresAuth?: boolean
  /** 权限标识列表 */
  permissions?: string[]
  /** 重定向路径 */
  redirect?: string
  /** 是否为外链 */
  external?: boolean
  /** 外链地址 */
  externalUrl?: string
  /** 外链打开方式 */
  target?: '_blank' | '_self'
  /** 懒加载组件（使用 lazy(() => import('@/pages/xxx'))） */
  component?: React.LazyExoticComponent<React.ComponentType>
  /** 是否缓存页面（配合 keep-alive） */
  keepAlive?: boolean
  /** 扩展字段 */
  [key: string]: unknown
}
