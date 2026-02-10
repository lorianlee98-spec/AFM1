/**
 * 主应用组件 - Obsidian Glass 主题
 * 使用 Sidebar + Header + Main Content 布局架构
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  Image as ImageIcon,
  Users,
  Music,
  Video as VideoIcon,
  Download,
  Plus,
  Sparkles,
} from 'lucide-react'

// Layout Components
import { Sidebar, Header } from './components/layout'

// Pages
import Login from './pages/Login'
import ScriptCreation from './pages/ScriptCreation'
import Storyboard from './pages/Storyboard'
import CharacterDesign from './pages/CharacterDesign'
import Audio from './pages/Audio'
import VideoPage from './pages/Video'
import Export from './pages/Export'

// UI Components
import { GlassCard, GlowButton } from './components/ui'

// Mock Data
import { mockProjectStats, mockActivities } from './data/mock'

// Styles
import './styles/theme.css'

// 工作流程步骤
const workflowSteps = [
  { key: 'script', title: '剧本创作', icon: FileText, description: '基于AI生成标准格式剧本', color: '#0a84ff' },
  { key: 'storyboard', title: '分镜制作', icon: ImageIcon, description: '自动生成视觉化分镜图', color: '#30d158' },
  { key: 'character', title: '人设制作', icon: Users, description: '创建一致性的角色形象', color: '#bf5af2' },
  { key: 'audio', title: '音频生成', icon: Music, description: '生成旁白和配乐', color: '#ff9f0a' },
  { key: 'video', title: '视频生成', icon: VideoIcon, description: '基于分镜生成视频片段', color: '#ff453a' },
  { key: 'export', title: '成片输出', icon: Download, description: '导出到剪映进行后期制作', color: '#ffd60a' },
]

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeNav, setActiveNav] = useState('home')
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // 检查登录状态
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    const authState = !!token
    console.log("Auth State:", authState)
    setIsAuthenticated(authState)
    setIsLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
    setIsAuthenticated(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-3 border-[rgba(255,255,255,0.1)] border-t-[#0a84ff] rounded-full"
        />
      </div>
    )
  }

  // 未登录显示登录页面
  if (!isAuthenticated) {
    return <Login />
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* 侧边栏 */}
      <Sidebar
        activeNav={activeNav}
        onNavChange={setActiveNav}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onLogout={handleLogout}
      />

      {/* 顶部导航 */}
      <Header sidebarCollapsed={sidebarCollapsed} />

      {/* 主内容区 */}
      <main
        className="pt-16 min-h-screen transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? 72 : 260 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeNav}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="h-[calc(100vh-64px)]"
          >
            {activeNav === 'home' && <HomePage onNavChange={setActiveNav} />}
            {activeNav === 'script' && <ScriptCreation />}
            {activeNav === 'storyboard' && <Storyboard />}
            {activeNav === 'character' && <CharacterDesign />}
            {activeNav === 'audio' && <Audio />}
            {activeNav === 'video' && <VideoPage />}
            {activeNav === 'export' && <Export />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

// 首页组件
interface HomePageProps {
  onNavChange: (key: string) => void
}

function HomePage({ onNavChange }: HomePageProps) {
  return (
    <div className="h-full overflow-y-auto p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 欢迎区域 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            欢迎回来，创作者 <span className="inline-block animate-pulse">👋</span>
          </h1>
          <p className="text-[rgba(255,255,255,0.6)] mb-6">
            通过AI驱动的视频制作工具，将创意快速转化为专业级内容
          </p>
          <GlowButton
            variant="glow"
            size="lg"
            icon={<Plus size={20} />}
            onClick={() => onNavChange('script')}
          >
            创建新项目
          </GlowButton>
        </motion.section>

        {/* 统计数据 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: '总项目', value: mockProjectStats.totalProjects, icon: FileText, color: '#0a84ff' },
              { label: '已完成剧本', value: mockProjectStats.completedScripts, icon: FileText, color: '#30d158' },
              { label: '生成视频', value: mockProjectStats.generatedVideos, icon: VideoIcon, color: '#bf5af2' },
              { label: '总时长', value: `${Math.floor(mockProjectStats.totalDuration / 60)}分钟`, icon: Download, color: '#ff9f0a' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                <GlassCard className="text-center">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                    style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
                  >
                    <stat.icon size={20} strokeWidth={1.5} />
                  </div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-[rgba(255,255,255,0.5)]">{stat.label}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 工作流程 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-bold text-white mb-4">工作流程</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                >
                  <GlassCard
                    hover
                    glow={step.key === 'script' ? 'blue' : step.key === 'storyboard' ? 'green' : step.key === 'character' ? 'purple' : step.key === 'audio' ? 'orange' : step.key === 'video' ? 'red' : 'none'}
                    onClick={() => onNavChange(step.key)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${step.color}20`, color: step.color }}
                      >
                        <Icon size={24} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white mb-1">{step.title}</h3>
                        <p className="text-sm text-[rgba(255,255,255,0.5)]">{step.description}</p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* 最近活动 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-xl font-bold text-white mb-4">最近活动</h2>
          <GlassCard>
            <div className="space-y-4">
              {mockActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  className="flex items-center gap-4 pb-4 border-b border-[rgba(255,255,255,0.06)] last:border-0 last:pb-0"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor:
                        activity.type === 'script' ? 'rgba(10,132,255,0.15)' :
                        activity.type === 'storyboard' ? 'rgba(48,209,88,0.15)' :
                        activity.type === 'character' ? 'rgba(191,90,242,0.15)' :
                        activity.type === 'audio' ? 'rgba(255,159,10,0.15)' :
                        'rgba(255,69,58,0.15)',
                      color:
                        activity.type === 'script' ? '#0a84ff' :
                        activity.type === 'storyboard' ? '#30d158' :
                        activity.type === 'character' ? '#bf5af2' :
                        activity.type === 'audio' ? '#ff9f0a' :
                        '#ff453a',
                    }}
                  >
                    <Sparkles size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-white">
                      {activity.action} <span className="text-[#0a84ff]">{activity.target}</span>
                    </p>
                    <p className="text-xs text-[rgba(255,255,255,0.4)]">
                      {formatTime(activity.timestamp)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.section>
      </div>
    </div>
  )
}

// 格式化时间
function formatTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  return `${days}天前`
}

export default App
