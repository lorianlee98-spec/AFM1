/**
 * GlowButton 组件 - 发光按钮
 * 带有渐变文字或悬停发光效果的按钮
 */

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface GlowButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'glow'
  size?: 'sm' | 'md' | 'lg'
  glow?: 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'yellow'
  disabled?: boolean
  loading?: boolean
  className?: string
  onClick?: () => void
  icon?: ReactNode
  fullWidth?: boolean
}

const variantStyles = {
  primary: `
    bg-[#0a84ff] text-white
    hover:bg-[#409cff]
    shadow-[0_0_0_0_rgba(10,132,255,0)]
    hover:shadow-[0_0_20px_rgba(10,132,255,0.4)]
  `,
  secondary: `
    bg-[#1a1a24] text-white
    border border-[rgba(255,255,255,0.08)]
    hover:bg-[#252530] hover:border-[rgba(255,255,255,0.12)]
  `,
  ghost: `
    bg-transparent text-[rgba(255,255,255,0.7)]
    hover:bg-[rgba(255,255,255,0.05)] hover:text-white
  `,
  glow: `
    bg-gradient-to-r from-[#0a84ff] to-[#bf5af2] text-white
    hover:from-[#409cff] hover:to-[#da8fff]
    shadow-[0_0_20px_rgba(10,132,255,0.3)]
    hover:shadow-[0_0_30px_rgba(10,132,255,0.5)]
  `,
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-5 py-2.5 text-base gap-2',
  lg: 'px-8 py-3.5 text-lg gap-2.5',
}

const glowColors = {
  blue: 'hover:shadow-[0_0_25px_rgba(10,132,255,0.5)]',
  purple: 'hover:shadow-[0_0_25px_rgba(191,90,242,0.5)]',
  green: 'hover:shadow-[0_0_25px_rgba(48,209,88,0.5)]',
  orange: 'hover:shadow-[0_0_25px_rgba(255,159,10,0.5)]',
  red: 'hover:shadow-[0_0_25px_rgba(255,69,58,0.5)]',
  yellow: 'hover:shadow-[0_0_25px_rgba(255,214,10,0.5)]',
}

export default function GlowButton({
  children,
  variant = 'primary',
  size = 'md',
  glow = 'blue',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  icon,
  fullWidth = false,
}: GlowButtonProps) {
  return (
    <motion.button
      className={`
        relative inline-flex items-center justify-center
        font-medium rounded-xl
        transition-all duration-200 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${variant !== 'glow' && variant !== 'primary' ? glowColors[glow] : ''}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.02 } : undefined}
      whileTap={!disabled && !loading ? { scale: 0.98 } : undefined}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </motion.button>
  )
}
