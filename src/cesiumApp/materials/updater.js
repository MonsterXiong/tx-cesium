import * as Cesium from 'cesium'
import { CustomMaterials } from './resources'

function intervalFromIso8601String(str) {
  return (
    str &&
    Cesium.TimeInterval.fromIso8601({
      iso8601: str,
    })
  )
}
const processPacketData = Cesium.CzmlDataSource.processPacketData

function defined(value) {
  return value !== undefined && value !== null
}

function processMaterialProperty(object, propertyName, packetData, constrainedInterval, sourceUri, entityCollection) {
  var combinedInterval = intervalFromIso8601String(packetData.interval)
  if (defined(constrainedInterval)) {
    if (defined(combinedInterval)) {
      combinedInterval = Cesium.TimeInterval.intersect(
        combinedInterval,
        constrainedInterval,
        // scratchTimeInterval
        new Cesium.TimeInterval()
      )
    } else {
      combinedInterval = constrainedInterval
    }
  }

  var property = object[propertyName]
  var existingMaterial
  var existingInterval

  if (defined(combinedInterval)) {
    if (!(property instanceof Cesium.CompositeMaterialProperty)) {
      property = new Cesium.CompositeMaterialProperty()
      object[propertyName] = property
    }
    //See if we already have data at that interval.
    var thisIntervals = property.intervals
    existingInterval = thisIntervals.findInterval({
      start: combinedInterval.start,
      stop: combinedInterval.stop,
    })
    if (defined(existingInterval)) {
      //We have an interval, but we need to make sure the
      //new data is the same type of material as the old data.
      existingMaterial = existingInterval.data
    } else {
      //If not, create it.
      existingInterval = combinedInterval.clone()
      thisIntervals.addInterval(existingInterval)
    }
  } else {
    existingMaterial = property
  }

  var materialData
  // if (defined(packetData.solidColor)) {
  //   if (!(existingMaterial instanceof Cesium.ColorMaterialProperty)) {
  //     existingMaterial = new Cesium.ColorMaterialProperty()
  //   }
  //   materialData = packetData.solidColor
  //   processPacketData(
  //     Cesium.Color,
  //     existingMaterial,
  //     'color',
  //     materialData.color,
  //     undefined,
  //     undefined,
  //     entityCollection
  //   )
  // } else if (defined(packetData.grid)) {
  //   if (!(existingMaterial instanceof Cesium.GridMaterialProperty)) {
  //     existingMaterial = new Cesium.GridMaterialProperty()
  //   }
  //   materialData = packetData.grid
  //   processPacketData(
  //     Cesium.Color,
  //     existingMaterial,
  //     'color',
  //     materialData.color,
  //     undefined,
  //     sourceUri,
  //     entityCollection
  //   )
  //   processPacketData(
  //     Number,
  //     existingMaterial,
  //     'cellAlpha',
  //     materialData.cellAlpha,
  //     undefined,
  //     sourceUri,
  //     entityCollection
  //   )
  //   processPacketData(
  //     Cesium.Cartesian2,
  //     existingMaterial,
  //     'lineCount',
  //     materialData.lineCount,
  //     undefined,
  //     sourceUri,
  //     entityCollection
  //   )
  //   processPacketData(
  //     Cesium.Cartesian2,
  //     existingMaterial,
  //     'lineThickness',
  //     materialData.lineThickness,
  //     undefined,
  //     sourceUri,
  //     entityCollection
  //   )
  //   processPacketData(
  //     Cesium.Cartesian2,
  //     existingMaterial,
  //     'lineOffset',
  //     materialData.lineOffset,
  //     undefined,
  //     sourceUri,
  //     entityCollection
  //   )
  // }

  Object.keys(CustomMaterials).forEach((k) => {
    const materialType = CustomMaterials[k].type

    if (defined(packetData[materialType])) {
      materialData = packetData[materialType]

      // if (!(existingMaterial instanceof CustomMaterials[k].constructor)) {
      // }
      existingMaterial = new CustomMaterials[k].constructor(materialData)

      processPacketData(Cesium.Color, existingMaterial, 'color', materialData.color, undefined, sourceUri, entityCollection)
    }
  })

  if (defined(existingInterval)) {
    existingInterval.data = existingMaterial
  } else {
    object[propertyName] = existingMaterial
  }
}

function processMaterialPacketData(object, propertyName, packetData, interval, sourceUri, entityCollection) {
  if (!defined(packetData)) {
    return
  }

  if (Array.isArray(packetData)) {
    for (var i = 0, len = packetData.length; i < len; ++i) {
      processMaterialProperty(object, propertyName, packetData[i], interval, sourceUri, entityCollection)
    }
  } else {
    processMaterialProperty(object, propertyName, packetData, interval, sourceUri, entityCollection)
  }
}

function processPolylineMaterial(entity, packet, entityCollection, sourceUri) {
  var polylineData = packet.polyline
  if (!defined(polylineData)) {
    return
  }

  var interval = intervalFromIso8601String(polylineData.interval)
  var polyline = entity.polyline

  if (!defined(polyline)) {
    entity.polyline = polyline = new Cesium.PolylineGraphics()
  }

  processMaterialPacketData(polyline, 'material', polylineData.material, interval, sourceUri, entityCollection)
}

function processPathMaterial(entity, packet, entityCollection, sourceUri) {
  var pathData = packet.path
  if (!defined(pathData)) {
    return
  }

  var interval = intervalFromIso8601String(pathData.interval)
  var path = entity.path
  if (!defined(path)) {
    entity.path = path = new Cesium.PathGraphics()
  }

  processMaterialPacketData(path, 'material', pathData.material, interval, sourceUri, entityCollection)
}

function processEllipseMaterial(entity, packet, entityCollection, sourceUri) {
  var ellipseData = packet.ellipse
  if (!defined(ellipseData)) {
    return
  }

  var interval = intervalFromIso8601String(ellipseData.interval)
  var ellipse = entity.ellipse

  if (!defined(ellipse)) {
    entity.ellipse = ellipse = new Cesium.EllipseGraphics()
  }

  processMaterialPacketData(ellipse, 'material', ellipseData.material, interval, sourceUri, entityCollection)
}

Cesium.CzmlDataSource.updaters.push(processPolylineMaterial, processPathMaterial, processEllipseMaterial)
