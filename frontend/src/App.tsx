/**
 * 主应用组件
 * 使用简单的状态管理来切换登录页面和主应用
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Film, 
  Home, 
  FileText, 
  Image, 
  Users, 
  Music, 
  Video, 
  Download,
  Plus,
  Search,
  Bell,
  Settings,
  LogOut,
  Sparkles
} from 'lucide-react'
import Login from './pages/Login'
import ScriptCreation from './pages/ScriptCreation'
import './styles/theme.css'
import './styles/components.css'

// 工作流程步骤
const workflowSteps = [
  {
    title: '剧本创作',
    icon: FileText,
    description: '基于AI生成标准格式剧本',
    color: 'var(--accent-blue)',
  },
  {
    title: '分镜制作',
    icon: Image,
    description: '自动生成视觉化分镜图',
    color: 'var(--accent-green)',
  },
  {
    title: '人设制作',
    icon: Users,
    description: '创建一致性的角色形象',
    color: 'var(--accent-purple)',
  },
  {
    title: '音频生成',
    icon: Music,
    description: '生成旁白和配乐',
    color: 'var(--accent-orange)',
  },
  {
    title: '视频生成',
    icon: Video,
    description: '基于分镜生成视频片段',
    color: 'var(--accent-red)',
  },
  {
    title: '成片输出',
    icon: Download,
    description: '导出到剪映进行后期制作',
    color: 'var(--accent-yellow)',
  },
]

// 导航项
const navItems = [
  { key: 'home', icon: Home, label: '首页' },
  { key: 'script', icon: FileText, label: '剧本创作' },
  { key: 'storyboard', icon: Image, label: '分镜制作' },
  { key: 'character', icon: Users, label: '人设制作' },
  { key: 'audio', icon: Music, label: '音频生成' },
  { key: 'video', icon: Video, label: '视频生成' },
  { key: 'export', icon: Download, label: '成片输出' },
]

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeNav, setActiveNav] = useState('home')
  const [isLoading, setIsLoading] = useState(true)

  // 检查登录状态
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    setIsAuthenticated(!!token)
    setIsLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
    setIsAuthenticated(false)
  }

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner-large" />
      </div>
    )
  }

  // 未登录显示登录页面
  if (!isAuthenticated) {
    return <Login />
  }

  return (
    <div className="app-container">
      {/* 侧边栏 */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <Film size={28} />
            <Sparkles size={14} className="logo-sparkle" />
          </div>
          <span className="logo-text">AMF.io</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeNav === item.key
            return (
              <button
                key={item.key}
                className={`nav-item-glass ${isActive ? 'active' : ''}`}
                onClick={() => setActiveNav(item.key)}
              >
                <Icon 
                  size={20} 
                  className="nav-icon"
                  style={{ color: isActive ? 'white' : 'var(--text-tertiary)' }}
                />
                <span style={{ color: isActive ? 'white' : 'var(--text-secondary)' }}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item-glass" onClick={handleLogout}>
            <LogOut size={20} className="nav-icon" style={{ color: 'var(--text-tertiary)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>退出登录</span>
          </button>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="main-content">
        {/* 顶部栏 */}
        <header className="top-bar">
          <div className="search-bar">
            <Search size={18} />
            <input type="text" placeholder="搜索项目..." />
          </div>
          <div className="top-bar-actions">
            <button className="btn-icon">
              <Bell size={20} />
            </button>
            <button className="btn-icon">
              <Settings size={20} />
            </button>
            <div className="user-avatar">
              <span>U</span>
            </div>
          </div>
        </header>

        {/* 页面内容 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeNav}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="page-content"
          >
            {activeNav === 'home' && (
              <div className="home-page">
                {/* 欢迎区域 */}
                <section className="hero-section">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    欢迎回来，创作者 👋 [Deployed: 2025-02-09]
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="hero-subtitle"
                  >
                    通过简单的文字描述，快速生成专业级视频内容
                  </motion.p>
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="btn-primary btn-large"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveNav('script')}
                  >
                    <Plus size={20} />
                    创建新项目
                  </motion.button>
                </section>

                {/* 工作流程展示 */}
                <section className="workflow-section">
                  <h2>工作流程</h2>
                  <div className="workflow-grid">
                    {workflowSteps.map((step, index) => {
                      const Icon = step.icon
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="workflow-card glass-card"
                          whileHover={{ y: -4, transition: { duration: 0.2 } }}
                          onClick={() => {
                            if (step.title === '剧本创作') setActiveNav('script')
                          }}
                          style={{ cursor: step.title === '剧本创作' ? 'pointer' : 'default' }}
                        >
                          <div 
                            className="workflow-icon"
                            style={{ color: step.color }}
                          >
                            <Icon size={32} />
                          </div>
                          <h3>{step.title}</h3>
                          <p>{step.description}</p>
                        </motion.div>
                      )
                    })}
                  </div>
                </section>


              </div>
            )}

            {activeNav === 'script' && <ScriptCreation onBack={() => setActiveNav('home')} />}

            {activeNav !== 'home' && activeNav !== 'script' && (
              <div className="placeholder-page">
                <div className="placeholder-content">
                  <Sparkles size={48} color="var(--accent-purple)" />
                  <h2>功能开发中</h2>
                  <p>该功能正在紧锣密鼓地开发中，敬请期待...</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 内联样式 */}
      <style>{`
        .app-container {
          display: flex;
          min-height: 100vh;
          background: var(--bg-primary);
        }

        /* 加载屏幕 */
        .loading-screen {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-primary);
        }

        .loading-spinner-large {
          width: 48px;
          height: 48px;
          border: 3px solid var(--glass-border);
          border-top-color: var(--accent-blue);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        /* 侧边栏 */
        .sidebar {
          width: 240px;
          background: var(--bg-secondary);
          border-right: 1px solid var(--glass-border);
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
          z-index: 100;
        }

        .sidebar-header {
          padding: var(--space-5);
          display: flex;
          align-items: center;
          gap: var(--space-3);
          border-bottom: 1px solid var(--glass-border);
        }

        .logo {
          width: 40px;
          height: 40px;
          background: var(--gradient-accent);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          position: relative;
        }

        .logo-sparkle {
          position: absolute;
          top: -2px;
          right: -2px;
          color: var(--accent-yellow);
        }

        .logo-text {
          font-size: var(--text-lg);
          font-weight: var(--font-bold);
          color: var(--text-primary);
        }

        .sidebar-nav {
          flex: 1;
          padding: var(--space-3);
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .sidebar-footer {
          padding: var(--space-3);
          border-top: 1px solid var(--glass-border);
        }

        /* 玻璃拟态导航项 */
        .nav-item-glass {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: 12px 16px;
          border-radius: 12px;
          background: transparent;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.3s var(--ease-smooth);
          text-align: left;
          width: 100%;
        }

        .nav-item-glass:hover {
          background: var(--glass-bg);
          border-color: var(--glass-border);
          backdrop-filter: blur(10px);
        }

        .nav-item-glass.active {
          background: linear-gradient(135deg, rgba(10, 132, 255, 0.15) 0%, rgba(191, 90, 242, 0.15) 100%);
          border-color: rgba(10, 132, 255, 0.3);
          box-shadow: 
            0 4px 24px rgba(10, 132, 255, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .nav-item-glass span {
          font-size: var(--text-base);
          font-weight: var(--font-medium);
          transition: color 0.2s ease;
        }

        .nav-icon {
          transition: color 0.2s ease, transform 0.2s ease;
        }

        .nav-item-glass:hover .nav-icon {
          transform: scale(1.1);
        }

        /* 主内容区 */
        .main-content {
          flex: 1;
          margin-left: 240px;
          display: flex;
          flex-direction: column;
        }

        /* 顶部栏 */
        .top-bar {
          height: 64px;
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--glass-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 var(--space-6);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .search-bar {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          background: var(--bg-elevated);
          border: 1px solid var(--glass-border);
          border-radius: 8px;
          padding: 8px 16px;
          width: 320px;
          color: var(--text-tertiary);
        }

        .search-bar input {
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-primary);
          font-size: var(--text-base);
          width: 100%;
        }

        .search-bar input::placeholder {
          color: var(--text-tertiary);
        }

        .top-bar-actions {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          background: var(--gradient-accent);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: var(--font-semibold);
          font-size: var(--text-sm);
          margin-left: var(--space-2);
        }

        /* 页面内容 */
        .page-content {
          flex: 1;
          padding: var(--space-6);
          overflow-y: auto;
        }

        /* 首页 */
        .home-page {
          max-width: 1200px;
          margin: 0 auto;
        }

        .hero-section {
          text-align: center;
          padding: var(--space-10) 0;
        }

        .hero-section h1 {
          font-size: var(--text-3xl);
          font-weight: var(--font-bold);
          color: var(--text-primary);
          margin-bottom: var(--space-3);
        }

        .hero-subtitle {
          font-size: var(--text-lg);
          color: var(--text-secondary);
          margin-bottom: var(--space-6);
        }

        .btn-large {
          padding: 14px 28px;
          font-size: var(--text-lg);
        }

        /* 工作流程 */
        .workflow-section {
          margin-top: var(--space-8);
        }

        .workflow-section h2 {
          font-size: var(--text-xl);
          font-weight: var(--font-semibold);
          color: var(--text-primary);
          margin-bottom: var(--space-5);
        }

        .workflow-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: var(--space-4);
        }

        .workflow-card {
          padding: var(--space-6);
          text-align: center;
          cursor: pointer;
        }

        .workflow-icon {
          margin-bottom: var(--space-3);
        }

        .workflow-card h3 {
          font-size: var(--text-lg);
          font-weight: var(--font-semibold);
          color: var(--text-primary);
          margin-bottom: var(--space-2);
        }

        .workflow-card p {
          font-size: var(--text-sm);
          color: var(--text-secondary);
        }

        /* 占位页面 */
        .placeholder-page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
        }

        .placeholder-content {
          text-align: center;
        }

        .placeholder-content h2 {
          font-size: var(--text-2xl);
          font-weight: var(--font-semibold);
          color: var(--text-primary);
          margin: var(--space-4) 0 var(--space-2);
        }

        .placeholder-content p {
          font-size: var(--text-base);
          color: var(--text-secondary);
        }

        /* 响应式 */
        @media (max-width: 1024px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
          }

          .main-content {
            margin-left: 0;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .search-bar {
            width: 200px;
          }
        }
      `}</style>
    </div>
  )
}

export default App
