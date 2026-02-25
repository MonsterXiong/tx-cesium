import { Graph, Snapline, Dnd } from '@antv/x6'

/**
 * 泳池图表类
 * 用于管理和初始化 X6 图表实例
 */
export class PoolChart {
  /** @type {Graph | null} */
  graph: Graph | null = null
  dnd: Dnd | null = null
  constructor() {}
  init(options: ConstructorParameters<typeof Graph>[0]) {
    this.graph = new Graph({
      autoResize: true,
      grid: true,
      ...options,
    })

    this.graph.use(
      new Snapline({
        enabled: true,
      })
    )
    this.dnd = new Dnd({
      target: this.graph,
    })
  }
  destroy() {
    if (this.graph) {
      this.graph.dispose()
      this.graph = null
    }
    if (this.dnd) {
      this.dnd.dispose()
      this.dnd = null
    }
  }
}

export default new PoolChart()
