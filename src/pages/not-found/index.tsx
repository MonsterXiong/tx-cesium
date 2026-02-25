/**
 * 404 页面
 */

import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'

/**
 * 404 页面组件
 * @returns React 组件
 */
const NotFoundPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="flex-center min-h-[calc(100vh-200px)]">
      <Result
        status="404"
        title="404"
        subTitle="抱歉，您访问的页面不存在"
        extra={
          <Button type="primary" onClick={() => navigate('/home')}>
            返回首页
          </Button>
        }
      />
    </div>
  )
}

export default NotFoundPage

