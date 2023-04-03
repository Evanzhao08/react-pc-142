import Bar from "@/components/Bar"
import './index.scss'

export default function Home () {
  return (
    <div>
      <Bar
        title='主流框架使用满意度'
        xData={['react', 'vue', 'angular']}
        yData={[30, 40, 60]}
        style={{ width: '500px', height: '400px' }}
        color={'#91cc75'}
      />
      <Bar
        title='主流框架使用满意度2'
        xData={['react', 'vue', 'angular']}
        yData={[60, 30, 80]}
        style={{ width: '500px', height: '400px' }}
        color={'#ea7ccc'}
      />
    </div>

  )
}
