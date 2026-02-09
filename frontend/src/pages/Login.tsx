/**
 * 登录页面
 * 使用玻璃拟态设计，Apple Pro风格
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Film, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react'
import axios from 'axios'
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

  const handleTestAccountLogin = async (email: string, password: string) => {
    setIsLoading(true)
    setError('')

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

    try {
      const formDataObj = new URLSearchParams()
      formDataObj.append('username', email)
      formDataObj.append('password', password)
      
      const response = await axios.post<LoginResponse>(`${API_BASE_URL}/auth/login`, formDataObj, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      localStorage.setItem('auth_token', response.data.access_token)
      localStorage.setItem('refresh_token', response.data.refresh_token)
      window.location.href = '/'
    } catch (err: any) {
      setError(err.response?.data?.detail || '测试账号登录失败')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

    try {
      if (isRegister) {
        // 注册逻辑 - 使用JSON
        await axios.post(`${API_BASE_URL}/auth/register`, {
          email: formData.email,
          username: formData.email.split('@')[0],
          password: formData.password,
        })
        // 注册成功后自动登录 - 使用表单数据
        const formDataObj = new URLSearchParams()
        formDataObj.append('username', formData.email)
        formDataObj.append('password', formData.password)
        
        const response = await axios.post<LoginResponse>(`${API_BASE_URL}/auth/login`, formDataObj, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
        localStorage.setItem('auth_token', response.data.access_token)
        localStorage.setItem('refresh_token', response.data.refresh_token)
      } else {
        // 登录逻辑 - 使用表单数据
        const formDataObj = new URLSearchParams()
        formDataObj.append('username', formData.email)
        formDataObj.append('password', formData.password)
        
        const response = await axios.post<LoginResponse>(`${API_BASE_URL}/auth/login`, formDataObj, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
        localStorage.setItem('auth_token', response.data.access_token)
        localStorage.setItem('refresh_token', response.data.refresh_token)
      }
      
      // 登录成功，跳转到首页
      window.location.href = '/'
    } catch (err: any) {
      const errorDetail = err.response?.data?.detail
      if (isRegister) {
        // 注册时的错误提示
        if (errorDetail?.includes('Email already registered')) {
          setError('该邮箱已被注册，请使用其他邮箱或直接登录')
        } else if (errorDetail?.includes('Username already taken')) {
          setError('该用户名已被使用，请更换用户名')
        } else {
          setError(errorDetail || '注册失败，请稍后重试')
        }
      } else {
        // 登录时的错误提示
        setError(errorDetail || '登录失败，请检查邮箱和密码')
      }
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

          {/* 测试账号快速登录 */}
          <div className="test-accounts-section">
            <div className="divider">
              <span>测试账号快速登录</span>
            </div>
            <div className="test-accounts-grid">
              <motion.button
                type="button"
                className="btn-test-account"
                onClick={() => handleTestAccountLogin('test@afm.io', 'Test123456!')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="test-account-role">用户</span>
                <span className="test-account-email">test@afm.io</span>
              </motion.button>
              <motion.button
                type="button"
                className="btn-test-account"
                onClick={() => handleTestAccountLogin('admin@afm.io', 'Admin123456!')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="test-account-role">管理员</span>
                <span className="test-account-email">admin@afm.io</span>
              </motion.button>
              <motion.button
                type="button"
                className="btn-test-account"
                onClick={() => handleTestAccountLogin('guest@afm.io', 'Guest123456!')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="test-account-role">访客</span>
                <span className="test-account-email">guest@afm.io</span>
              </motion.button>
            </div>
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

        .test-accounts-section {
          margin-top: var(--space-4);
        }

        .test-accounts-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-2);
        }

        .btn-test-account {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-1);
          padding: var(--space-3);
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-test-account:hover {
          background: rgba(10, 132, 255, 0.1);
          border-color: rgba(10, 132, 255, 0.3);
        }

        .test-account-role {
          font-size: var(--text-xs);
          font-weight: var(--font-medium);
          color: var(--accent-blue);
        }

        .test-account-email {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
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
