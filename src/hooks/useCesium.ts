/**
 * Cesium Hook
 * 封装 Cesium 初始化和常用操作
 */

import { useEffect, useRef, useState } from 'react'
import * as Cesium from 'cesium'
import { appConfig } from '@/config'

/**
 * Cesium Viewer 配置选项
 */
export interface CesiumViewerOptions extends Cesium.Viewer.ConstructorOptions {
  /** 容器 ID */
  containerId?: string
}

/**
 * 使用 Cesium Viewer Hook
 * @param options Cesium Viewer 配置选项
 * @returns Viewer 实例和加载状态
 */
export const useCesiumViewer = (options?: CesiumViewerOptions) => {
  const viewerRef = useRef<Cesium.Viewer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    return () => {
      // 清理 Viewer 实例
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy()
        viewerRef.current = null
        console.log('[DEBUG_CESIUM] Viewer 已销毁')
      }
    }
  }, [])

  /**
   * 初始化 Viewer
   * @param container 容器元素
   */
  const initViewer = (container: HTMLElement | string) => {
    try {
      setLoading(true)
      setError(null)

      // 设置 Cesium Token
      const token = appConfig.cesium.accessToken
      if (token && token !== 'your_cesium_access_token_here') {
        Cesium.Ion.defaultAccessToken = token
      }

      // 创建 Viewer
      const viewer = new Cesium.Viewer(container, {
        animation: false,
        timeline: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        baseLayerPicker: false,
        navigationHelpButton: false,
        fullscreenButton: false,
        ...options,
      })

      // 移除版权信息
      ;(viewer.cesiumWidget.creditContainer as HTMLElement).style.display = 'none'

      viewerRef.current = viewer
      setLoading(false)

      console.log('[DEBUG_CESIUM] Viewer 初始化成功')

      return viewer
    } catch (err) {
      const error = err as Error
      setError(error)
      setLoading(false)
      console.error('[DEBUG_CESIUM] Viewer 初始化失败:', error)
      return null
    }
  }

  /**
   * 飞行到指定位置
   * @param position 位置坐标 [经度, 纬度, 高度]
   */
  const flyTo = (position: [number, number, number]) => {
    if (!viewerRef.current) return

    viewerRef.current.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(position[0], position[1], position[2]),
      duration: 2,
    })
  }

  /**
   * 添加点实体
   * @param position 位置坐标 [经度, 纬度, 高度]
   * @param options 实体配置
   * @returns 实体对象
   */
  const addPoint = (
    position: [number, number, number],
    options?: {
      name?: string
      color?: Cesium.Color
      pixelSize?: number
    },
  ) => {
    if (!viewerRef.current) return null

    const entity = viewerRef.current.entities.add({
      name: options?.name || 'Point',
      position: Cesium.Cartesian3.fromDegrees(position[0], position[1], position[2]),
      point: {
        pixelSize: options?.pixelSize || 10,
        color: options?.color || Cesium.Color.RED,
      },
    })

    return entity
  }

  return {
    viewer: viewerRef.current,
    loading,
    error,
    initViewer,
    flyTo,
    addPoint,
  }
}

