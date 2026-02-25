/**
 * 仪表盘页面
 */

import { Card, Row, Col, Progress, Tag, Timeline, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'

/**
 * 任务数据接口
 */
interface TaskData {
  key: string
  name: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  createTime: string
}

/**
 * 仪表盘组件
 * @returns React 组件
 */
const DashboardPage: React.FC = () => {
  // 任务表格列配置
  const columns: ColumnsType<TaskData> = [
    {
      title: '任务名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: TaskData['status']) => {
        const statusMap = {
          pending: { color: 'default', text: '待处理', icon: <ClockCircleOutlined /> },
          processing: { color: 'processing', text: '进行中', icon: <SyncOutlined spin /> },
          completed: { color: 'success', text: '已完成', icon: <CheckCircleOutlined /> },
          failed: { color: 'error', text: '失败', icon: <CloseCircleOutlined /> },
        }
        const config = statusMap[status]
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        )
      },
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => <Progress percent={progress} size="small" />,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
  ]

  // 模拟任务数据
  const taskData: TaskData[] = [
    {
      key: '1',
      name: '数据导入任务',
      status: 'completed',
      progress: 100,
      createTime: '2026-01-09 10:00:00',
    },
    {
      key: '2',
      name: '报表生成任务',
      status: 'processing',
      progress: 65,
      createTime: '2026-01-09 11:30:00',
    },
    {
      key: '3',
      name: '数据同步任务',
      status: 'pending',
      progress: 0,
      createTime: '2026-01-09 12:00:00',
    },
    {
      key: '4',
      name: '备份任务',
      status: 'failed',
      progress: 45,
      createTime: '2026-01-09 09:00:00',
    },
  ]

  return (
    <div className="fade-in">
      {/* 页面标题 */}
      <h1 className="text-2xl font-bold mb-6">仪表盘</h1>

      {/* 项目进度 */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={12}>
          <Card title="项目进度">
            <div className="space-y-4">
              <div>
                <div className="flex-between mb-2">
                  <span>前端开发</span>
                  <span className="text-primary">85%</span>
                </div>
                <Progress percent={85} status="active" />
              </div>
              <div>
                <div className="flex-between mb-2">
                  <span>后端开发</span>
                  <span className="text-primary">70%</span>
                </div>
                <Progress percent={70} status="active" />
              </div>
              <div>
                <div className="flex-between mb-2">
                  <span>测试</span>
                  <span className="text-primary">45%</span>
                </div>
                <Progress percent={45} />
              </div>
              <div>
                <div className="flex-between mb-2">
                  <span>文档编写</span>
                  <span className="text-primary">30%</span>
                </div>
                <Progress percent={30} />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="最近动态">
            <Timeline
              items={[
                {
                  color: 'green',
                  children: (
                    <>
                      <p className="font-semibold">完成首页开发</p>
                      <p className="text-text-secondary text-sm">2026-01-09 14:30</p>
                    </>
                  ),
                },
                {
                  color: 'blue',
                  children: (
                    <>
                      <p className="font-semibold">集成 Cesium 地图</p>
                      <p className="text-text-secondary text-sm">2026-01-09 11:20</p>
                    </>
                  ),
                },
                {
                  color: 'blue',
                  children: (
                    <>
                      <p className="font-semibold">配置路由系统</p>
                      <p className="text-text-secondary text-sm">2026-01-09 09:45</p>
                    </>
                  ),
                },
                {
                  children: (
                    <>
                      <p className="font-semibold">项目初始化</p>
                      <p className="text-text-secondary text-sm">2026-01-08 16:00</p>
                    </>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>

      {/* 任务列表 */}
      <Card title="任务列表" className="mb-6">
        <Table columns={columns} dataSource={taskData} pagination={false} />
      </Card>
    </div>
  )
}

export default DashboardPage

