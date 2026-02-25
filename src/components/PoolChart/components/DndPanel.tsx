import { nodeTypeList, type NodeType } from './nodeType'
import poolChart from '@/components/PoolChart'
import './dnd-panel.css'

const DndPanel = ({ className }: { className: string }) => {
  const startDrag = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, nodeType: NodeType) => {
    if (!poolChart.dnd || !poolChart.graph) return
    if (!nodeType) return
    poolChart.dnd.start(poolChart.graph.createNode(
      nodeType
    ), event.nativeEvent)
  }
  return (
    <section className={`${className} dnd-panel`}>
      {nodeTypeList.map((nodeType) => (
        <div key={nodeType.type} className="dnd-panel-item" onMouseDown={(e) => startDrag(e, nodeType)}>
          <div className={`dnd-panel-item-shape ${nodeType.shape} ${nodeType.type}`} />
          <span className="dnd-panel-item-label">{nodeType.label}</span>
        </div>
      ))}
    </section>
  )
}

export default DndPanel
