import type { CellAttrs } from "@antv/x6"

export interface NodeType {
  /** 节点形状 */
  shape: 'circle'
  /** 节点标签 */
  label: string
  /** 节点宽度 */
  width: number
  /** 节点高度 */
  height: number
  attrs?: CellAttrs
  /** 节点数据 */
  data: object
  /** 节点类型 */
  type: 'start' | 'end' | 'normal'
}


export const nodeTypeList: readonly NodeType[] = [
  {
    shape: 'circle',
    type: 'start',
    label: '开始',
    width: 60,
    height: 60,
    attrs: {
      circle: {
        fill: 'transparent',
        stroke: '#1b7fff',
      },
      label: {
        text: '开始',
        fill: '#1b7fff',
        fontSize: 16,
      },
    },
    data: {},
  },
  {
    shape: 'circle',
    type: 'end',
    label: '结束',
    width: 60,
    height: 60,
    attrs: {
      circle: {
        fill: 'transparent',
        stroke: '#1b7fff',
      },
      label: {
        text: '结束',
        fill: '#1b7fff',
        fontSize: 16,
      },
    },
    data: {},
  },
] as const
