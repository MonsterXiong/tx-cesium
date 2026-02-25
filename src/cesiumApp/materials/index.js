import * as Cesium from 'cesium'
import { CustomMaterials } from './resources'
import polylineFlowGlsl from './shaders/polylineFlow.glsl'

Cesium.Material._materialCache.addMaterial(CustomMaterials.polylineFlowStream.type, {
  fabric: {
    type: CustomMaterials.polylineFlowStream.type,
    uniforms: {
      color: new Cesium.Color(1, 0, 0, 1.0),
      image: CustomMaterials.polylineFlowStream.image,
      time: 0,
      repeat: {
        x: 6,
        y: 1,
      },
    },
    source: polylineFlowGlsl,
  },
  translucent: function () {
    return true
  },
})

Cesium.Material._materialCache.addMaterial(CustomMaterials.polylineFlowArrow.type, {
  fabric: {
    type: CustomMaterials.polylineFlowArrow.type,
    uniforms: {
      color: new Cesium.Color(1, 0, 0, 1.0),
      image: CustomMaterials.polylineFlowArrow.image,
      time: 0,
      repeat: {
        x: 1,
        y: 1,
      },
    },
    source: polylineFlowGlsl,
  },
  translucent: function () {
    return true
  },
})

Cesium.Material._materialCache.addMaterial(CustomMaterials.polylineFlowLine.type, {
  fabric: {
    type: CustomMaterials.polylineFlowLine.type,
    uniforms: {
      color: new Cesium.Color(1, 0, 0, 1.0),
      image: CustomMaterials.polylineFlowLine.image,
      time: 0,
      repeat: {
        x: 1,
        y: 1,
      },
    },
    source: polylineFlowGlsl,
  },
  translucent: function () {
    return true
  },
})

Cesium.Material._materialCache.addMaterial(CustomMaterials.polylineFlowEmptyArrow.type, {
  fabric: {
    type: CustomMaterials.polylineFlowEmptyArrow.type,
    uniforms: {
      color: new Cesium.Color(1, 0, 0, 1.0),
      image: CustomMaterials.polylineFlowEmptyArrow.image,
      time: 0,
      repeat: {
        x: 1,
        y: 1,
      },
    },
    source: polylineFlowGlsl,
  },
  translucent: function () {
    return true
  },
})

Cesium.Material._materialCache.addMaterial(CustomMaterials.polylineFlowDashArrow.type, {
  fabric: {
    type: CustomMaterials.polylineFlowDashArrow.type,
    uniforms: {
      color: new Cesium.Color(1, 0, 0, 1.0),
      image: CustomMaterials.polylineFlowDashArrow.image,
      time: 0,
      repeat: {
        x: 1,
        y: 1,
      },
    },
    source: polylineFlowGlsl,
  },
  translucent: function () {
    return true
  },
})

Cesium.Material._materialCache.addMaterial(CustomMaterials.polylineFlowDash.type, {
  fabric: {
    type: CustomMaterials.polylineFlowDash.type,
    uniforms: {
      color: new Cesium.Color(1, 0, 0, 1.0),
      image: CustomMaterials.polylineFlowDash.image,
      time: 0,
      repeat: {
        x: 1,
        y: 1,
      },
    },
    source: polylineFlowGlsl,
  },
  translucent: function () {
    return true
  },
})

import './updater'
