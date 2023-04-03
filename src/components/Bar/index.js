//封装图表组件
import * as echarts from 'echarts'
import { useEffect, useRef } from 'react'

function Bar ({ title, xData, yData, style,color }) {
  const barRef = useRef()

  useEffect(() => {
    const chartInit = () => {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(barRef.current)
      // 绘制图表
      myChart.setOption({
        title: {
          text: title
        },
        tooltip: {},
        xAxis: {
          data: xData
        },
        yAxis: {},
        barMaxWidth:'60px',
        color,
        series: [
          {
            name: '销量',
            type: 'bar',
            data: yData
          }
        ]
      })
    }
    chartInit()
  }, [title, xData, yData, style,color])

  return (
    <div ref={barRef} style={style}></div>
  )
}
export default Bar