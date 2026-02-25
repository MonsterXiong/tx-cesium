import * as Cesium from 'cesium'
import { EventEmitter } from '@/utils/eventEmitter'
import './materials' // 新版cesium是否能用待确定
import { extendPerformanceDisplay } from './patches/debug'

// @ts-expect-error 挂载到 window 方便控制台调试
window.Cesium = Cesium

/**
 * 地理坐标(经纬高)
 */
export interface Geographic {
  /** 经度 */
  longitude: number
  /** 纬度 */
  latitude: number
  /** 高度 */
  height: number
}

/**
 * PickPosition 根据屏幕位置拾取的地球位置坐标系合集
 */
export interface PickedPosition {
  /** 三维空间坐标(笛卡尔坐标) */
  cartesian: Cesium.Cartesian3
  /** 地理坐标(经纬高) */
  geographic: Geographic
}

/**
 * 事件数据对象类型定义
 */
export interface EventData {
  /** CesiumApp实例 */
  app: CesiumApp
  /** Cesium viewer实例 */
  viewer: Cesium.Viewer
  /** 屏幕坐标位置 */
  position: Cesium.Cartesian2
  /** 拾取的对象 */
  picked?: Cesium.Entity | null
  /** 拾取的地球位置坐标系合集 */
  pickedPosition: PickedPosition | null
  /** 原始事件对象 */
  raw: unknown
}

/**
 * CesiumApp 事件类型定义
 */
export interface CesiumAppEvents {
  /** 初始化完成事件 */
  initViewer: (viewer: Cesium.Viewer) => void
  /** 点击事件 */
  click: (data: EventData) => void
  /** 双击事件 */
  dblclick: (data: EventData) => void
  /** 右键菜单事件 */
  contextmenu: (data: EventData) => void
  /** 鼠标移动事件 */
  mousemove: (data: EventData) => void
  /** 选择事件 */
  select: (entity: Cesium.Entity | null) => void
}

class CesiumApp {
  /** 事件发射器实例 */
  private eventEmitter = new EventEmitter<CesiumAppEvents>()
  /** 本地存储的 key */
  CAMERA_STORAGE_KEY: string = 'cesium_camera_view'
  /** Cesium 视图容器元素 */
  container: HTMLElement | null = null
  /** Cesium 视图实例 */
  viewer: Cesium.Viewer | null = null
  /** Cesium 时钟视图模型 */
  clockViewModel: Cesium.ClockViewModel = new Cesium.ClockViewModel(new Cesium.Clock())
  /** Cesium 视图配置选项 */
  options: Cesium.Viewer.ConstructorOptions = {
    clockViewModel: this.clockViewModel,
    homeButton: true, // 是否显示回到初始视角按钮
    selectionIndicator: true, // 是否显示选择指示器
    animation: true, // 是否显示动画控件
    timeline: true, // 是否显示时间轴控件
    fullscreenButton: false, // 显示全屏按钮
    baseLayerPicker: false, // 是否显示图层选择器
    navigationHelpButton: false, // 是否显示导航帮助按钮
    navigationInstructionsInitiallyVisible: false, // 是否显示导航指示
    geocoder: false, // 是否显示地理编码器
    infoBox: false, // 是否显示信息框
    sceneModePicker: false, // 是否显示场景模式选择器
    // contextOptions: {
    //   webgl: {
    //     preserveDrawingBuffer: true, // 是否保留绘制缓冲区
    //     alpha: true, // 是否启用透明度
    //     failIfMajorPerformanceCaveat: false, // 是否在性能不足时失败
    //     powerPreference: 'high-performance', // 性能偏好
    //   },
    // },
  }
  /** Cesium 屏幕空间事件处理器 */
  private _handler: Cesium.ScreenSpaceEventHandler | null = null

