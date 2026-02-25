# Cesium 新版（对比 1.82）性能优化清单与推荐设置

## 1. 升级后重点优化点清单（对比 1.82）

- `Scene.msaaSamples`：新版可控（WebGL2），可在抗锯齿和性能间做明确取舍。
- `Cesium3DTileset.cacheBytes` + `maximumCacheOverflowBytes`：新版细粒度显存缓存控制，比 `maximumMemoryUsage` 更工程化。
- `dynamicScreenSpaceError` 默认策略更激进：新版默认倾向开启并提升远景降精度力度。
- `requestRenderMode` 体系仍是核心：不是新增，但在新版配合其他参数收益更稳定。
- Viewer/Scene 像素策略依旧关键：`useBrowserRecommendedResolution` + `resolutionScale` 对中低端机影响最大。

---

## 2. 推荐性能设置（基线配置）

### 2.1 Viewer/Scene 层（推荐默认）

```ts
const viewer = new Cesium.Viewer('cesiumContainer', {
  requestRenderMode: true,
  maximumRenderTimeChange: Infinity, // 静态场景建议
  useBrowserRecommendedResolution: true,
})

viewer.resolutionScale = 0.9 // PC可1.0，弱机0.7~0.9
viewer.scene.msaaSamples = 2 // 新版可调：1/2/4（4更清晰，开销更高）
```

#### 建议值

- `requestRenderMode: true`：必开（非强实时场景）。
- `maximumRenderTimeChange`：
  - 静态/低频更新：`Infinity`
  - 有时间轴动画：`0.2 ~ 1.0`
- `resolutionScale`：
  - 办公本/核显：`0.7 ~ 0.85`
  - 常规独显：`0.9 ~ 1.0`
- `msaaSamples`：
  - 追求性能：`1` 或 `2`
  - 画质优先：`4`

### 2.2 3D Tiles 层（城市级场景推荐）

```ts
const tileset = await Cesium.Cesium3DTileset.fromUrl(url, {
  maximumScreenSpaceError: 24, // 16清晰，24~32更省
  dynamicScreenSpaceError: true,
  dynamicScreenSpaceErrorDensity: 2.0e-4,
  dynamicScreenSpaceErrorFactor: 24.0,
  dynamicScreenSpaceErrorHeightFalloff: 0.25,

  cullRequestsWhileMoving: true,
  cullRequestsWhileMovingMultiplier: 60.0,
  foveatedScreenSpaceError: true,
  foveatedTimeDelay: 0.2,

  // 新版建议优先用这组内存参数
  cacheBytes: 512 * 1024 * 1024,
  maximumCacheOverflowBytes: 256 * 1024 * 1024,
})
```

#### 建议值

- `maximumScreenSpaceError`：`16`（清晰） / `24~32`（性能）
- `dynamicScreenSpaceError*`：建议保持新版默认起步，再按视觉调。
- `cacheBytes`：
  - 8GB 内存办公机：`256~512MB`
  - 16GB+ 独显：`512MB~1GB`
- `maximumCacheOverflowBytes`：`cacheBytes` 的 `30%~60%`。

---

## 3. 按场景的推荐档位

### 3.1 大场景漫游（性能优先）

- `resolutionScale=0.75~0.85`
- `msaaSamples=1~2`
- `maximumScreenSpaceError=24~32`
- `requestRenderMode=true`

### 3.2 指挥调度/监控（平衡）

- `resolutionScale=0.85~1.0`
- `msaaSamples=2`
- `maximumScreenSpaceError=20~24`
- `dynamicScreenSpaceError=true`

### 3.3 演示汇报（画质优先）

- `resolutionScale=1.0`
- `msaaSamples=4`
- `maximumScreenSpaceError=16`
- 必要时临时关闭部分后处理特效以稳帧

---

## 4. 避坑清单（最常见）

- 开了 `requestRenderMode=true` 却忘记在业务状态变化后 `scene.requestRender()`。
- `resolutionScale=1 + msaa=4 + 阴影 + 后处理` 同时开，容易掉帧。
- `maximumScreenSpaceError` 设太小（如 `8~12`）导致请求风暴和显存压力。
- 缓存参数过小导致频繁抖动重载，过大导致占用飙升。
- 用老参数思路只盯 `maximumMemoryUsage`，忽略新版 `cacheBytes` 体系。

---

## 5. 三档可直接复制的配置代码（用于快速落地）

### 5.1 配置对象定义

