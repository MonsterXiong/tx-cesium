import {
  PolylineFlowArrowProperty,
  PolylineFlowEmptyArrowProperty,
  PolylineFlowDashArrowProperty,
  PolylineFlowDashProperty,
  PolylineFlowStreamProperty,
  PolylineFlowLineProperty,
} from './materialProperty/PolylineFlowProperty'

export const CustomMaterials = Object.freeze({
  polylineFlowArrow: {
    type: '__polylineFlowArrow',
    constructor: PolylineFlowArrowProperty,
    image: 'static/cesium-resources/texture/line-arrow.png',
  },

  polylineFlowLine: {
    type: '__polylineFlowLine',
    constructor: PolylineFlowLineProperty,
    image: 'static/cesium-resources/texture/line.png',
  },

  polylineFlowEmptyArrow: {
    type: '__polylineFlowEmptyArrow',
    constructor: PolylineFlowEmptyArrowProperty,
    image: 'static/cesium-resources/texture/line-arrow-empty.png',
  },

  polylineFlowDashArrow: {
    type: '__polylineFlowDashArrow',
    constructor: PolylineFlowDashArrowProperty,
    image: 'static/cesium-resources/texture/line-dash-arrow.png',
  },

  polylineFlowDash: {
    type: '__polylineFlowDash',
    constructor: PolylineFlowDashProperty,
    image: 'static/cesium-resources/texture/line-dash.png',
  },

  polylineFlowStream: {
    type: '__polylineFlowStream',
    constructor: PolylineFlowStreamProperty,
    image: 'static/cesium-resources/texture/line-stream.png',
  },
})
