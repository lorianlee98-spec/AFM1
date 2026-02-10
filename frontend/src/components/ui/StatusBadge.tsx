/**
 * StatusBadge 组件 - 霓虹药丸风格状态标签
 * 用于显示生成状态、完成状态等
 */

import { motion } from 'framer-motion'

interface StatusBadgeProps {
  status: 'idle' | 'generating' | 'processing' | 'completed' | 'error' | 'pending'
  text?: string
  className?: string
  pulse?: boolean
}

const statusConfig = {
  idle: {
    bg: 'rgba(255,255,255,0.06)',
    border: 'rgba(255,255,255,0.08)',
    text: 'rgba(255,255,255,0.5)',
    glow: 'none',
    defaultText: '待开始',
  },
  generating: {
    bg: 'rgba(10,132,255,0.15)',
    border: 'rgba(10,132,255,0.3)',
    text: '#0a84ff',
    glow: '0 0 10px rgba(10,132,255,0.4)',
    defaultText: '生成中',
  },
  processing: {
    bg: 'rgba(255,159,10,0.15)',
    border: 'rgba(255,159,10,0.3)',
    text: '#ff9f0a',
    glow: '0 0 10px rgba(255,159,10,0.4)',
    defaultText: '处理中',
  },
  completed: {
    bg: 'rgba(48,209,88,0.15)',
    border: 'rgba(48,209,88,0.3)',
    text: '#30d158',
    glow: '0 0 10px rgba(48,209,88,0.4)',
    defaultText: '已完成',
  },
  error: {
    bg: 'rgba(255,69,58,0.15)',
    border: 'rgba(255,69,58,0.3)',
    text: '#ff453a',
    glow: '0 0 10px rgba(255,69,58,0.4)',
    defaultText: '失败',
  },
  pending: {
    bg: 'rgba(191,90,242,0.15)',
    border: 'rgba(191,90,242,0.3)',
    text: '#bf5af2',
    glow: '0 0 10px rgba(191,90,242,0.4)',
    defaultText: '队列中',
  },
}

export default function StatusBadge({
  status,
  text,
  className = '',
  pulse = true,
}: StatusBadgeProps) {
  const config = statusConfig[status]
  const displayText = text || config.defaultText

  return (
    <motion.span
      className={`
        inline-flex items-center gap-2 px-3 py-1.5
        rounded-full text-xs font-semibold
        border backdrop-blur-sm
        ${className}
      `}
      style={{
        backgroundColor: config.bg,
        borderColor: config.border,
        color: config.text,
        boxShadow: config.glow !== 'none' ? config.glow : undefined,
      }}
      animate={pulse && (status === 'generating' || status === 'processing') ? {
        opacity: [1, 0.7, 1],
        scale: [1, 1.02, 1],
      } : undefined}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {/* 状态指示点 */}
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === 'generating' || status === 'processing' ? 'animate-pulse' : ''
        }`}
        style={{ backgroundColor: config.text }}
      />
      {displayText}
    </motion.span>
  )
}
