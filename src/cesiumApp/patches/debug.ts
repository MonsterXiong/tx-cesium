import * as Cesium from 'cesium'

/**
 * 扩展 Cesium PerformanceDisplay，添加模型/瓦片统计信息
 */
export function extendPerformanceDisplay(viewer: Cesium.Viewer) {
  const scene = viewer.scene

  // @ts-ignore
  const performanceDisplay = scene?._performanceDisplay

  if (!performanceDisplay) {
    console.warn('PerformanceDisplay not found')
    return
  }

  // @ts-ignore
  const container = performanceDisplay._container
  const display = container.querySelector('.cesium-performanceDisplay')

  const statsElement = document.createElement('div')
  statsElement.className = 'cesium-performanceDisplay-stats'
  statsElement.style.cssText = 'color: #fff; font-size: 10px; padding: 2px 5px;'
  display.appendChild(statsElement)

  // 缓存统计数据
  let lastUpdateTime = 0
  const UPDATE_INTERVAL = 1000 // 每 1 秒更新一次统计

  const originalUpdate = performanceDisplay.update.bind(performanceDisplay)

  performanceDisplay.update = function (renderedThisFrame: boolean) {
    originalUpdate(renderedThisFrame)
    const now = Date.now()

    // 只在间隔时间到了才重新计算
    if (now - lastUpdateTime > UPDATE_INTERVAL) {
      const cachedStats = collectSceneStats(scene)
      lastUpdateTime = now

      // DOM 也只在数据更新时才更新
      statsElement.innerHTML = `
        <table style="border-collapse: collapse; font-size: 10px;">
          <tr><td style="padding: 1px 8px 1px 0; text-align: right;">静态模型数量</td><td>${cachedStats.modelCount}</td></tr>
          <tr><td style="padding: 1px 8px 1px 0; text-align: right;">动态模型数量</td><td>${cachedStats.entityCount}</td></tr>
          <tr><td style="padding: 1px 8px 1px 0; text-align: right;">3D Tiles</td><td>${cachedStats.tilesetCount}</td></tr>
          <tr><td style="padding: 1px 8px 1px 0; text-align: right;">已加载分块</td><td>${cachedStats.tilesLoaded}</td></tr>
          <tr><td style="padding: 1px 8px 1px 0; text-align: right;">分块显存</td><td>${formatBytes(cachedStats.memoryUsed)}</td></tr>
        </table>
      `
    }
  }
}

/**
 * 收集场景统计信息
 */
function collectSceneStats(scene: Cesium.Scene) {
  let tilesetCount = 0
  let tilesLoaded = 0
  let tilesPending = 0 // 待加载瓦片
  let memoryUsed = 0
  let modelCount = 0
  let entityCount = 0

  for (let i = 0; i < scene.primitives.length; i++) {
    const primitive = scene.primitives.get(i)

    if (primitive instanceof Cesium.Cesium3DTileset) {
      tilesetCount++
      // @ts-ignore
      const stats = primitive.statistics

      if (stats) {
        tilesLoaded += stats.numberOfLoadedTilesTotal || 0
        tilesPending += stats.numberOfPendingRequests || 0
        memoryUsed += (stats.geometryByteLength || 0) +
          (stats.texturesByteLength || 0)
      }
    } else if (primitive instanceof Cesium.Model || primitive instanceof Cesium.GroundPrimitive ||
      primitive instanceof Cesium.Primitive) {
      // @ts-ignore 单独的 glTF/glb 模型
      if (primitive?.id instanceof Cesium.Entity) {
        entityCount++
      } else {
        modelCount++
      }
    }
  }

  return {
    tilesetCount,
    tilesLoaded,
    tilesPending,
    memoryUsed,
    modelCount,
    entityCount,
  }
}

/**
 * 格式化字节数为可读格式
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
