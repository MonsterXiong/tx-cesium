const CENTER_LON = 139.70
const CENTER_LAT = 35.69
// 100m ≈ 0.0009°, 5000m ≈ 0.045°
const DEG_PER_M = 1 / 111320  // 约 1 度 ≈ 111.32km at this latitude
const MIN_RADIUS_M = 100
const MAX_RADIUS_M = 5000
const MIN_H = 110
const MAX_H = 700
const EPOCH = '2025-07-21T16:00:00Z'
const NUM_POINTS = 7
const DURATION = 180


function randomIn(min, max) {
  return min + Math.random() * (max - min)
}

// 在半径 100–5000m 的圆环内取一点
function pointInAnnulus() {
  const r = Math.sqrt(randomIn(MIN_RADIUS_M * MIN_RADIUS_M, MAX_RADIUS_M * MAX_RADIUS_M))
  const angle = Math.random() * Math.PI * 2
  const dLon = (r * Math.cos(angle)) * DEG_PER_M / Math.cos(CENTER_LAT * Math.PI / 180)
  const dLat = r * Math.sin(angle) * DEG_PER_M
  return {
    lon: CENTER_LON + dLon,
    lat: CENTER_LAT + dLat,
    height: Math.round(randomIn(MIN_H, MAX_H))
  }
}

// 生成一条短路径（7 个点），所有点均在 100–5000m 范围内，高度 110–300
function generatePath() {
  const points = []
  for (let i = 0; i < NUM_POINTS; i++) {
    const p = pointInAnnulus()
    const t = (i / (NUM_POINTS - 1)) * DURATION
    points.push(Math.round(t), Number(p.lon.toFixed(6)), Number(p.lat.toFixed(6)), p.height)
  }
  return points
}

function entity(id, name, isRed) {
  const pathDegrees = generatePath()
  const pathColor = isRed ? [255, 50, 50, 50] : [50, 100, 255, 50]
  const modelColor = isRed ? [255, 60, 60, 180] : [80, 120, 255, 180]
  const billboardColor = isRed ? undefined : [100, 150, 255, 120]
  const billboard = {
    image: '/static/cesium-resources/symbol/curve-flag.svg',
    scale: 0.3,
    distanceDisplayCondition: { distanceDisplayCondition: [20000, 1e7] }
  }
  if (billboardColor) billboard.color = { rgba: billboardColor }

  return {
    id,
    name,
    position: {
      interpolationAlgorithm: 'LAGRANGE',
      interpolationDegree: 5,
      epoch: EPOCH,
      cartographicDegrees: pathDegrees,
      forwardExtrapolationType: 'HOLD',
      forwardExtrapolationDuration: 3600000,
      backwardExtrapolationType: 'HOLD',
      backwardExtrapolationDuration: 3600000
    },
    orientation: { velocityReference: '#position' },
    model: {
      gltf: '/static/cesium-resources/model/j20.glb',
      scale: 0.2,
      minimumPixelSize: 36,
      // color: { rgba: modelColor },
      // colorBlendMode: 'REPLACE',
      distanceDisplayCondition: { distanceDisplayCondition: [0, 20000] }
    },
    label: {
      text: name,
      font: 'bold 12px 黑体', // sans-serif
      fillColor: {
        rgba: modelColor
      },
      outlineColor: {
        rgba: [0, 0, 0, 255]
      },
      backgroundColor: {
        rgba: [0, 0, 0, 0],
      },
      backgroundPadding: {
        cartesian2: [4, 2],
      },
      showBackground: false,
      style: 'FILL_AND_OUTLINE',
      outlineWidth: 2,
      horizontalOrigin: 'CENTER',
      verticalOrigin: 'CENTER',
      pixelOffset: {
        cartesian2: [0, 16.0],
      },
      heightReference: 'NONE',
      distanceDisplayCondition: { distanceDisplayCondition: [0, 20000] },
    },
    billboard
    // path: {
    //   show: true,
    //   leadTime: 0,
    //   trailTime: 5,
    //   width: 2,
    //   material: { solidColor: { color: { rgba: pathColor } } }
    // }
  }
}

export function generateDynamic(number) {
  const doc = { id: 'document', version: '1.0' }
  const entities = [doc]

  for (let i = 0; i < Math.ceil(number / 2); i++) {
    entities.push(entity(`red-${i}`, `红方-${i + 1}`, true))
  }
  for (let i = 0; i < Math.floor(number / 2); i++) {
    entities.push(entity(`blue-${i}`, `蓝方-${i + 1}`, false))
  }
  return entities
}

/**
 * 生成静态模型数据（用于 InstancedModel）
 * @param {number} number - 模型数量
 * @returns {Array} 实例位置数组
 */
export function generateStatic(number) {
  const instances = []

  for (let i = 0; i < number; i++) {
    const isRed = i < Math.ceil(number / 2)
    const p = pointInAnnulus()

    instances.push({
      longitude: p.lon,
      latitude: p.lat,
      height: p.height + 800,
    })
  }

  return instances
}
