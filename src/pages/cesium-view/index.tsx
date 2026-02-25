import cesiumApp from '@/cesiumApp'
import { Button, InputNumber, Space, Switch } from 'antd'
import * as Cesium from 'cesium'
import { useEffect, useRef, useState } from 'react'
import { generateDynamic, generateStatic } from './utils/generate'

let cityTileset: Cesium.Cesium3DTileset | null = null
/**
 * Cesium 地图页面组件
 * @returns React 组件
 */
const CesiumViewPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  // 工具栏状态
  const [dynamicCount, setDynamicCount] = useState<number>(1000)
  const [staticCount, setStaticCount] = useState<number>(1000)
  const [cityLoaded, setCityLoaded] = useState(true)

  const loadCityTileset = () => {
    if (!cesiumApp.viewer) return
    Cesium.Cesium3DTileset.fromUrl('/public/shinjuku/city/tileset.json', {
      maximumScreenSpaceError: 36,        // 首次加载用较大值，加快显示
      // 缓存目标大小（字节），默认 512MB
      cacheBytes: 1 * 1024 * 1024 * 1024,  // 1GB
      progressiveResolutionHeightFraction: 0.5,  // 先加载 50% 分辨率
      // 允许超出的最大额外内存，默认 512MB
      maximumCacheOverflowBytes: 2 * 1024 * 1024 * 1024,  // 1GB
      // preloadWhenHidden: false,           // 隐藏时不预加载
      // preloadFlightDestinations: false,   // 不预加载飞行目的地
      // // ========== 加载限流 ==========
      // foveatedScreenSpaceError: true, // 视锥中心高精度，边缘低精度
      // foveatedConeSize: 0.1,          // 视锥中心区域大小
      // foveatedMinimumScreenSpaceErrorRelaxation: 0.0,
      // 跳级加载，先上粗模型，避免远景“缺块”
      skipLevelOfDetail: true,
      baseScreenSpaceError: 1024,
      skipScreenSpaceErrorFactor: 16,
      skipLevels: 1,
    }).then((tileset) => {
      cityTileset = tileset
      cesiumApp?.viewer?.scene?.primitives.add(cityTileset) // 添加 3D Tiles 数据集
      // !localStorage.getItem(cesiumApp.CAMERA_STORAGE_KEY) && viewer.zoomTo(tileset) // 缩放至 3D Tiles 数据集
    })
  }

  /** 生成动态模型（带路径） */
  const handleGenerateDynamic = () => {
    cesiumApp.czmlDataSource.process(generateDynamic(dynamicCount))
  }

  /** 生成静态模型 */
  const handleGenerateStatic = () => {
    const instances = generateStatic(staticCount)
    if (!cesiumApp.viewer) return
    const urls = [
      '/static/cesium-resources/model/house.glb',
      '/static/cesium-resources/model/tree1.glb',
      '/static/cesium-resources/model/tree2.glb',
    ]
    const scales = [
      0.7,
      0.06,
      3,
    ]
    Promise.all(
      instances.map((item, index) => {
        return Cesium.Model.fromGltfAsync({
          url: urls[index % urls.length],
          modelMatrix: Cesium.Transforms.headingPitchRollToFixedFrame(
            Cesium.Cartesian3.fromDegrees(
              item.longitude,
              item.latitude,
              90
            ),
            new Cesium.HeadingPitchRoll(0, 0, 0)
          ),
          allowPicking: false,
          maximumScale: 3,
          scale: scales[index % urls.length],
        })
      })
    ).then((models) => {
      models.forEach((model) => {
        cesiumApp.viewer?.scene.primitives.add(model)
      })
    })
  }

  /** 加载/卸载城市 3D Tiles */
  const handleToggleCity = (checked: boolean) => {
    if (!cesiumApp.viewer) return
    setCityLoaded(checked)
    if (checked) {
      loadCityTileset()
    } else {
      cesiumApp.viewer.scene?.primitives.remove(cityTileset)
    }
  }

  useEffect(() => {
    // @ts-expect-error 挂载到 window 方便控制台调试
    window.cesiumApp = cesiumApp
    cesiumApp.init(containerRef.current)
    const removeCbs = [
      cesiumApp.on('initViewer', (viewer) => {
        cesiumApp.czmlDataSource.process('/public/mock.czml')
        loadCityTileset()
        viewer?.camera.setView({
          destination: new Cesium.Cartesian3(
            -3955338.243472875,
            3354739.927930116,
            3700161.986344312
          ),
          orientation: {
            heading: 5.906217417418738,
            pitch: -0.318456883906725,
            roll: 0.0000015452469162013927
          },
        })
        // cesiumApp.czmlDataSource.process('/public/largeMock.czml')
      }),
      cesiumApp.on('click', (data) => {
        console.log(data.pickedPosition?.geographic)
        console.log([data.pickedPosition?.geographic.longitude, data.pickedPosition?.geographic.latitude, data.pickedPosition?.geographic.height])
        if (!Cesium.defined(data.pickedPosition?.cartesian)) return
        // cesiumApp.viewer?.entities.add({
        //   position: data.pickedPosition?.cartesian,
        //   model: {
        //     uri: '/public/static/cesium-resources/model/defaultModel.glb',
        //     scale: 1.0,
        //     minimumPixelSize: 32,
        //     distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 5000),
        //   },
        //   billboard: {
        //     image: '/public/static/cesium-resources/symbol/curve-flag.svg',
        //     scale: 0.8,
        //     distanceDisplayCondition: new Cesium.DistanceDisplayCondition(5000, 1e7),
        //   },
        // })
      }),
    ]
    return () => {
      removeCbs.forEach((cb) => cb())
    }
  }, [])
  return (
    <div className="relative h-full w-full">
      <div className="fade-in h-full w-full" ref={containerRef} />

      {/* 左上角工具栏 */}
      <div className="absolute top-4 left-4 z-10 bg-black/70 p-3 rounded-lg shadow-lg">
        {/* 第一行：动态模型 */}
        <Space.Compact block className="mb-2">
          <InputNumber
            value={dynamicCount}
            onChange={(v) => setDynamicCount(v ?? 100)}
            min={1}
            max={2000}
            style={{ width: 100 }}
            placeholder="数量"
          />
          <Button type="primary" onClick={handleGenerateDynamic}>
            生成动态模型
          </Button>
        </Space.Compact>

        {/* 第二行：静态模型 */}
        <Space.Compact block className="mb-2">
          <InputNumber
            value={staticCount}
            onChange={(v) => setStaticCount(v ?? 50)}
            min={1}
            max={10000}
            style={{ width: 100 }}
            placeholder="数量"
          />
          <Button type="primary" className="bg-green-600!" onClick={handleGenerateStatic}>
            生成静态模型
          </Button>
        </Space.Compact>

        {/* 第三行：城市 3D Tiles 开关 */}
        <div className="flex items-center justify-between text-white">
          <span>城市 3D Tiles</span>
          <Switch checked={cityLoaded} onChange={handleToggleCity} />
        </div>
      </div>
    </div>
  )
}

export default CesiumViewPage
