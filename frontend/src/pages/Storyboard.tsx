/**
 * 分镜制作页面 - Storyboard Workspace
 * 瀑布流/网格布局展示分镜卡片
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Grid3X3,
  List,
  Plus,
  RefreshCw,
  Edit3,
  Clock,
  Camera,
  Wand2,
  ChevronDown,
  Image,
  Sparkles,
} from 'lucide-react'
import { GlassCard, GlowButton, StatusBadge } from '../components/ui'
import { mockStoryboards, StoryboardScene } from '../data/mock'

type ViewMode = 'grid' | 'list'

export default function Storyboard() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [scenes, setScenes] = useState<StoryboardScene[]>(mockStoryboards)
  const [expandedScene, setExpandedScene] = useState<string | null>('scene-1')

  const handleGenerateAll = () => {
    // 模拟生成所有待处理的分镜
    setScenes(prev => prev.map(scene => ({
      ...scene,
      shots: scene.shots.map(shot =>
        shot.status === 'pending' ? { ...shot, status: 'generating' as const } : shot
      )
    })))

    // 模拟生成完成
    setTimeout(() => {
      setScenes(prev => prev.map(scene => ({
        ...scene,
        shots: scene.shots.map(shot =>
          shot.status === 'generating' ? { ...shot, status: 'completed' as const } : shot
        )
      })))
    }, 3000)
  }

  const handleRegenerateShot = (sceneId: string, shotId: string) => {
    setScenes(prev => prev.map(scene =>
      scene.id === sceneId
        ? {
            ...scene,
            shots: scene.shots.map(shot =>
              shot.id === shotId ? { ...shot, status: 'generating' as const } : shot
            )
          }
        : scene
    ))

    setTimeout(() => {
      setScenes(prev => prev.map(scene =>
        scene.id === sceneId
          ? {
              ...scene,
              shots: scene.shots.map(shot =>
                shot.id === shotId ? { ...shot, status: 'completed' as const } : shot
              )
            }
          : scene
      ))
    }, 2000)
  }

  return (
    <div className="h-full flex flex-col">
      {/* 顶部工具栏 */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white">分镜制作</h1>
          <span className="text-sm text-[rgba(255,255,255,0.5)]">
            {scenes.reduce((acc, s) => acc + s.shots.length, 0)} 个镜头 · {scenes.length} 个场景
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* 视图切换 */}
          <div className="flex items-center gap-1 p-1 bg-[rgba(255,255,255,0.03)] rounded-xl border border-[rgba(255,255,255,0.06)]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-[rgba(10,132,255,0.2)] text-[#0a84ff]'
                  : 'text-[rgba(255,255,255,0.5)] hover:text-white'
              }`}
            >
              <Grid3X3 size={18} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-[rgba(10,132,255,0.2)] text-[#0a84ff]'
                  : 'text-[rgba(255,255,255,0.5)] hover:text-white'
              }`}
            >
              <List size={18} strokeWidth={1.5} />
            </button>
          </div>

          <GlowButton
            variant="glow"
            size="md"
            icon={<Wand2 size={18} />}
            onClick={handleGenerateAll}
          >
            生成所有分镜
          </GlowButton>
        </div>
      </div>

      {/* 场景列表 */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {scenes.map((scene, sceneIndex) => (
          <motion.div
            key={scene.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sceneIndex * 0.1 }}
          >
            {/* 场景标题 */}
            <button
              onClick={() => setExpandedScene(expandedScene === scene.id ? null : scene.id)}
              className="flex items-center gap-3 mb-4 group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#bf5af2] to-[#0a84ff] 
                flex items-center justify-center text-white font-bold text-sm">
                {scene.sceneNumber}
              </div>
              <h2 className="text-lg font-semibold text-white group-hover:text-[#0a84ff] transition-colors">
                {scene.title}
              </h2>
              <ChevronDown
                size={18}
                className={`text-[rgba(255,255,255,0.4)] transition-transform ${
                  expandedScene === scene.id ? 'rotate-180' : ''
                }`}
              />
              <span className="text-sm text-[rgba(255,255,255,0.4)]">
                {scene.shots.length} 镜头
              </span>
            </button>

            {/* 分镜网格 */}
            <AnimatePresence>
              {expandedScene === scene.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                    : 'space-y-3'
                  }
                >
                  {scene.shots.map((shot, shotIndex) => (
                    <ShotCard
                      key={shot.id}
                      shot={shot}
                      viewMode={viewMode}
                      onRegenerate={() => handleRegenerateShot(scene.id, shot.id)}
                      index={shotIndex}
                    />
                  ))}

                  {/* 添加镜头按钮 */}
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`border-2 border-dashed border-[rgba(255,255,255,0.1)] rounded-2xl
                      flex flex-col items-center justify-center gap-3
                      text-[rgba(255,255,255,0.4)] hover:text-[#0a84ff] hover:border-[#0a84ff]
                      transition-all duration-200
                      ${viewMode === 'grid' ? 'aspect-[4/3]' : 'h-20 flex-row'}`}
                  >
                    <Plus size={24} />
                    <span className="text-sm font-medium">添加镜头</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// 分镜卡片组件
interface ShotCardProps {
  shot: {
    id: string
    shotNumber: string
    description: string
    prompt: string
    status: 'pending' | 'generating' | 'completed' | 'error'
    duration: number
    cameraMovement?: string
  }
  viewMode: ViewMode
  onRegenerate: () => void
  index: number
}

function ShotCard({ shot, viewMode, onRegenerate, index }: ShotCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <GlassCard
          className="flex items-center gap-4"
          padding="sm"
          hover
        >
          {/* 镜头编号 */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0a84ff] to-[#bf5af2] 
            flex items-center justify-center text-white font-bold">
            {shot.shotNumber}
          </div>

          {/* 信息 */}
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium truncate">{shot.description}</p>
            <p className="text-sm text-[rgba(255,255,255,0.4)] truncate">{shot.prompt}</p>
          </div>

          {/* 元数据 */}
          <div className="flex items-center gap-4 text-sm text-[rgba(255,255,255,0.5)]">
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {shot.duration}s
            </span>
            {shot.cameraMovement && (
              <span className="flex items-center gap-1">
                <Camera size={14} />
                {shot.cameraMovement}
              </span>
            )}
          </div>

          {/* 状态 */}
          <StatusBadge
            status={shot.status === 'pending' ? 'idle' : shot.status === 'generating' ? 'generating' : 'completed'}
          />

          {/* 操作按钮 */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onRegenerate}
              className="p-2 rounded-lg text-[rgba(255,255,255,0.4)] hover:text-[#0a84ff] hover:bg-[rgba(10,132,255,0.1)]"
            >
              <RefreshCw size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg text-[rgba(255,255,255,0.4)] hover:text-white hover:bg-[rgba(255,255,255,0.1)]"
            >
              <Edit3 size={16} />
            </motion.button>
          </div>
        </GlassCard>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <GlassCard className="aspect-[4/3] relative group" padding="none" hover={false}>
        {/* 图片/占位区域 */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a24] to-[#0a0a0f] rounded-2xl overflow-hidden">
          {shot.status === 'completed' ? (
            <div className="w-full h-full flex items-center justify-center">
              <Image size={48} className="text-[rgba(255,255,255,0.1)]" />
              {/* 模拟图片 */}
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(10,132,255,0.1)] to-[rgba(191,90,242,0.1)]" />
            </div>
          ) : shot.status === 'generating' ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-2 border-[rgba(10,132,255,0.3)] border-t-[#0a84ff] rounded-full animate-spin" />
              <span className="text-sm text-[rgba(255,255,255,0.5)]">生成中...</span>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3">
              <Sparkles size={32} className="text-[rgba(255,255,255,0.2)]" />
              <span className="text-sm text-[rgba(255,255,255,0.3)]">待生成</span>
            </div>
          )}

          {/* 悬停遮罩 */}
          <AnimatePresence>
            {isHovered && shot.status === 'completed' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[rgba(0,0,0,0.7)] backdrop-blur-sm
                  flex items-center justify-center gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onRegenerate}
                  className="p-3 rounded-xl bg-[rgba(255,255,255,0.1)] text-white hover:bg-[#0a84ff]"
                >
                  <RefreshCw size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 rounded-xl bg-[rgba(255,255,255,0.1)] text-white hover:bg-[rgba(255,255,255,0.2)]"
                >
                  <Edit3 size={20} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 信息覆盖层 */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[rgba(0,0,0,0.9)] to-transparent">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-bold">Shot {shot.shotNumber}</span>
            <StatusBadge
              status={shot.status === 'pending' ? 'idle' : shot.status === 'generating' ? 'generating' : 'completed'}
              pulse={shot.status === 'generating'}
            />
          </div>
          <p className="text-sm text-[rgba(255,255,255,0.7)] line-clamp-2">{shot.description}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-[rgba(255,255,255,0.5)]">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {shot.duration}s
            </span>
            {shot.cameraMovement && (
              <span className="flex items-center gap-1">
                <Camera size={12} />
                {shot.cameraMovement}
              </span>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}
