/**
 * 剧本创作页面
 * 支持AI辅助生成和手动编辑剧本
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, 
  Sparkles, 
  Save, 
  Download, 
  Plus, 
  Trash2, 
  Edit3,
  ChevronRight,
  Wand2,
  Clock,
  Tag,
  MoreVertical,
  Check,
  AlertCircle,
  ArrowLeft
} from 'lucide-react'
import axios from 'axios'
import '../styles/theme.css'
import '../styles/components.css'

interface Script {
  id: string
  title: string
  content: string
  genre: string
  targetDuration: number
  createdAt: string
  updatedAt: string
  status: 'draft' | 'generating' | 'completed'
}

interface ScriptProject {
  id: string
  title: string
  description: string
  genre: string
  targetAudience: string
  duration: number
  createdAt: string
}

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

interface ScriptCreationProps {
  onBack?: () => void
}

export default function ScriptCreation({ onBack }: ScriptCreationProps) {
  const [projects, setProjects] = useState<ScriptProject[]>([])
  const [currentProject, setCurrentProject] = useState<ScriptProject | null>(null)
  const [scriptContent, setScriptContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor')
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

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

  // 加载项目列表
  useEffect(() => {
    // 从localStorage加载项目（实际应该从后端API加载）
    const savedProjects = localStorage.getItem('script_projects')
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects))
    }
  }, [])

  // 保存项目列表
  useEffect(() => {
    localStorage.setItem('script_projects', JSON.stringify(projects))
  }, [projects])

  // 自动保存剧本内容
  useEffect(() => {
    if (!currentProject) return
    
    const saveContent = () => {
      setSaveStatus('saving')
      localStorage.setItem(`script_${currentProject.id}`, scriptContent)
      setSaveStatus('saved')
      setLastSaved(new Date())
    }

    // 延迟保存，避免频繁写入
    const timeoutId = setTimeout(saveContent, 1000)
    setSaveStatus('unsaved')
    
    return () => clearTimeout(timeoutId)
  }, [scriptContent, currentProject])

  const handleCreateProject = () => {
    if (!newProject.title.trim()) return

    const project: ScriptProject = {
      id: Date.now().toString(),
      title: newProject.title,
      description: newProject.description,
      genre: newProject.genre,
      targetAudience: newProject.targetAudience,
      duration: newProject.duration,
      createdAt: new Date().toISOString(),
    }

    setProjects([project, ...projects])
    setCurrentProject(project)
    setShowCreateModal(false)
    setNewProject({
      title: '',
      description: '',
      genre: 'drama',
      targetAudience: '',
      duration: 5,
    })
  }

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id))
    if (currentProject?.id === id) {
      setCurrentProject(null)
      setScriptContent('')
    }
  }

  const handleGenerateScript = async () => {
    if (!currentProject || !aiPrompt.trim()) return

    setIsGenerating(true)
    
    // 模拟AI生成（实际应该调用后端API）
    setTimeout(() => {
      const generatedScript = generateMockScript(currentProject, aiPrompt)
      setScriptContent(generatedScript)
      setIsGenerating(false)
    }, 3000)
  }

  const handleSaveScript = () => {
    if (!currentProject) return
    // 保存到localStorage（实际应该调用后端API）
    localStorage.setItem(`script_${currentProject.id}`, scriptContent)
    alert('剧本已保存！')
  }

  const handleExportScript = () => {
    if (!scriptContent) return
    
    const blob = new Blob([scriptContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${currentProject?.title || '剧本'}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="script-creation-page">
      {/* 左侧项目列表 */}
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
          {projects.length === 0 ? (
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
            projects.map(project => (
              <motion.div
                key={project.id}
                className={`project-card ${currentProject?.id === project.id ? 'active' : ''}`}
                onClick={() => {
                  setCurrentProject(project)
                  const saved = localStorage.getItem(`script_${project.id}`)
                  setScriptContent(saved || '')
                }}
                whileHover={{ x: 4 }}
              >
                <div className="project-info">
                  <h3 className="project-title">{project.title}</h3>
                  <div className="project-meta">
                    <span 
                      className="genre-badge"
                      style={{ 
                        backgroundColor: `${GENRES.find(g => g.value === project.genre)?.color}20`,
                        color: GENRES.find(g => g.value === project.genre)?.color 
                      }}
                    >
                      {GENRES.find(g => g.value === project.genre)?.label}
                    </span>
                    <span className="duration-badge">
                      <Clock size={12} />
                      {project.duration}分钟
                    </span>
                  </div>
                </div>
                <button
                  className="btn-icon btn-ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteProject(project.id)
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* 右侧编辑区域 */}
      <div className="editor-main">
        {currentProject ? (
          <>
            {/* 项目头部 */}
            <div className="editor-header">
              <div className="project-header-info">
                {/* 返回按钮 */}
                {onBack && (
                  <motion.button
                    className="btn-back"
                    onClick={onBack}
                    whileHover={{ x: -4 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ArrowLeft size={18} />
                    返回首页
                  </motion.button>
                )}
                <h1 className="project-header-title">{currentProject.title}</h1>
                <p className="project-header-desc">{currentProject.description}</p>
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
                <button 
                  className="btn-secondary"
                  onClick={handleExportScript}
                  disabled={!scriptContent}
                >
                  <Download size={16} />
                  导出
                </button>
                <button 
                  className="btn-primary"
                  onClick={handleSaveScript}
                >
                  <Save size={16} />
                  保存
                </button>
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
                  onClick={handleCreateProject}
                  disabled={!newProject.title.trim()}
                >
                  创建项目
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 样式 */}
      <style>{`
        .script-creation-page {
          display: flex;
          height: 100vh;
          background: var(--bg-primary);
        }

        .projects-sidebar {
          width: 280px;
          background: var(--bg-secondary);
          border-right: 1px solid var(--glass-border);
          display: flex;
          flex-direction: column;
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
          padding: var(--space-3);
          margin-bottom: var(--space-2);
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: var(--card-border-radius);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .project-card:hover,
        .project-card.active {
          background: rgba(10, 132, 255, 0.1);
          border-color: rgba(10, 132, 255, 0.3);
        }

        .project-info {
          flex: 1;
        }

        .project-title {
          font-size: var(--text-sm);
          font-weight: var(--font-medium);
          color: var(--text-primary);
          margin-bottom: var(--space-1);
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

        .editor-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .editor-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-4);
          border-bottom: 1px solid var(--glass-border);
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
          gap: var(--space-2);
          padding: var(--space-2) var(--space-4);
          border-bottom: 1px solid var(--glass-border);
        }

        .tab {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          padding: var(--space-2) var(--space-4);
          background: transparent;
          border: none;
          border-radius: 8px;
          color: var(--text-secondary);
          font-size: var(--text-sm);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tab.active {
          background: rgba(10, 132, 255, 0.1);
          color: var(--accent-blue);
        }

        .ai-generation-section {
          padding: var(--space-4);
          border-bottom: 1px solid var(--glass-border);
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

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .btn-back {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-3);
          margin-bottom: var(--space-3);
          background: transparent;
          border: 1px solid var(--glass-border);
          border-radius: 8px;
          color: var(--text-secondary);
          font-size: var(--text-sm);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-back:hover {
          background: var(--glass-bg);
          border-color: var(--accent-blue);
          color: var(--accent-blue);
        }
      `}</style>
    </div>
  )
}

// 模拟AI生成剧本
function generateMockScript(project: ScriptProject, prompt: string): string {
  return `${project.title}

类型：${GENRES.find(g => g.value === project.genre)?.label}
目标时长：${project.duration}分钟
目标受众：${project.targetAudience || '通用观众'}

=== 场景1：开头 ===

[画面描述]
镜头缓缓推进，展现主要场景。环境氛围${project.genre === 'horror' ? '阴森恐怖' : project.genre === 'romance' ? '浪漫温馨' : '引人入胜'}。

主角A：（独白）
${prompt}...

[画面描述]
镜头切换，展示配角B进入场景。

配角B：（对话）
你来了。我一直在等你。

主角A：（对话）
我知道。有些事情我们必须面对。

=== 场景2：发展 ===

[画面描述]
情节逐渐展开，冲突开始显现。

配角B：（对话）
但是这样做真的值得吗？

主角A：（对话）
有些事情不是为了值得，而是因为必须做。

[画面描述]
紧张的气氛中，主角做出重要决定。

=== 场景3：高潮 ===

[画面描述]
剧情达到顶点，所有矛盾集中爆发。

主角A：（独白）
这一刻，我终于明白了一切...

[画面描述]
关键转折点，主角面临最终选择。

=== 场景4：结局 ===

[画面描述]
故事走向尾声，留下余韵。

主角A：（对话）
这就是我们的故事。

配角B：（对话）
是的，而这只是开始。

[画面描述]
镜头拉远，故事结束。

=== 完 ===

（注：这是AI生成的初稿，请根据需要进行修改和完善）`
}
