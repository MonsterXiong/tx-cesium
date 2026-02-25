import { useEffect, useRef } from 'react'
import poolChart from '@/components/PoolChart'
import DndPanel from '@/components/PoolChart/components/DndPanel'

const ActiveChartPage = () => {
  const containerRef = useRef(null)

  useEffect(() => {
    poolChart.init({
      container: containerRef.current,
    })
    return () => {
      poolChart.destroy()
    }
  }, [])

  return (
    <div className="fade-in h-full w-full pos-relative">
      <DndPanel className='pos-absolute top-2 left-2 z-1' />
      <section className='h-full w-full' ref={containerRef}></section>
    </div>
  )
}


export default ActiveChartPage
