/**
 * 剧本创作页面
 * 支持AI辅助生成和手动编辑剧本
 * 集成后端API存储
 */

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, 
  Sparkles, 
  Save, 
  Download, 
  Plus, 
  Trash2, 
  Edit3,
  Wand2,
  Clock,
  Check,
  AlertCircle,
  ArrowLeft,
  MoreVertical,
  Edit2
} from 'lucide-react'
import { scriptApi, Script, ScriptCreate } from '../services/scriptApi'
import '../styles/theme.css'
import '../styles/components.css'

const GENRES = [
  { value: 'comedy', label: '喜剧', color: '#FF9500' },
  { value: 'drama', label: '剧情', color: '#5856D6' },
  { value: 'action', label: '动作', color: '#FF3B30' },
  { value: 'romance', label: '爱情', color: '#FF2D55' },
  { value: 'scifi', label: '科幻', color: '#007AFF' },
  { value: 'horror', label: '恐怖', color: '#8E8E93' },
  { value: 'documentary', label: '纪录', color: '#34C759' },
  { value: 'animation', label: '动画', color: '#AF52DE' },
]

export default function ScriptCreation() {
  const [scripts, setScripts] = useState<Script[]>([])
  const [currentScript, setCurrentScript] = useState<Script | null>(null)
  const [scriptContent, setScriptContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [scriptToRename, setScriptToRename] = useState<Script | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor')
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [error, setError] = useState('')
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // 新项目表单
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    genre: 'drama',
    targetAudience: '',
    duration: 5,
  })

  // AI生成提示词
  const [aiPrompt, setAiPrompt] = useState('')
  // Prompt优化建议
  const [promptSuggestions, setPromptSuggestions] = useState<string[]>([])
  // 内容优化建议
  const [contentSuggestions, setContentSuggestions] = useState<{
    type: 'structure' | 'dialogue' | 'description' | 'character'
    title: string
    description: string
    suggestion: string
  }[]>([])

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpenId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 加载剧本列表
  useEffect(() => {
    loadScripts()
  }, [])

  const loadScripts = async () => {
    try {
      setIsLoading(true)
      const data = await scriptApi.getScripts()
      setScripts(data)
    } catch (err: any) {
      // 错误已经在API层处理，这里不需要显示错误
      console.log('使用本地存储模式')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateScript = async () => {
    if (!newProject.title.trim()) return

    try {
      setIsLoading(true)
      const scriptData: ScriptCreate = {
        title: newProject.title,
        description: newProject.description,
        genre: newProject.genre,
        target_audience: newProject.targetAudience,
        duration: newProject.duration,
        status: 'draft',
      }
      
      const newScript = await scriptApi.createScript(scriptData)
      setScripts([newScript, ...scripts])
      setCurrentScript(newScript)
      setShowCreateModal(false)
      setNewProject({
        title: '',
        description: '',
        genre: 'drama',
        targetAudience: '',
        duration: 5,
      })
    } catch (err: any) {
      // 错误已经在API层处理
      console.log('创建剧本时使用本地存储')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectScript = async (script: Script) => {
    try {
      setCurrentScript(script)
      setScriptContent(script.content || '')
      setMenuOpenId(null)
    } catch (err: any) {
      setError('加载剧本内容失败')
    }
  }

  const handleDeleteScript = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('确定要删除这个剧本吗？')) return

    try {
      await scriptApi.deleteScript(id)
      setScripts(scripts.filter(s => s.id !== id))
      if (currentScript?.id === id) {
        setCurrentScript(null)
        setScriptContent('')
      }
    } catch (err: any) {
      // 本地删除
      setScripts(scripts.filter(s => s.id !== id))
      if (currentScript?.id === id) {
        setCurrentScript(null)
        setScriptContent('')
      }
    }
    setMenuOpenId(null)
  }

  const handleRenameScript = async (script: Script) => {
    setScriptToRename(script)
    setNewTitle(script.title)
    setShowRenameModal(true)
    setMenuOpenId(null)
  }

  const handleConfirmRename = async () => {
    if (!scriptToRename || !newTitle.trim()) return

    try {
      const updated = await scriptApi.updateScript(scriptToRename.id, {
        title: newTitle.trim()
      })
      setScripts(scripts.map(s => s.id === updated.id ? updated : s))
      if (currentScript?.id === updated.id) {
        setCurrentScript(updated)
      }
    } catch (err: any) {
      // 本地更新
      const updated = { ...scriptToRename, title: newTitle.trim() }
      setScripts(scripts.map(s => s.id === updated.id ? updated : s))
      if (currentScript?.id === updated.id) {
        setCurrentScript(updated)
      }
    }
    setShowRenameModal(false)
    setScriptToRename(null)
    setNewTitle('')
  }

  // 自动保存剧本内容
  useEffect(() => {
    if (!currentScript) return
    
    const saveContent = async () => {
      setSaveStatus('saving')
      try {
        await scriptApi.updateScriptContent(currentScript.id, scriptContent)
        setSaveStatus('saved')
        setLastSaved(new Date())
      } catch (err) {
        // 本地保存作为后备
        localStorage.setItem(`script_content_${currentScript.id}`, scriptContent)
        setSaveStatus('saved')
        setLastSaved(new Date())
      }
    }

    const timeoutId = setTimeout(saveContent, 1000)
    setSaveStatus('unsaved')
    
    return () => clearTimeout(timeoutId)
  }, [scriptContent, currentScript])

  // 优化提示词
  const optimizePrompt = async () => {
    if (!aiPrompt.trim()) return
    
    try {
      setIsLoading(true)
      const suggestions = await scriptApi.optimizePrompt(aiPrompt)
      setPromptSuggestions(suggestions)
    } catch (error) {
      console.error('优化提示词失败:', error)
      setError('优化提示词失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  // 应用提示词建议
  const applyPromptSuggestion = (suggestion: string) => {
    setAiPrompt(suggestion)
    setPromptSuggestions([])
  }

  // 优化剧本内容
  const optimizeScriptContent = async () => {
    if (!scriptContent.trim()) return
    
    try {
      setIsLoading(true)
      const suggestions = await scriptApi.optimizeContent(scriptContent, currentScript?.id)
      setContentSuggestions(suggestions)
    } catch (error) {
      console.error('优化内容失败:', error)
      setError('优化内容失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  // 应用内容优化建议
  const applyContentSuggestion = (suggestion: string) => {
    setScriptContent(suggestion)
    setContentSuggestions([])
  }

  const handleGenerateScript = async () => {
    if (!currentScript || !aiPrompt.trim()) return

    setIsGenerating(true)
    
    try {
      // 模拟AI生成过程
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const generatedScript = generateMockScript(currentScript, aiPrompt)
      setScriptContent(generatedScript)
      
      // 生成后自动分析并提供优化建议
      const suggestions = await scriptApi.optimizeContent(generatedScript, currentScript.id)
      setContentSuggestions(suggestions)
    } catch (error) {
      console.error('生成剧本失败:', error)
      setError('生成剧本失败，请重试')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleExportScript = () => {
    if (!scriptContent) return
    
    const blob = new Blob([scriptContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${currentScript?.title || '剧本'}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="script-creation-page">
      {/* 左侧剧本列表 */}
      <div className="projects-sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-title">
            <FileText size={20} />
            我的剧本
          </h2>
          <motion.button
            className="btn-icon btn-primary"
            onClick={() => setShowCreateModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={18} />
          </motion.button>
        </div>

        <div className="projects-list">
          {isLoading ? (
            <div className="empty-state">
              <div className="loading-spinner" />
              <p>加载中...</p>
            </div>
          ) : scripts.length === 0 ? (
            <div className="empty-state">
              <FileText size={48} className="empty-icon" />
              <p>还没有剧本项目</p>
              <button 
                className="btn-link"
                onClick={() => setShowCreateModal(true)}
              >
                创建第一个剧本
              </button>
            </div>
          ) : (
            scripts.map(script => (
              <motion.div
                key={script.id}
                className={`project-card ${currentScript?.id === script.id ? 'active' : ''}`}
                onClick={() => handleSelectScript(script)}
                whileHover={{ x: 4 }}
              >
                <div className="project-info">
                  <h3 className="project-title">{script.title}</h3>
                  <div className="project-meta">
                    <span 
                      className="genre-badge"
                      style={{ 
                        backgroundColor: `${GENRES.find(g => g.value === script.genre)?.color}20`,
                        color: GENRES.find(g => g.value === script.genre)?.color 
                      }}
                    >
                      {GENRES.find(g => g.value === script.genre)?.label || '剧情'}
                    </span>
                    <span className="duration-badge">
                      <Clock size={12} />
                      {script.duration}分钟
                    </span>
                  </div>
                </div>
                
                {/* 管理菜单按钮 */}
                <div className="menu-container" ref={menuOpenId === script.id ? menuRef : null}>
                  <motion.button
                    className="btn-icon btn-ghost menu-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      setMenuOpenId(menuOpenId === script.id ? null : script.id)
                    }}
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MoreVertical size={16} />
                  </motion.button>
                  
                  {/* 下拉菜单 */}
                  <AnimatePresence>
                    {menuOpenId === script.id && (
                      <motion.div
                        className="dropdown-menu"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      >
                        <motion.button
                          className="menu-item"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRenameScript(script)
                          }}
                          whileHover={{ backgroundColor: 'rgba(10, 132, 255, 0.1)', x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Edit2 size={14} />
                          重命名
                        </motion.button>
                        <motion.button
                          className="menu-item delete"
                          onClick={(e) => handleDeleteScript(script.id, e)}
                          whileHover={{ backgroundColor: 'rgba(255, 59, 48, 0.1)', x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Trash2 size={14} />
                          删除
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* 右侧编辑区域 */}
      <div className="editor-main">
        {currentScript ? (
          <>
            {/* 项目头部 */}
            <div className="editor-header">
              <div className="project-header-info">
                {/* 返回按钮 - 返回到剧本列表 */}
                <motion.button
                  className="btn-back"
                  onClick={() => {
                    setCurrentScript(null)
                    setScriptContent('')
                  }}
                  whileHover={{ x: -4 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft size={18} />
                  返回
                </motion.button>
                <h1 className="project-header-title">{currentScript.title}</h1>
                <p className="project-header-desc">{currentScript.description}</p>
              </div>
              <div className="editor-actions">
                {/* 保存状态指示器 */}
                <div className="save-status-indicator">
                  {saveStatus === 'saving' && (
                    <span className="status-saving">
                      <div className="loading-spinner-small" />
                      保存中...
                    </span>
                  )}
                  {saveStatus === 'saved' && lastSaved && (
                    <span className="status-saved">
                      <Check size={14} />
                      已保存 {lastSaved.toLocaleTimeString()}
                    </span>
                  )}
                  {saveStatus === 'unsaved' && (
                    <span className="status-unsaved">
                      <AlertCircle size={14} />
                      未保存
                    </span>
                  )}
                </div>
                <motion.button 
                  className="btn-secondary"
                  onClick={async () => {
                    if (!currentScript) return
                    try {
                      setSaveStatus('saving')
                      await scriptApi.updateScriptContent(currentScript.id, scriptContent)
                      setSaveStatus('saved')
                      setLastSaved(new Date())
                    } catch (error) {
                      console.error('保存失败:', error)
                      setError('保存失败，请重试')
                      setSaveStatus('unsaved')
                    }
                  }}
                  disabled={!currentScript || !scriptContent}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Save size={16} />
                  保存
                </motion.button>
                <motion.button 
                  className="btn-secondary"
                  onClick={optimizeScriptContent}
                  disabled={!scriptContent}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Wand2 size={16} />
                  优化内容
                </motion.button>
                <motion.button 
                  className="btn-secondary"
                  onClick={handleExportScript}
                  disabled={!scriptContent}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download size={16} />
                  导出
                </motion.button>
              </div>
            </div>

            {/* 标签切换 */}
            <div className="editor-tabs">
              <button
                className={`tab ${activeTab === 'editor' ? 'active' : ''}`}
                onClick={() => setActiveTab('editor')}
              >
                <Edit3 size={16} />
                编辑器
              </button>
              <button
                className={`tab ${activeTab === 'preview' ? 'active' : ''}`}
                onClick={() => setActiveTab('preview')}
              >
                <FileText size={16} />
                预览
              </button>
            </div>

            {/* AI生成区域 */}
            <div className="ai-generation-section">
              <div className="ai-input-wrapper">
                <Wand2 size={18} className="ai-icon" />
                <input
                  type="text"
                  placeholder="描述你想要的剧本内容，AI将为你生成..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="ai-input"
                />
                <motion.button
                  className="btn-secondary ai-optimize-btn"
                  onClick={optimizePrompt}
                  disabled={!aiPrompt.trim()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Edit3 size={16} />
                  优化提示词
                </motion.button>
                <motion.button
                  className="btn-primary ai-generate-btn"
                  onClick={handleGenerateScript}
                  disabled={isGenerating || !aiPrompt.trim()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isGenerating ? (
                    <div className="loading-spinner" />
                  ) : (
                    <>
                      <Sparkles size={16} />
                      生成剧本
                    </>
                  )}
                </motion.button>
              </div>
              
              {/* Prompt优化建议 */}
              <AnimatePresence>
                {promptSuggestions.length > 0 && (
                  <motion.div
                    className="prompt-suggestions"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <h4 className="suggestions-title">
                      <Sparkles size={16} />
                      提示词优化建议
                    </h4>
                    <div className="suggestions-list">
                      {promptSuggestions.map((suggestion, index) => (
                        <motion.button
                          key={index}
                          className="suggestion-item"
                          onClick={() => applyPromptSuggestion(suggestion)}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Plus size={14} className="suggestion-icon" />
                          {suggestion}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 编辑器内容 */}
            <div className="editor-content">
              {activeTab === 'editor' ? (
                <textarea
                  className="script-editor"
                  value={scriptContent}
                  onChange={(e) => setScriptContent(e.target.value)}
                  placeholder="在此编写你的剧本...&#10;&#10;格式建议：&#10;场景1：开头&#10;[画面描述]&#10;角色A：（台词）&#10;角色B：（台词）&#10;&#10;场景2：发展&#10;..."
                />
              ) : (
                <div className="script-preview">
                  {scriptContent ? (
                    <pre>{scriptContent}</pre>
                  ) : (
                    <div className="empty-preview">
                      <FileText size={64} className="empty-icon" />
                      <p>剧本内容将在这里预览</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* 内容优化建议 */}
            <AnimatePresence>
              {contentSuggestions.length > 0 && (
                <motion.div
                  className="content-suggestions"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <h4 className="suggestions-title">
                    <Wand2 size={16} />
                    内容优化建议
                  </h4>
                  <div className="suggestions-grid">
                    {contentSuggestions.map((suggestion, index) => (
                      <motion.div
                        key={index}
                        className={`suggestion-card suggestion-${suggestion.type}`}
                        whileHover={{ y: -4 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <div className="suggestion-header">
                          <h5 className="suggestion-title">{suggestion.title}</h5>
                          <span 
                            className="suggestion-type"
                            style={{
                              backgroundColor: suggestion.type === 'structure' ? 'rgba(10, 132, 255, 0.2)' :
                                             suggestion.type === 'dialogue' ? 'rgba(48, 209, 88, 0.2)' :
                                             suggestion.type === 'description' ? 'rgba(191, 90, 242, 0.2)' :
                                             'rgba(255, 159, 10, 0.2)',
                              color: suggestion.type === 'structure' ? '#0a84ff' :
                                     suggestion.type === 'dialogue' ? '#30d158' :
                                     suggestion.type === 'description' ? '#bf5af2' :
                                     '#ff9f0a'
                            }}
                          >
                            {suggestion.type === 'structure' ? '结构' :
                             suggestion.type === 'dialogue' ? '对话' :
                             suggestion.type === 'description' ? '描述' :
                             '角色'}
                          </span>
                        </div>
                        <p className="suggestion-description">{suggestion.description}</p>
                        <motion.button
                          className="btn-small btn-primary"
                          onClick={() => applyContentSuggestion(suggestion.suggestion)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          应用建议
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <div className="empty-editor">
            <div className="empty-state-large">
              <FileText size={80} className="empty-icon" />
              <h2>选择一个剧本项目开始创作</h2>
              <p>或者创建一个新的剧本项目</p>
              <button 
                className="btn-primary btn-large"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus size={20} />
                创建剧本项目
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 创建项目模态框 */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="modal-title">创建新剧本</h2>
              
              <div className="form-group">
                <label>剧本标题 *</label>
                <input
                  type="text"
                  value={newProject.title}
                  onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                  placeholder="给你的剧本起个名字"
                  className="input-glass"
                />
              </div>

              <div className="form-group">
                <label>剧本简介</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  placeholder="简要描述剧本的内容和风格"
                  className="input-glass"
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>类型</label>
                  <select
                    value={newProject.genre}
                    onChange={(e) => setNewProject({...newProject, genre: e.target.value})}
                    className="input-glass"
                  >
                    {GENRES.map(genre => (
                      <option key={genre.value} value={genre.value}>
                        {genre.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>目标时长（分钟）</label>
                  <input
                    type="number"
                    value={newProject.duration}
                    onChange={(e) => setNewProject({...newProject, duration: parseInt(e.target.value) || 5})}
                    min={1}
                    max={120}
                    className="input-glass"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>目标受众</label>
                <input
                  type="text"
                  value={newProject.targetAudience}
                  onChange={(e) => setNewProject({...newProject, targetAudience: e.target.value})}
                  placeholder="例如：年轻人、家庭观众、专业人士等"
                  className="input-glass"
                />
              </div>

              <div className="modal-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  取消
                </button>
                <button 
                  className="btn-primary"
                  onClick={handleCreateScript}
                  disabled={!newProject.title.trim() || isLoading}
                >
                  {isLoading ? <div className="loading-spinner" /> : '创建项目'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 重命名模态框 */}
      <AnimatePresence>
        {showRenameModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRenameModal(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="modal-title">重命名剧本</h2>
              
              <div className="form-group">
                <label>新标题</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="输入新标题"
                  className="input-glass"
                  autoFocus
                />
              </div>

              <div className="modal-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => {
                    setShowRenameModal(false)
                    setScriptToRename(null)
                    setNewTitle('')
                  }}
                >
                  取消
                </button>
                <button 
                  className="btn-primary"
                  onClick={handleConfirmRename}
                  disabled={!newTitle.trim()}
                >
                  确认
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 错误提示 */}
      {error && (
        <motion.div
          className="error-toast"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          {error}
          <button onClick={() => setError('')}>×</button>
        </motion.div>
      )}

      {/* 样式 */}
      <style>{`
        .script-creation-page {
          display: flex;
          height: 100vh;
          background: var(--bg-secondary);
          overflow: hidden;
        }

        .projects-sidebar {
          width: 300px;
          background: var(--bg-secondary);
          border-right: 1px solid var(--glass-border);
          display: flex;
          flex-direction: column;
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-4);
          border-bottom: 1px solid var(--glass-border);
        }

        .sidebar-title {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-lg);
          font-weight: var(--font-semibold);
          color: var(--text-primary);
        }

        .projects-list {
          flex: 1;
          overflow-y: auto;
          padding: var(--space-2);
        }

        .project-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-4);
          margin-bottom: var(--space-3);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--glass-border);
          border-radius: var(--card-border-radius);
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          backdrop-filter: blur(8px);
        }

        .project-card:hover,
        .project-card.active {
          background: rgba(10, 132, 255, 0.1);
          border-color: rgba(10, 132, 255, 0.3);
          transform: translateX(6px);
          box-shadow: 0 4px 16px rgba(10, 132, 255, 0.1);
        }

        .project-info {
          flex: 1;
          min-width: 0;
        }

        .project-title {
          font-size: var(--text-sm);
          font-weight: var(--font-medium);
          color: var(--text-primary);
          margin-bottom: var(--space-1);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .project-meta {
          display: flex;
          gap: var(--space-2);
        }

        .genre-badge,
        .duration-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: var(--text-xs);
        }

        .menu-container {
          position: relative;
        }

        .menu-btn {
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .project-card:hover .menu-btn,
        .menu-btn.active {
          opacity: 1;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 4px;
          background: var(--bg-secondary);
          border: 1px solid var(--glass-border);
          border-radius: var(--button-border-radius);
          padding: var(--space-1);
          min-width: 140px;
          z-index: 100;
          box-shadow: var(--glass-shadow);
          backdrop-filter: blur(10px);
        }

        .menu-item {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          width: 100%;
          padding: var(--space-3) var(--space-4);
          background: transparent;
          border: none;
          border-radius: var(--button-border-radius);
          color: var(--text-secondary);
          font-size: var(--text-sm);
          font-weight: var(--font-medium);
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }

        .menu-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-primary);
          transform: translateX(4px);
        }

        .menu-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: transparent;
          transition: all 0.2s ease;
        }

        .menu-item:hover::before {
          background: var(--accent-blue);
        }

        .menu-item.delete {
          color: var(--accent-red);
        }

        .menu-item.delete:hover {
          background: rgba(255, 59, 48, 0.1);
        }

        .menu-item.delete:hover::before {
          background: var(--accent-red);
        }

        .menu-btn {
          opacity: 0;
          transition: opacity 0.2s ease, transform 0.2s ease;
          border-radius: var(--button-border-radius);
        }

        .project-card:hover .menu-btn {
          opacity: 1;
          transform: scale(1.05);
        }

        .editor-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: var(--bg-secondary);
        }

        .editor-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-3) var(--space-4);
          border-bottom: 1px solid var(--glass-border);
          background: var(--bg-secondary);
        }

        .project-header-title {
          font-size: var(--text-xl);
          font-weight: var(--font-bold);
          color: var(--text-primary);
        }

        .project-header-desc {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          margin-top: var(--space-1);
        }

        .editor-actions {
          display: flex;
          gap: var(--space-2);
        }

        .editor-tabs {
          display: flex;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          border-bottom: 1px solid var(--glass-border);
          background: var(--bg-secondary);
        }

        .tab {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-3) var(--space-5);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--glass-border);
          border-radius: var(--button-border-radius);
          color: var(--text-secondary);
          font-size: var(--text-sm);
          font-weight: var(--font-medium);
          cursor: pointer;
          transition: all 0.2s ease;
          backdrop-filter: blur(8px);
        }

        .tab:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
          color: var(--text-primary);
        }

        .tab.active {
          background: rgba(10, 132, 255, 0.15);
          border-color: rgba(10, 132, 255, 0.4);
          color: var(--accent-blue);
          box-shadow: 0 2px 8px rgba(10, 132, 255, 0.2);
        }

        .ai-generation-section {
          padding: var(--space-3) var(--space-4);
          border-bottom: 1px solid var(--glass-border);
          background: var(--bg-secondary);
        }

        .ai-input-wrapper {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-3);
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
        }

        .ai-optimize-btn {
          padding: var(--space-2) var(--space-3);
          border-radius: var(--button-border-radius);
          font-size: var(--text-sm);
        }

        .ai-generate-btn {
          padding: var(--space-2) var(--space-4);
          border-radius: var(--button-border-radius);
          font-size: var(--text-sm);
        }

        .ai-icon {
          color: var(--accent-purple);
        }

        .ai-input {
          flex: 1;
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-size: var(--text-sm);
          outline: none;
        }

        .ai-input::placeholder {
          color: var(--text-tertiary);
        }

        .editor-content {
          flex: 1;
          overflow: hidden;
        }

        .script-editor {
          width: 100%;
          height: 100%;
          padding: var(--space-4);
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-family: 'SF Mono', monospace;
          font-size: var(--text-sm);
          line-height: 1.8;
          resize: none;
          outline: none;
        }

        .script-preview {
          width: 100%;
          height: 100%;
          padding: var(--space-4);
          overflow-y: auto;
        }

        .script-preview pre {
          white-space: pre-wrap;
          font-family: 'SF Mono', monospace;
          font-size: var(--text-sm);
          line-height: 1.8;
          color: var(--text-primary);
        }

        .empty-editor {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .empty-state-large {
          text-align: center;
        }

        .empty-state-large h2 {
          font-size: var(--text-xl);
          color: var(--text-primary);
          margin: var(--space-4) 0 var(--space-2);
        }

        .empty-state-large p {
          color: var(--text-secondary);
          margin-bottom: var(--space-6);
        }

        .btn-large {
          padding: var(--space-3) var(--space-6);
          font-size: var(--text-base);
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
        }

        .modal-content {
          width: 100%;
          max-width: 480px;
          padding: var(--space-6);
          background: var(--bg-secondary);
          border: 1px solid var(--glass-border);
          border-radius: var(--card-border-radius);
        }

        .modal-title {
          font-size: var(--text-xl);
          font-weight: var(--font-bold);
          color: var(--text-primary);
          margin-bottom: var(--space-4);
        }

        .form-group {
          margin-bottom: var(--space-4);
        }

        .form-group label {
          display: block;
          font-size: var(--text-sm);
          font-weight: var(--font-medium);
          color: var(--text-secondary);
          margin-bottom: var(--space-2);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-4);
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--space-3);
          margin-top: var(--space-6);
        }

        .empty-state {
          text-align: center;
          padding: var(--space-8);
        }

        .empty-icon {
          color: var(--text-tertiary);
          margin-bottom: var(--space-4);
        }

        .empty-state p {
          color: var(--text-secondary);
          margin-bottom: var(--space-2);
        }

        .empty-preview {
          text-align: center;
          padding: var(--space-12);
        }

        .save-status-indicator {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-xs);
          margin-right: var(--space-3);
        }

        .status-saving {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--accent-blue);
        }

        .status-saved {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--accent-green);
        }

        .status-unsaved {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--accent-orange);
        }

        .loading-spinner-small {
          width: 12px;
          height: 12px;
          border: 2px solid var(--glass-border);
          border-top-color: var(--accent-blue);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .btn-back {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-4);
          margin-bottom: var(--space-3);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--glass-border);
          border-radius: var(--button-border-radius);
          color: var(--text-secondary);
          font-size: var(--text-sm);
          font-weight: var(--font-medium);
          cursor: pointer;
          transition: all 0.2s ease;
          backdrop-filter: blur(8px);
        }

        .btn-back:hover {
          background: rgba(10, 132, 255, 0.1);
          border-color: rgba(10, 132, 255, 0.3);
          color: var(--accent-blue);
          transform: translateX(-2px);
        }

        .error-toast {
          position: fixed;
          bottom: var(--space-4);
          right: var(--space-4);
          padding: var(--space-3) var(--space-4);
          background: rgba(255, 59, 48, 0.9);
          border-radius: 8px;
          color: white;
          display: flex;
          align-items: center;
          gap: var(--space-3);
          z-index: 200;
        }

        .error-toast button {
          background: none;
          border: none;
          color: white;
          font-size: 18px;
          cursor: pointer;
        }

        /* Prompt优化建议样式 */
        .prompt-suggestions {
          margin-top: var(--space-4);
          padding: var(--space-3);
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: var(--card-border-radius);
        }

        .suggestions-title {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-sm);
          font-weight: var(--font-semibold);
          color: var(--text-primary);
          margin-bottom: var(--space-3);
        }

        .suggestions-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .suggestion-item {
          display: flex;
          align-items: flex-start;
          gap: var(--space-2);
          padding: var(--space-3);
          background: transparent;
          border: 1px solid var(--glass-border);
          border-radius: var(--button-border-radius);
          color: var(--text-secondary);
          font-size: var(--text-sm);
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .suggestion-item:hover {
          background: rgba(10, 132, 255, 0.1);
          border-color: rgba(10, 132, 255, 0.3);
          color: var(--text-primary);
        }

        .suggestion-icon {
          margin-top: 2px;
          flex-shrink: 0;
        }

        /* 内容优化建议样式 */
        .content-suggestions {
          padding: var(--space-4);
          border-top: 1px solid var(--glass-border);
          background: var(--bg-secondary);
        }

        .suggestions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--space-4);
          margin-top: var(--space-3);
        }

        .suggestion-card {
          padding: var(--space-4);
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: var(--card-border-radius);
          transition: all 0.2s ease;
        }

        .suggestion-card:hover {
          box-shadow: var(--glass-shadow);
        }

        .suggestion-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--space-2);
        }

        .suggestion-title {
          font-size: var(--text-sm);
          font-weight: var(--font-semibold);
          color: var(--text-primary);
          margin: 0;
        }

        .suggestion-type {
          padding: 2px 8px;
          border-radius: 4px;
          font-size: var(--text-xs);
          font-weight: var(--font-medium);
        }

        .suggestion-description {
          font-size: var(--text-xs);
          color: var(--text-secondary);
          margin-bottom: var(--space-3);
          line-height: 1.4;
        }

        .btn-small {
          padding: var(--space-1) var(--space-3);
          font-size: var(--text-xs);
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}



// 模拟AI生成剧本
function generateMockScript(script: Script, prompt: string): string {
  return `${script.title}

类型：${script.genre || '剧情'}
目标时长：${script.duration}分钟
目标受众：${script.target_audience || '通用观众'}

=== 场景1：开头 ===

[画面描述]
镜头缓缓推进，展现主要场景。环境氛围引人入胜。

主角：（独白）
${prompt}...

[画面描述]
镜头切换，展示配角进入场景。

配角：（对话）
你来了。我一直在等你。

主角：（对话）
我知道。有些事情我们必须面对。

=== 场景2：发展 ===

[画面描述]
情节逐渐展开，冲突开始显现。

配角：（对话）
但是这样做真的值得吗？

主角：（对话）
有些事情不是为了值得，而是因为必须做。

[画面描述]
紧张的气氛中，主角做出重要决定。

=== 场景3：高潮 ===

[画面描述]
剧情达到顶点，所有矛盾集中爆发。

主角：（独白）
这一刻，我终于明白了一切...

[画面描述]
关键转折点，主角面临最终选择。

=== 场景4：结局 ===

[画面描述]
故事走向尾声，留下余韵。

主角：（对话）
这就是我们的故事。

配角：（对话）
是的，而这只是开始。

[画面描述]
镜头拉远，故事结束。

=== 完 ===

（注：这是AI生成的初稿，请根据需要进行修改和完善）`
}
