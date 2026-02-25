/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * 事件回调函数类型
 */
export type EventCallback<T extends any[] = any[]> = (...args: T) => void

/**
 * 事件映射类型 - 支持任意函数类型
 */
export type EventMap = Record<string, (...args: any[]) => any>

/**
 * 事件发射器基类
 * 提供事件订阅、取消订阅和触发功能
 */
export class EventEmitter<T extends Record<keyof T, (...args: any[]) => any> = EventMap> {
  /**
   * 事件回调集合
   * @private
   */
  // 使用 any 或更宽泛的函数类型来存储，内部调用时再通过泛型还原类型
  private _events: Map<keyof T, Set<(...args: any[]) => any>> = new Map()

  /**
   * 注册事件监听
   * @param event 事件名称
   * @param callback 回调函数
   * @returns 返回取消监听的函数
   */
  on<K extends keyof T>(event: K, callback: T[K]): () => void {
    if (!this._events.has(event)) {
      this._events.set(event, new Set())
    }
    this._events.get(event)!.add(callback as EventCallback)

    // 返回取消监听的函数
    return () => this.off(event, callback)
  }

  /**
   * 注册一次性事件监听（触发后自动移除）
   * @param event 事件名称
   * @param callback 回调函数
   * @returns 返回取消监听的函数
   */
  once<K extends keyof T>(event: K, callback: T[K]): () => void {
    const onceCallback = ((...args: Parameters<T[K]>) => {
      callback(...args)
      this.off(event, onceCallback as T[K])
    }) as T[K]

    return this.on(event, onceCallback)
  }

  /**
   * 移除事件监听
   * @param event 事件名称
   * @param callback 回调函数（可选，不传则移除该事件的所有监听）
   */
  off<K extends keyof T>(event: K, callback?: T[K]): void {
    const callbacks = this._events.get(event)
    if (!callbacks) return

    if (callback) {
      // 移除指定的回调
      callbacks.delete(callback as EventCallback)
      // 如果没有回调了，删除该事件
      if (callbacks.size === 0) {
        this._events.delete(event)
      }
    } else {
      // 移除该事件的所有回调
      this._events.delete(event)
    }
  }

  /**
   * 触发事件
   * @param event 事件名称
   * @param args 事件参数
   */
  emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>): void {
    const callbacks = this._events.get(event)
    if (!callbacks || callbacks.size === 0) return

    // 复制一份回调集合，避免在回调中修改原集合
    const callbacksCopy = new Set(callbacks)
    callbacksCopy.forEach((callback) => {
      try {
        callback(...args)
      } catch (error) {
        console.error(`[DEBUG_EVENT] 事件 ${String(event)} 的回调执行出错:`, error)
      }
    })
  }

  /**
   * 移除所有事件监听
   */
  removeAllListeners(): void {
    this._events.clear()
  }

  /**
   * 获取指定事件的所有监听器数量
   * @param event 事件名称
   * @returns 监听器数量
   */
  listenerCount<K extends keyof T>(event: K): number {
    return this._events.get(event)?.size || 0
  }

  /**
   * 获取所有事件名称
   * @returns 事件名称数组
   */
  eventNames(): (keyof T)[] {
    return Array.from(this._events.keys())
  }
}