  /** 当前活跃的鼠标事件 */
  activeMouseEvent: unknown | null = null
  czmlDataSource: Cesium.CzmlDataSource = new Cesium.CzmlDataSource('czmlDataSource')
  startTime: string = '2025-07-21T16:00:00Z'
  stopTime: string = '2025-07-21T16:03:00Z'
  constructor() {
    this.czmlDataSource.load([
      {
        id: 'document',
        version: '1.0',
        clock: {
          interval: `${this.startTime}/${this.stopTime}`,
          currentTime: this.startTime,
          multiplier: 1,
        },
      },
    ])
  }
  async init(el: HTMLElement | string | null, options: Cesium.Viewer.ConstructorOptions = {}): Promise<undefined> {
    const elDom = typeof el === 'string' ? document.querySelector(el) : el
    if (!elDom) throw new Error('CesiumApp: elDom not found')

    // 返回 缓存的实例 如果存在， 实现路由刷新，地图任然在的效果
    if (this.container) {
      elDom.appendChild(this.container)
      return
    } else {
      this.container = document.createElement('section')
      this.container.style.cssText = 'height: 100%; width: 100%;'
      elDom.appendChild(this.container)
    }
    // 创建新的实例
    this.viewer = new Cesium.Viewer(this.container, {
      terrainProvider: await Cesium.CesiumTerrainProvider.fromIonAssetId(2767062), // 官方地形
      maximumRenderTimeChange: Infinity,
      ...this.options,
      ...options,
    })
    this.initCameraPersistence()
    // 隐藏水印(类型断言解决类型错误)
    const creditContainer = this.viewer.cesiumWidget.creditContainer as HTMLElement
    const scene = this.viewer.scene
    creditContainer.style.display = 'none'

    scene.globe.depthTestAgainstTerrain = true // 开启深度测试
    scene.debugShowFramesPerSecond = true // 显示帧率
    await this.viewer.dataSources.add(this.czmlDataSource) // 添加 CZML 数据源
    // 光照设置
    const cameraLight = new Cesium.DirectionalLight({
      direction: scene.camera.directionWC, // Updated every frame
      intensity: 2.0,
    });
    scene.globe.enableLighting = true;
    scene.globe.dynamicAtmosphereLightingFromSun = false;
    scene.globe.dynamicAtmosphereLighting = false;
    scene.light = cameraLight;
    this.viewer.shadows = false
    scene.preRender.addEventListener(function (scene, time) {
      scene.light.direction = Cesium.Cartesian3.clone(
        scene.camera.directionWC,
        scene.light.direction,
      );
    });
    scene.fog.enabled = false
    scene.globe.showGroundAtmosphere = false
    // 设置地球图层滤镜
    // if (this.viewer.imageryLayers) {
    //   const layer = this.viewer.imageryLayers.get(0)
    //   layer.alpha = 1
    //   layer.brightness = 1
    //   layer.contrast = 1.5
    //   layer.hue = 0
    //   layer.saturation = 1.6
    //   layer.gamma = 1
    // }
    this._initScreenEvents()
    setTimeout(() => {
      extendPerformanceDisplay(this.viewer!) // 扩展性能显示
    }, 0)

    this._emit('initViewer', this.viewer!)
  }
  /**
   * 注册事件监听
   * @param event 事件名称
   * @param callback 回调函数
   * @returns 返回取消监听的函数
   */
  on<K extends keyof CesiumAppEvents>(event: K, callback: CesiumAppEvents[K]): () => void {
    return this.eventEmitter.on(event, callback)
  }

  /**
   * 注册一次性事件监听（触发后自动移除）
   * @param event 事件名称
   * @param callback 回调函数
   * @returns 返回取消监听的函数
   */
  once<K extends keyof CesiumAppEvents>(event: K, callback: CesiumAppEvents[K]): () => void {
    return this.eventEmitter.once(event, callback)
  }

  /**
   * 移除事件监听
   * @param event 事件名称
   * @param callback 回调函数（可选，不传则移除该事件的所有监听）
   */
  off<K extends keyof CesiumAppEvents>(event: K, callback?: CesiumAppEvents[K]): void {
    return this.eventEmitter.off(event, callback)
  }

  /**
   * 触发事件（内部使用）
   * @param event 事件名称
   * @param args 事件参数
   * @private
   */
  private _emit<K extends keyof CesiumAppEvents>(event: K, ...args: Parameters<CesiumAppEvents[K]>): void {
    this.eventEmitter.emit(event, ...args)
  }

  /**
   * 初始化屏幕事件
   * @private
   */
  private _initScreenEvents(): void {
    if (!this.viewer) return
    this._handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas)

    this._handler.setInputAction(
      (m: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
        const pickedPosition = this.pickPosition(m.position)
        this._emit('click', {
          app: this,
          viewer: this.viewer!,
          position: m.position,
          pickedPosition,
          raw: m,
        })
      },
      Cesium.ScreenSpaceEventType.LEFT_CLICK
    )

    this._handler.setInputAction(
      (m: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
        const pickedPosition = this.pickPosition(m.position)
        this._emit('dblclick', {
          app: this,
          viewer: this.viewer!,
          position: m.position,
          pickedPosition,
          raw: m,
        })
      },
      Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    )

    this._handler.setInputAction(
      (m: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
        const pickedPosition = this.pickPosition(m.position)
        this._emit('contextmenu', {
          app: this,
          viewer: this.viewer!,
          position: m.position,
          pickedPosition,
          raw: m,
        })
      },
      Cesium.ScreenSpaceEventType.RIGHT_CLICK
    )

