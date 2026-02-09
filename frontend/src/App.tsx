import { Layout, Menu, Typography, Card, Row, Col, Button } from 'antd'
import {
  HomeOutlined,
  FileTextOutlined,
  PictureOutlined,
  UserOutlined,
  SoundOutlined,
  VideoCameraOutlined,
  ExportOutlined,
} from '@ant-design/icons'
import './App.css'

const { Header, Content, Footer, Sider } = Layout
const { Title, Paragraph } = Typography

// 工作流程步骤
const workflowSteps = [
  {
    title: '剧本创作',
    icon: <FileTextOutlined />,
    description: '基于AI生成标准格式剧本',
    color: '#1890ff',
  },
  {
    title: '分镜制作',
    icon: <PictureOutlined />,
    description: '自动生成视觉化分镜图',
    color: '#52c41a',
  },
  {
    title: '人设制作',
    icon: <UserOutlined />,
    description: '创建一致性的角色形象',
    color: '#722ed1',
  },
  {
    title: '音频生成',
    icon: <SoundOutlined />,
    description: '生成旁白和配乐',
    color: '#eb2f96',
  },
  {
    title: '视频生成',
    icon: <VideoCameraOutlined />,
    description: '基于分镜生成视频片段',
    color: '#fa8c16',
  },
  {
    title: '成片输出',
    icon: <ExportOutlined />,
    description: '导出到剪映进行后期制作',
    color: '#13c2c2',
  },
]

function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 侧边栏 */}
      <Sider theme="light" width={200}>
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>
            AI视频制片
          </Title>
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={['home']}
          items={[
            { key: 'home', icon: <HomeOutlined />, label: '首页' },
            { key: 'script', icon: <FileTextOutlined />, label: '剧本创作' },
            { key: 'storyboard', icon: <PictureOutlined />, label: '分镜制作' },
            { key: 'character', icon: <UserOutlined />, label: '人设制作' },
            { key: 'audio', icon: <SoundOutlined />, label: '音频生成' },
            { key: 'video', icon: <VideoCameraOutlined />, label: '视频生成' },
            { key: 'export', icon: <ExportOutlined />, label: '成片输出' },
          ]}
        />
      </Sider>

      {/* 主内容区 */}
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px' }}>
          <Title level={3} style={{ margin: '16px 0' }}>
            AI视频制片链路系统
          </Title>
        </Header>

        <Content style={{ margin: '24px', padding: '24px', background: '#fff' }}>
          {/* 欢迎区域 */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <Title level={2}>欢迎使用 AI视频制片链路系统</Title>
            <Paragraph style={{ fontSize: '16px', color: '#666' }}>
              通过简单的文字描述，快速生成专业级视频内容
            </Paragraph>
            <Button type="primary" size="large" style={{ marginTop: '16px' }}>
              创建新项目
            </Button>
          </div>

          {/* 工作流程展示 */}
          <Title level={3} style={{ marginBottom: '24px' }}>
            工作流程
          </Title>
          <Row gutter={[16, 16]}>
            {workflowSteps.map((step, index) => (
              <Col xs={24} sm={12} lg={8} key={index}>
                <Card
                  hoverable
                  style={{ borderTop: `4px solid ${step.color}` }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '48px',
                        color: step.color,
                        marginBottom: '16px',
                      }}
                    >
                      {step.icon}
                    </div>
                    <Title level={4}>{step.title}</Title>
                    <Paragraph type="secondary">{step.description}</Paragraph>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {/* 功能特点 */}
          <Title level={3} style={{ marginTop: '48px', marginBottom: '24px' }}>
            核心优势
          </Title>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Card title="端到端自动化" bordered={false}>
                从剧本到成片，全流程AI驱动，大幅降低制作门槛
              </Card>
            </Col>
            <Col span={8}>
              <Card title="智能链路整合" bordered={false}>
                各模块数据自动传递，无缝协作，提升制作效率
              </Card>
            </Col>
            <Col span={8}>
              <Card title="高度可控性" bordered={false}>
                在自动化的同时，保持用户对每个环节的干预能力
              </Card>
            </Col>
          </Row>
        </Content>

        <Footer style={{ textAlign: 'center' }}>
          AI视频制片链路系统 ©2026 Created by AI Team
        </Footer>
      </Layout>
    </Layout>
  )
}

export default App
