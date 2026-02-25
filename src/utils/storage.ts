/**
 * 本地存储工具类
 * 封装 localStorage 和 sessionStorage
 */

/**
 * Storage 配置选项
 */
interface StorageOptions {
  /** 存储类型 */
  type?: 'local' | 'session'
  /** 过期时间（毫秒） */
  expire?: number
}

/**
 * 存储数据包装结构
 */
interface StorageData<T> {
  /** 实际数据 */
  value: T
  /** 过期时间戳 */
  expire?: number
}

class Storage {
  /**
   * 设置存储项
   * @param key 键名
   * @param value 值
   * @param options 配置选项
   */
  set<T>(key: string, value: T, options: StorageOptions = {}): void {
    const { type = 'local', expire } = options
    const storage = type === 'local' ? localStorage : sessionStorage

    const data: StorageData<T> = {
      value,
    }

    if (expire) {
      data.expire = Date.now() + expire
    }

    try {
      storage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error('[DEBUG_STORAGE] 存储失败:', error)
    }
  }

  /**
   * 获取存储项
   * @param key 键名
   * @param options 配置选项
   * @returns 值或 null
   */
  get<T>(key: string, options: StorageOptions = {}): T | null {
    const { type = 'local' } = options
    const storage = type === 'local' ? localStorage : sessionStorage

    try {
      const item = storage.getItem(key)
      if (!item) return null

      const data: StorageData<T> = JSON.parse(item)

      // 检查是否过期
      if (data.expire && Date.now() > data.expire) {
        this.remove(key, options)
        return null
      }

      return data.value
    } catch (error) {
      console.error('[DEBUG_STORAGE] 读取失败:', error)
      return null
    }
  }

  /**
   * 移除存储项
   * @param key 键名
   * @param options 配置选项
   */
  remove(key: string, options: StorageOptions = {}): void {
    const { type = 'local' } = options
    const storage = type === 'local' ? localStorage : sessionStorage
    storage.removeItem(key)
  }

  /**
   * 清空存储
   * @param options 配置选项
   */
  clear(options: StorageOptions = {}): void {
    const { type = 'local' } = options
    const storage = type === 'local' ? localStorage : sessionStorage
    storage.clear()
  }

  /**
   * 检查存储项是否存在
   * @param key 键名
   * @param options 配置选项
   * @returns 是否存在
   */
  has(key: string, options: StorageOptions = {}): boolean {
    return this.get(key, options) !== null
  }
}

// 导出单例
export const storage = new Storage()

// 常用存储键名常量
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER_INFO: 'userInfo',
  THEME: 'theme',
  SIDEBAR_COLLAPSED: 'sidebarCollapsed',
} as const