```ts
type CesiumPerformanceProfile = {
  /** Viewer 构造参数 */
  viewerOptions: {
    requestRenderMode: boolean
    maximumRenderTimeChange: number
    useBrowserRecommendedResolution: boolean
  }
  /** Viewer 运行时参数 */
  viewerRuntime: {
    resolutionScale: number
    msaaSamples: number
  }
  /** 3D Tiles 参数 */
  tilesetOptions: {
    maximumScreenSpaceError: number
    dynamicScreenSpaceError: boolean
    dynamicScreenSpaceErrorDensity: number
    dynamicScreenSpaceErrorFactor: number
    dynamicScreenSpaceErrorHeightFalloff: number
    cullRequestsWhileMoving: boolean
    cullRequestsWhileMovingMultiplier: number
    foveatedScreenSpaceError: boolean
    foveatedTimeDelay: number
    cacheBytes: number
    maximumCacheOverflowBytes: number
  }
}

const MB = 1024 * 1024

export const CESIUM_PROFILES: Record<
  'lowProfile' | 'balancedProfile' | 'qualityProfile',
  CesiumPerformanceProfile
> = {
  // 低配设备：优先稳帧和流畅
  lowProfile: {
    viewerOptions: {
      requestRenderMode: true,
      maximumRenderTimeChange: Infinity,
      useBrowserRecommendedResolution: true,
    },
    viewerRuntime: {
      resolutionScale: 0.75,
      msaaSamples: 1,
    },
    tilesetOptions: {
      maximumScreenSpaceError: 32,
      dynamicScreenSpaceError: true,
      dynamicScreenSpaceErrorDensity: 2.0e-4,
      dynamicScreenSpaceErrorFactor: 28.0,
      dynamicScreenSpaceErrorHeightFalloff: 0.25,
      cullRequestsWhileMoving: true,
      cullRequestsWhileMovingMultiplier: 70.0,
      foveatedScreenSpaceError: true,
      foveatedTimeDelay: 0.25,
      cacheBytes: 256 * MB,
      maximumCacheOverflowBytes: 128 * MB,
    },
  },

  // 默认平衡：适合大多数业务终端
  balancedProfile: {
    viewerOptions: {
      requestRenderMode: true,
      maximumRenderTimeChange: Infinity,
      useBrowserRecommendedResolution: true,
    },
    viewerRuntime: {
      resolutionScale: 0.9,
      msaaSamples: 2,
    },
    tilesetOptions: {
      maximumScreenSpaceError: 24,
      dynamicScreenSpaceError: true,
      dynamicScreenSpaceErrorDensity: 2.0e-4,
      dynamicScreenSpaceErrorFactor: 24.0,
      dynamicScreenSpaceErrorHeightFalloff: 0.25,
      cullRequestsWhileMoving: true,
      cullRequestsWhileMovingMultiplier: 60.0,
      foveatedScreenSpaceError: true,
      foveatedTimeDelay: 0.2,
      cacheBytes: 512 * MB,
      maximumCacheOverflowBytes: 256 * MB,
    },
  },

  // 高画质演示：追求观感，需更高硬件余量
  qualityProfile: {
    viewerOptions: {
      requestRenderMode: true,
      maximumRenderTimeChange: 0.5,
      useBrowserRecommendedResolution: false,
    },
    viewerRuntime: {
      resolutionScale: 1.0,
      msaaSamples: 4,
    },
    tilesetOptions: {
      maximumScreenSpaceError: 16,
      dynamicScreenSpaceError: true,
      dynamicScreenSpaceErrorDensity: 2.0e-4,
      dynamicScreenSpaceErrorFactor: 20.0,
      dynamicScreenSpaceErrorHeightFalloff: 0.25,
      cullRequestsWhileMoving: true,
      cullRequestsWhileMovingMultiplier: 50.0,
      foveatedScreenSpaceError: true,
      foveatedTimeDelay: 0.15,
      cacheBytes: 1024 * MB,
      maximumCacheOverflowBytes: 512 * MB,
    },
  },
}
```

### 5.2 使用示例

```ts
const profile = CESIUM_PROFILES.balancedProfile

const viewer = new Cesium.Viewer('cesiumContainer', profile.viewerOptions)
viewer.resolutionScale = profile.viewerRuntime.resolutionScale
viewer.scene.msaaSamples = profile.viewerRuntime.msaaSamples

const tileset = await Cesium.Cesium3DTileset.fromUrl(url, profile.tilesetOptions)
viewer.scene.primitives.add(tileset)
```

### 5.3 切换建议

- 设备是核显或远程桌面：优先 `lowProfile`
- 业务默认环境：优先 `balancedProfile`
- 汇报/录屏/验收演示：临时切到 `qualityProfile`
- 如果出现掉帧，按顺序回退：`resolutionScale` -> `msaaSamples` -> `maximumScreenSpaceError`
