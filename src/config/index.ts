/**
 * 应用配置模块
 * 合并运行时配置（config.js）与构建时环境变量
 */

/**
 * Cesium 相关配置
 */
export interface CesiumConfig {
  /** Cesium Ion 访问令牌 */
  accessToken: string
  /** 自定义影像服务地址（如天地图、ArcGIS Server 等） */
  imageryUrl: string
}

/**
 * 应用配置接口
 */
export interface AppConfig {
  /** 后端 API 基础地址 */
  baseApi: string
  /** 系统名称，显示在浏览器标签页标题 */
  systemName: string
  /** 系统图标文本（如 RT、🚀） */
  systemIconText: string
  /** 系统图标地址（如 /logo.svg） */
  systemIconUrl: string
  /** Cesium 三维地图配置 */
  cesium: CesiumConfig
}

/**
 * 运行时配置类型（所有字段可选，undefined 表示使用环境变量）
 */
interface RuntimeConfig {
  baseApi?: string
  systemName?: string
  systemIconText?: string
  systemIconUrl?: string
  cesium?: {
    accessToken?: string
    imageryUrl?: string
  }
}

/**
 * 扩展 Window 接口，声明 __APP_CONFIG__ 属性
 */
declare global {
  interface Window {
    __APP_CONFIG__?: RuntimeConfig
  }
}

/**
 * 获取运行时配置（从 window.__APP_CONFIG__）
 * @returns 运行时配置对象
 */
const getRuntimeConfig = (): RuntimeConfig => {
  return window.__APP_CONFIG__ || {}
}

/**
 * 解析配置值
 * 根据环境优先级合并运行时配置和环境变量
 * - 生产环境：运行时配置 > 环境变量 > 默认值
 * - 开发环境：环境变量 > 运行时配置 > 默认值
 * @param runtimeVal 运行时配置值（config.js）
 * @param envVal 环境变量值
 * @param fallback 默认值
 * @returns 最终配置值
 */
const resolveValue = <T>(runtimeVal: T | undefined, envVal: T | undefined, fallback: T): T => {
  if (import.meta.env.DEV) {
    // 开发环境：环境变量优先
    return envVal ?? runtimeVal ?? fallback
  }
  // 生产环境：运行时配置优先
  return runtimeVal ?? envVal ?? fallback
}

/**
 * 创建应用配置
 * @returns 合并后的应用配置对象
 */
const createAppConfig = (): AppConfig => {
  const runtime = getRuntimeConfig()

  return {
    baseApi: resolveValue(
      runtime.baseApi,
      import.meta.env.VITE_APP_BASE_API,
      '/api'
    ),
    systemName: resolveValue(
      runtime.systemName,
      import.meta.env.VITE_APP_TITLE,
      'React Template'
    ),
    systemIconText: resolveValue(
      runtime.systemIconText,
      undefined,
      ''
    ),
    systemIconUrl: resolveValue(
      runtime.systemIconUrl,
      undefined,
      '/vite.svg'
    ),
    cesium: {
      accessToken: resolveValue(
        runtime.cesium?.accessToken,
        import.meta.env.VITE_CESIUM_ACCESS_TOKEN,
        ''
      ),
      imageryUrl: resolveValue(
        runtime.cesium?.imageryUrl,
        undefined,
        ''
      ),
    },
  }
}

/**
 * 应用配置单例
 * 使用方式：import { appConfig } from '@/config'
 */
export const appConfig: AppConfig = createAppConfig()

console.log('[DEBUG_APP] 应用配置已加载:', {
  baseApi: appConfig.baseApi,
  systemName: appConfig.systemName,
  systemIconText: appConfig.systemIconText,
  systemIconUrl: appConfig.systemIconUrl || '未配置',
  cesiumToken: appConfig.cesium.accessToken ? '已配置' : '未配置',
  imageryUrl: appConfig.cesium.imageryUrl || '使用默认',
})