    this._handler.setInputAction(
      (m: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
        this._emit('mousemove', {
          app: this,
          viewer: this.viewer!,
          position: m.endPosition || m.startPosition,
          pickedPosition: null,
          raw: m,
        })
      },
      Cesium.ScreenSpaceEventType.MOUSE_MOVE
    )
  }

  /**
   * 拾取对象
   * @param windowPosition 窗口坐标位置
   * @returns 拾取的对象
   */
  pick(windowPosition: Cesium.Cartesian2): Cesium.Entity | null {
    if (!this.viewer) return null
    return this.viewer.scene.drillPick(windowPosition).reduce((entity: Cesium.Entity, item) => {
      const { id } = item
      if (id instanceof Cesium.Entity && !id.parent) {
        // 优先拾取有属性的实例
        if (entity && !entity.properties) return entity
        return entity || id
      }
      return entity
    }, null)
  }

  /**
   * 根据屏幕位置拾取地图坐标
   * 支持拾取：地形、3D Tiles、Primitive
   * @param windowPosition 窗口坐标位置
   * @returns 拾取的地球位置坐标系合集
   */
  pickPosition(windowPosition: Cesium.Cartesian2): PickedPosition | null {
    if (!this.viewer) return null
    const scene = this.viewer.scene
    let cartesian: Cesium.Cartesian3 | null | undefined = null
    // 方法1: scene.pickPosition - 可以拾取地形和 3D Tiles
    // 前提：必须开启 depthTestAgainstTerrain
    if (scene.pickPositionSupported) cartesian = scene.pickPosition(windowPosition)
    // 方法2: 降级到 globe.pick（只能拾取地形，不含 3D Tiles
    if (!Cesium.defined(cartesian)) {
      const ray = scene.camera.getPickRay(windowPosition)
      if (ray && scene.globe) cartesian = scene.globe.pick(ray, scene)
    }
    // 方法3: 最后降级到椭球体
    if (!Cesium.defined(cartesian)) cartesian = scene.camera.pickEllipsoid(windowPosition, scene.globe?.ellipsoid)
    if (!Cesium.defined(cartesian)) return null

    const cartographic = Cesium.Cartographic.fromCartesian(cartesian)
    return {
      cartesian,
      geographic: {
        longitude: Cesium.Math.toDegrees(cartographic.longitude),
        latitude: Cesium.Math.toDegrees(cartographic.latitude),
        height: cartographic.height,
      },
    }
  }

  /**
   * 销毁实例
   */
  destroy(): void {
    window.removeEventListener('beforeunload', this.saveCameraView)
    // 移除所有事件监听
    this.eventEmitter.removeAllListeners()
    if (this._handler) {
      this._handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
      this._handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
      this._handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK)
      this._handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
      this._handler.destroy()
      this._handler = null
    }

    if (this.viewer) {
      this.viewer.destroy()
      this.viewer = null
    }
    if (this.container) {
      this.container.remove()
      this.container = null
    }
  }

  /**
   * 初始化相机视角持久化
   */
  private initCameraPersistence(): void {
    if (!this.viewer) return

    // 页面关闭/刷新前保存视角
    window.addEventListener('beforeunload', this.saveCameraView)

    // 恢复上次的视角
    this.restoreCameraView()
  }

  /**
   * 保存相机视角到 localStorage
   */
  private saveCameraView = () => {
    if (!this.viewer) return

    const camera = this.viewer.camera
    const view = {
      position: {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
      },
      heading: camera.heading,
      pitch: camera.pitch,
      roll: camera.roll,
    }
    localStorage.setItem(this.CAMERA_STORAGE_KEY, JSON.stringify(view))
    return view
  }

  /**
   * 从 localStorage 恢复相机视角
   */
  private restoreCameraView(): void {
    if (!this.viewer) return

    const saved = localStorage.getItem(this.CAMERA_STORAGE_KEY)
    if (!saved) return

    try {
      const view = JSON.parse(saved)
      this.viewer.camera.setView({
        destination: new Cesium.Cartesian3(
          view.position.x,
          view.position.y,
          view.position.z
        ),
        orientation: {
          heading: view.heading,
          pitch: view.pitch,
          roll: view.roll,
        },
      })
    } catch (e) {
      console.warn('[CesiumApp] Failed to restore camera view:', e)
      localStorage.removeItem(this.CAMERA_STORAGE_KEY)
    }
  }
}

// 返回一个默认实例，方便各个地方调用
export default new CesiumApp()
export { CesiumApp }
