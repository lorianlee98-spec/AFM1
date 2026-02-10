/**
 * Sidebar 组件 - 可折叠玻璃拟态侧边栏
 * 左侧固定，支持图标/展开两种模式
 */

import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  FileText,
  Image,
  Users,
  Music,
  Video,
  Download,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react'

interface NavItem {
  key: string
  icon: React.ElementType
  label: string
}

interface SidebarProps {
  activeNav: string
  onNavChange: (key: string) => void
  collapsed: boolean
  onToggleCollapse: () => void
  onLogout: () => void
}

const navItems: NavItem[] = [
  { key: 'home', icon: Home, label: '首页' },
  { key: 'script', icon: FileText, label: '剧本创作' },
  { key: 'storyboard', icon: Image, label: '分镜制作' },
  { key: 'character', icon: Users, label: '人设制作' },
  { key: 'audio', icon: Music, label: '音频生成' },
  { key: 'video', icon: Video, label: '视频生成' },
  { key: 'export', icon: Download, label: '成片输出' },
]

export default function Sidebar({
  activeNav,
  onNavChange,
  collapsed,
  onToggleCollapse,
  onLogout,
}: SidebarProps) {
  return (
    <motion.aside
      className="fixed left-0 top-0 h-screen z-50 flex flex-col"
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      style={{
        background: 'rgba(10, 10, 15, 0.8)',
        backdropFilter: 'blur(20px) saturate(180%)',
        borderRight: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      {/* Logo 区域 */}
      <div className="h-16 flex items-center px-4 border-b border-[rgba(255,255,255,0.06)]">
        <motion.div
          className="flex items-center gap-3 overflow-hidden"
          animate={{ width: collapsed ? 40 : 'auto' }}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0a84ff] to-[#bf5af2] flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-bold text-lg whitespace-nowrap bg-gradient-to-r from-[#0a84ff] to-[#bf5af2] bg-clip-text text-transparent"
              >
                AFM.Create
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* 导航项 */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeNav === item.key

          return (
            <motion.button
              key={item.key}
              onClick={() => onNavChange(item.key)}
              className={`
                w-full flex items-center gap-3 px-3 py-3 rounded-xl
                transition-all duration-200 relative overflow-hidden
                ${isActive
                  ? 'bg-[rgba(10,132,255,0.15)] border border-[rgba(10,132,255,0.3)]'
                  : 'hover:bg-[rgba(255,255,255,0.05)] border border-transparent'
                }
              `}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              style={isActive ? {
                boxShadow: '0 0 20px rgba(10, 132, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              } : {}}
            >
              {/* 活跃指示器 */}
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-[#0a84ff]"
                  style={{ boxShadow: '0 0 10px rgba(10, 132, 255, 0.5)' }}
                />
              )}

              <Icon
                size={20}
                className={`flex-shrink-0 transition-colors duration-200 ${
                  isActive ? 'text-[#0a84ff]' : 'text-[rgba(255,255,255,0.5)]'
                }`}
                strokeWidth={1.5}
              />

              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className={`text-sm font-medium whitespace-nowrap ${
                      isActive ? 'text-white' : 'text-[rgba(255,255,255,0.7)]'
                    }`}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          )
        })}
      </nav>

      {/* 底部操作区 */}
      <div className="p-3 border-t border-[rgba(255,255,255,0.06)] space-y-2">
        {/* 折叠按钮 */}
        <motion.button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl
            text-[rgba(255,255,255,0.5)] hover:text-white hover:bg-[rgba(255,255,255,0.05)]
            transition-all duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {collapsed ? (
            <ChevronRight size={18} strokeWidth={1.5} />
          ) : (
            <>
              <ChevronLeft size={18} strokeWidth={1.5} />
              <span className="text-sm font-medium">收起</span>
            </>
          )}
        </motion.button>

        {/* 退出登录 */}
        <motion.button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
            text-[rgba(255,255,255,0.5)] hover:text-[#ff453a] hover:bg-[rgba(255,69,58,0.1)]
            transition-all duration-200"
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut size={18} strokeWidth={1.5} />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-sm font-medium whitespace-nowrap"
              >
                退出登录
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.aside>
  )
}
