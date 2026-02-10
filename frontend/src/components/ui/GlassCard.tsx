/**
 * GlassCard 组件 - Obsidian Glass 风格卡片
 * 深邃半透明容器，带有微妙边框发光效果
 */

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: 'none' | 'blue' | 'purple' | 'green' | 'orange' | 'red'
  onClick?: () => void
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const glowStyles = {
  none: '',
  blue: 'hover:shadow-[0_0_30px_rgba(10,132,255,0.3)]',
  purple: 'hover:shadow-[0_0_30px_rgba(191,90,242,0.3)]',
  green: 'hover:shadow-[0_0_30px_rgba(48,209,88,0.3)]',
  orange: 'hover:shadow-[0_0_30px_rgba(255,159,10,0.3)]',
  red: 'hover:shadow-[0_0_30px_rgba(255,69,58,0.3)]',
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export default function GlassCard({
  children,
  className = '',
  hover = true,
  glow = 'none',
  onClick,
  padding = 'md',
}: GlassCardProps) {
  return (
    <motion.div
      className={`
        relative overflow-hidden
        bg-[rgba(255,255,255,0.03)]
        backdrop-blur-[20px] saturate-[180%]
        border border-[rgba(255,255,255,0.06)]
        rounded-2xl
        ${paddingStyles[padding]}
        ${hover ? 'transition-all duration-300 ease-out hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] hover:-translate-y-0.5' : ''}
        ${glowStyles[glow]}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      whileHover={hover ? { y: -2 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      style={{
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      }}
    >
      {/* 顶部高光线条 */}
      <div 
        className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.1)] to-transparent"
      />
      {children}
    </motion.div>
  )
}
