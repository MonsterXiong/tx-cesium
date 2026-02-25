/**
 * 生成 largeMock.czml：高度 110-300m，活动范围 100-5000m，红蓝方 colorBlendMode REPLACE，200+ 架
 * 运行: node scripts/generate-large-mock-czml.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const CENTER_LON = 139.70
const CENTER_LAT = 35.69
// 100m ≈ 0.0009°, 5000m ≈ 0.045°
const DEG_PER_M = 1 / 111320  // 约 1 度 ≈ 111.32km at this latitude
const MIN_RADIUS_M = 100
const MAX_RADIUS_M = 5000
const MIN_H = 110
const MAX_H = 700
const EPOCH = '2025-07-21T16:00:00Z'
const NUM_RED = 500
const NUM_BLUE = 500
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
      color: { rgba: modelColor },
      colorBlendMode: 'REPLACE',
      distanceDisplayCondition: { distanceDisplayCondition: [0, 20000] }
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

const doc = { id: 'document', version: '1.0' }
const entities = [doc]

for (let i = 0; i < NUM_RED; i++) {
  entities.push(entity(`red-${i}`, `红方-${i + 1}`, true))
}
for (let i = 0; i < NUM_BLUE; i++) {
  entities.push(entity(`blue-${i}`, `蓝方-${i + 1}`, false))
}

const outPath = path.join(__dirname, '..', 'public', 'largeMock.czml')
fs.writeFileSync(outPath, JSON.stringify(entities, null, 2), 'utf8')
console.log(`Written ${entities.length - 1} entities to ${outPath}`)
