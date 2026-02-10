/**
 * Header 组件 - 顶部透明模糊导航栏
 * 固定顶部，包含搜索、通知和用户操作
 */

import { motion } from 'framer-motion'
import { Search, Bell, Settings, User } from 'lucide-react'

interface HeaderProps {
  sidebarCollapsed: boolean
}

export default function Header({ sidebarCollapsed }: HeaderProps) {
  return (
    <motion.header
      className="fixed top-0 right-0 h-16 z-40 flex items-center justify-between px-6"
      initial={false}
      animate={{
        left: sidebarCollapsed ? 72 : 260,
      }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      style={{
        background: 'rgba(5, 5, 5, 0.7)',
        backdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      {/* 搜索栏 */}
      <div className="flex-1 max-w-md">
        <div
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl
            bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]
            focus-within:border-[rgba(10,132,255,0.4)] focus-within:bg-[rgba(10,132,255,0.05)]
            transition-all duration-200"
        >
          <Search size={18} className="text-[rgba(255,255,255,0.4)]" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="搜索项目、剧本、素材..."
            className="flex-1 bg-transparent text-sm text-white placeholder-[rgba(255,255,255,0.4)] outline-none"
          />
        </div>
      </div>

      {/* 右侧操作区 */}
      <div className="flex items-center gap-2">
        {/* 通知按钮 */}
        <motion.button
          className="relative w-10 h-10 rounded-xl flex items-center justify-center
            text-[rgba(255,255,255,0.6)] hover:text-white hover:bg-[rgba(255,255,255,0.05)]
            transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Bell size={20} strokeWidth={1.5} />
          {/* 通知红点 */}
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ff453a]" 
            style={{ boxShadow: '0 0 8px rgba(255, 69, 58, 0.6)' }}
          />
        </motion.button>

        {/* 设置按钮 */}
        <motion.button
          className="w-10 h-10 rounded-xl flex items-center justify-center
            text-[rgba(255,255,255,0.6)] hover:text-white hover:bg-[rgba(255,255,255,0.05)]
            transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Settings size={20} strokeWidth={1.5} />
        </motion.button>

        {/* 用户头像 */}
        <motion.button
          className="ml-2 flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-xl
            bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]
            hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.1)]
            transition-all duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0a84ff] to-[#bf5af2] 
            flex items-center justify-center">
            <User size={16} className="text-white" strokeWidth={1.5} />
          </div>
          <span className="text-sm font-medium text-[rgba(255,255,255,0.8)]">创作者</span>
        </motion.button>
      </div>
    </motion.header>
  )
}
