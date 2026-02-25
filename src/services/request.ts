/**
 * Axios 请求封装
 * 统一处理请求和响应拦截
 */

import axios, { AxiosError } from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import type { ResponseData } from '@/types/global'
import { storage, STORAGE_KEYS } from '@/utils/storage'
import { appConfig } from '@/config'

/**
 * 创建 Axios 实例
 */
const instance: AxiosInstance = axios.create({
  baseURL: appConfig.baseApi,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * 请求拦截器
 */
instance.interceptors.request.use(
  (config: any) => {
    // 添加 token
    const token = storage.get<string>(STORAGE_KEYS.TOKEN)
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    console.log('[DEBUG_REQUEST] 发送请求:', {
      url: config.url,
      method: config.method,
      data: config.data,
      params: config.params,
    })

    return config
  },
  (error: AxiosError) => {
    console.error('[DEBUG_REQUEST] 请求错误:', error)
    return Promise.reject(error)
  },
)

/**
 * 响应拦截器
 */
instance.interceptors.response.use(
  (response: AxiosResponse<ResponseData>) => {
    const { data } = response

    console.log('[DEBUG_RESPONSE] 收到响应:', {
      url: response.config.url,
      data,
    })

    // 根据业务状态码处理
    if (data.code === 200 || data.success) {
      return data.data
    }

    // 处理业务错误
    console.error('[DEBUG_RESPONSE] 业务错误:', data.message)
    return Promise.reject(new Error(data.message || '请求失败'))
  },
  (error: AxiosError<ResponseData>) => {
    console.error('[DEBUG_RESPONSE] 响应错误:', error)

    // 处理 HTTP 错误状态码
    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 401:
          // 未授权，清除 token 并跳转到登录页
          storage.remove(STORAGE_KEYS.TOKEN)
          storage.remove(STORAGE_KEYS.USER_INFO)
          window.location.href = '/login'
          break
        case 403:
          console.error('[DEBUG_RESPONSE] 无权限访问')
          break
        case 404:
          console.error('[DEBUG_RESPONSE] 请求的资源不存在')
          break
        case 500:
          console.error('[DEBUG_RESPONSE] 服务器错误')
          break
        default:
          console.error(`[DEBUG_RESPONSE] HTTP 错误: ${status}`)
      }

      return Promise.reject(new Error(data?.message || '请求失败'))
    }

    if (error.request) {
      console.error('[DEBUG_RESPONSE] 网络错误，请检查网络连接')
      return Promise.reject(new Error('网络错误，请检查网络连接'))
    }

    return Promise.reject(error)
  },
)

/**
 * 请求方法封装
 */
class Request {
  /**
   * GET 请求
   * @param url 请求地址
   * @param config 请求配置
   * @returns Promise
   */
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return instance.get(url, config)
  }

  /**
   * POST 请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 请求配置
   * @returns Promise
   */
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return instance.post(url, data, config)
  }

  /**
   * PUT 请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 请求配置
   * @returns Promise
   */
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return instance.put(url, data, config)
  }

  /**
   * DELETE 请求
   * @param url 请求地址
   * @param config 请求配置
   * @returns Promise
   */
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return instance.delete(url, config)
  }

  /**
   * PATCH 请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 请求配置
   * @returns Promise
   */
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return instance.patch(url, data, config)
  }

  /**
   * 上传文件
   * @param url 请求地址
   * @param file 文件对象
   * @param onProgress 上传进度回调
   * @returns Promise
   */
  upload<T = any>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void,
  ): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)

    return instance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: progressEvent => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      },
    })
  }

  /**
   * 下载文件
   * @param url 请求地址
   * @param filename 文件名
   * @returns Promise
   */
  download(url: string, filename?: string): Promise<void> {
    return instance
      .get(url, {
        responseType: 'blob',
      })
      .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob as any)
        const a = document.createElement('a')
        a.href = blobUrl
        a.download = filename || 'download'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(blobUrl)
      })
  }
}

// 导出请求实例
export const request = new Request()

// 导出 axios 实例（用于特殊场景）
export { instance as axiosInstance }

