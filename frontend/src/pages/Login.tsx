/**
 * 登录页面
 * 使用玻璃拟态设计，Apple Pro风格
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Film, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react'
import { api } from '../api/client'
import '../styles/theme.css'
import '../styles/components.css'

interface LoginFormData {
  email: string
  password: string
}

interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

export default function Login() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isRegister, setIsRegister] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      if (isRegister) {
        // 注册逻辑
        await api.post('/api/v1/auth/register', {
          email: formData.email,
          username: formData.email.split('@')[0],
          password: formData.password,
        })
        // 注册成功后自动登录
        const response = await api.post<LoginResponse>('/api/v1/auth/login', {
          username: formData.email,
          password: formData.password,
        })
        localStorage.setItem('auth_token', response.access_token)
        localStorage.setItem('refresh_token', response.refresh_token)
      } else {
        // 登录逻辑
        const response = await api.post<LoginResponse>('/api/v1/auth/login', {
          username: formData.email,
          password: formData.password,
        })
        localStorage.setItem('auth_token', response.access_token)
        localStorage.setItem('refresh_token', response.refresh_token)
      }
      
      // 登录成功，跳转到首页
      window.location.href = '/'
    } catch (err: any) {
      setError(err.response?.data?.detail || '登录失败，请检查邮箱和密码')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-page">
      {/* 动态背景 */}
      <div className="login-background">
        <div className="gradient-orb orb-1" />
        <div className="gradient-orb orb-2" />
        <div className="gradient-orb orb-3" />
        <div className="noise-overlay" />
      </div>

      {/* 主内容 */}
      <div className="login-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="login-card glass-card"
        >
          {/* Logo区域 */}
          <div className="login-header">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="logo-container"
            >
              <div className="logo-icon">
                <Film size={32} />
                <Sparkles className="sparkle-icon" size={16} />
              </div>
            </motion.div>
            <h1 className="login-title">
              {isRegister ? '创建账号' : '欢迎回来'}
            </h1>
            <p className="login-subtitle">
              {isRegister 
                ? '开始您的AI视频创作之旅' 
                : '登录以继续您的创作'}
            </p>
          </div>

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="login-form">
            {/* 邮箱输入 */}
            <div className="input-group">
              <label htmlFor="email">邮箱地址</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="input-glass"
                  required
                />
              </div>
            </div>

            {/* 密码输入 */}
            <div className="input-group">
              <label htmlFor="password">密码</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="输入您的密码"
                  className="input-glass"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="btn-icon password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* 错误提示 */}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="error-message"
              >
                {error}
              </motion.div>
            )}

            {/* 提交按钮 */}
            <motion.button
              type="submit"
              className="btn-primary btn-full"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <div className="loading-spinner" />
              ) : (
                <>
                  {isRegister ? '创建账号' : '登录'}
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>

            {/* 切换登录/注册 */}
            <div className="switch-mode">
              <span>
                {isRegister ? '已有账号？' : '还没有账号？'}
              </span>
              <button
                type="button"
                className="btn-link"
                onClick={() => {
                  setIsRegister(!isRegister)
                  setError('')
                }}
              >
                {isRegister ? '立即登录' : '立即注册'}
              </button>
            </div>
          </form>

          {/* 分隔线 */}
          <div className="divider">
            <span>或使用以下方式</span>
          </div>

          {/* 第三方登录 */}
          <div className="social-login">
            <motion.button
              type="button"
              className="btn-secondary btn-social"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </motion.button>
          </div>
        </motion.div>

        {/* 页脚 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="login-footer"
        >
          登录即表示您同意我们的服务条款和隐私政策
        </motion.p>
      </div>

      {/* 内联样式 */}
      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          background: var(--bg-primary);
        }

        .login-background {
          position: fixed;
          inset: 0;
          z-index: 0;
        }

        .gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.5;
          animation: float 20s ease-in-out infinite;
        }

        .orb-1 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, var(--accent-blue) 0%, transparent 70%);
          top: -200px;
          left: -200px;
          animation-delay: 0s;
        }

        .orb-2 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, var(--accent-purple) 0%, transparent 70%);
          bottom: -150px;
          right: -150px;
          animation-delay: -5s;
        }

        .orb-3 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, var(--accent-orange) 0%, transparent 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: -10s;
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(50px, -50px) scale(1.1);
          }
          50% {
            transform: translate(0, -100px) scale(1);
          }
          75% {
            transform: translate(-50px, -50px) scale(0.9);
          }
        }

        .noise-overlay {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          opacity: 0.03;
          pointer-events: none;
        }

        .login-container {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 420px;
          padding: var(--space-4);
        }

        .login-card {
          padding: var(--space-8);
          width: 100%;
        }

        .login-header {
          text-align: center;
          margin-bottom: var(--space-6);
        }

        .logo-container {
          display: flex;
          justify-content: center;
          margin-bottom: var(--space-4);
        }

        .logo-icon {
          width: 64px;
          height: 64px;
          background: var(--gradient-accent);
          border-radius: var(--card-border-radius);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          position: relative;
        }

        .sparkle-icon {
          position: absolute;
          top: -4px;
          right: -4px;
          color: var(--accent-yellow);
        }

        .login-title {
          font-size: var(--text-2xl);
          font-weight: var(--font-bold);
          color: var(--text-primary);
          margin-bottom: var(--space-2);
        }

        .login-subtitle {
          font-size: var(--text-base);
          color: var(--text-secondary);
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .input-group label {
          font-size: var(--text-sm);
          font-weight: var(--font-medium);
          color: var(--text-secondary);
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 12px;
          color: var(--text-tertiary);
          pointer-events: none;
        }

        .input-wrapper .input-glass {
          padding-left: 40px;
        }

        .password-toggle {
          position: absolute;
          right: 8px;
          color: var(--text-tertiary);
        }

        .password-toggle:hover {
          color: var(--text-secondary);
        }

        .error-message {
          padding: var(--space-3);
          background: rgba(255, 69, 58, 0.1);
          border: 1px solid rgba(255, 69, 58, 0.2);
          border-radius: 8px;
          color: var(--accent-red);
          font-size: var(--text-sm);
        }

        .btn-full {
          width: 100%;
          margin-top: var(--space-2);
        }

        .switch-mode {
          text-align: center;
          font-size: var(--text-sm);
          color: var(--text-secondary);
        }

        .btn-link {
          background: none;
          border: none;
          color: var(--accent-blue);
          font-size: var(--text-sm);
          font-weight: var(--font-medium);
          cursor: pointer;
          margin-left: var(--space-1);
          transition: color 0.2s ease;
        }

        .btn-link:hover {
          color: var(--accent-blue-light);
          text-decoration: underline;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          margin: var(--space-5) 0;
          color: var(--text-tertiary);
          font-size: var(--text-sm);
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--glass-border);
        }

        .social-login {
          display: flex;
          gap: var(--space-3);
        }

        .btn-social {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
        }

        .login-footer {
          text-align: center;
          margin-top: var(--space-6);
          font-size: var(--text-xs);
          color: var(--text-quaternary);
        }

        @media (max-width: 480px) {
          .login-card {
            padding: var(--space-5);
          }

          .login-title {
            font-size: var(--text-xl);
          }
        }
      `}</style>
    </div>
  )
}
