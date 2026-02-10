/**
 * 视频生成页面 - Video Generation
 * Kanban/列表视图显示生成任务
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Video,
  Play,
  Sliders,
  Camera,
  Wand2,
  Download,
  RefreshCw,
  Clock,
  Film,
  ChevronDown,
} from 'lucide-react'
import { GlassCard, GlowButton, StatusBadge } from '../components/ui'
import { mockVideoClips, VideoClip } from '../data/mock'

export default function VideoGeneration() {
  const [clips, setClips] = useState<VideoClip[]>(mockVideoClips)
  const [selectedClip, setSelectedClip] = useState<VideoClip | null>(null)
  const [motionStrength, setMotionStrength] = useState(0.7)
  const [cameraMovement, setCameraMovement] = useState('推近')

  const handleGenerate = (clipId: string) => {
    setClips(prev =>
      prev.map(c =>
        c.id === clipId ? { ...c, status: 'generating' as const, progress: 0 } : c
      )
    )

    // 模拟进度更新
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setClips(prev =>
        prev.map(c =>
          c.id === clipId ? { ...c, progress } : c
        )
      )

      if (progress >= 100) {
        clearInterval(interval)
        setClips(prev =>
          prev.map(c =>
            c.id === clipId ? { ...c, status: 'completed' as const } : c
          )
        )
      }
    }, 500)
  }

  const handleGenerateAll = () => {
    const pendingClips = clips.filter(c => c.status === 'idle' || c.status === 'queued')
    pendingClips.forEach((clip, index) => {
      setTimeout(() => handleGenerate(clip.id), index * 1000)
    })
  }

  return (
    <div className="h-full flex">
      {/* 左侧视频列表 */}
      <div className="w-96 border-r border-[rgba(255,255,255,0.06)] flex flex-col">
        <div className="p-4 border-b border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">视频片段</h2>
            <span className="text-sm text-[rgba(255,255,255,0.4)]">
              {clips.filter(c => c.status === 'completed').length}/{clips.length}
            </span>
          </div>
          <GlowButton
            variant="glow"
            size="sm"
            icon={<Wand2 size={16} />}
            onClick={handleGenerateAll}
            fullWidth
          >
            生成所有视频
          </GlowButton>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {clips.map((clip, index) => (
            <motion.button
              key={clip.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedClip(clip)}
              className={`w-full text-left p-3 rounded-xl transition-all ${
                selectedClip?.id === clip.id
                  ? 'bg-[rgba(10,132,255,0.15)] border border-[rgba(10,132,255,0.3)]'
                  : 'hover:bg-[rgba(255,255,255,0.05)] border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* 缩略图 */}
                <div className="w-16 h-12 rounded-lg bg-gradient-to-br from-[#1a1a24] to-[#0a0a0f]
                  border border-[rgba(255,255,255,0.1)] flex items-center justify-center flex-shrink-0">
                  {clip.status === 'completed' ? (
                    <Film size={16} className="text-[rgba(255,255,255,0.3)]" />
                  ) : clip.status === 'generating' ? (
                    <div className="w-4 h-4 border-2 border-[rgba(10,132,255,0.3)] border-t-[#0a84ff] rounded-full animate-spin" />
                  ) : (
                    <Video size={16} className="text-[rgba(255,255,255,0.2)]" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm truncate">{clip.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge
                      status={
                        clip.status === 'idle' ? 'idle' :
                        clip.status === 'queued' ? 'pending' :
                        clip.status === 'generating' ? 'generating' :
                        'completed'
                      }
                      pulse={clip.status === 'generating'}
                    />
                    <span className="text-xs text-[rgba(255,255,255,0.4)] flex items-center gap-1">
                      <Clock size={10} />
                      {clip.duration}s
                    </span>
                  </div>
                </div>
              </div>

              {/* 进度条 */}
              {clip.status === 'generating' && (
                <div className="mt-3">
                  <div className="h-1 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#0a84ff] to-[#bf5af2]"
                      initial={{ width: 0 }}
                      animate={{ width: `${clip.progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p className="text-xs text-[rgba(255,255,255,0.4)] mt-1 text-right">
                    {clip.progress}%
                  </p>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* 右侧预览和参数区 */}
      <div className="flex-1 overflow-y-auto p-6">
        {selectedClip ? (
          <div className="space-y-6">
            {/* 视频播放器 */}
            <GlassCard className="aspect-video relative overflow-hidden" padding="none">
              {selectedClip.status === 'completed' ? (
                <div className="w-full h-full bg-gradient-to-br from-[#1a1a24] to-[#0a0a0f]
                  flex items-center justify-center">
                  <Film size={64} className="text-[rgba(255,255,255,0.1)]" />
                  <div className="absolute inset-0 bg-gradient-to-br from-[rgba(10,132,255,0.05)] to-[rgba(191,90,242,0.05)]" />

                  {/* 播放按钮 */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute w-16 h-16 rounded-full bg-[#0a84ff] flex items-center justify-center text-white"
                    style={{ boxShadow: '0 0 30px rgba(10, 132, 255, 0.5)' }}
                  >
                    <Play size={28} className="ml-1" />
                  </motion.button>
                </div>
              ) : selectedClip.status === 'generating' ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                  <div className="w-12 h-12 border-3 border-[rgba(10,132,255,0.3)] border-t-[#0a84ff] rounded-full animate-spin" />
                  <p className="text-[rgba(255,255,255,0.5)]">视频生成中...</p>
                  <div className="w-64 h-2 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#0a84ff] to-[#bf5af2]"
                      style={{ width: `${selectedClip.progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-[#0a84ff]">{selectedClip.progress}%</p>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                  <Video size={48} className="text-[rgba(255,255,255,0.2)]" />
                  <p className="text-[rgba(255,255,255,0.4)]">等待生成</p>
                  <GlowButton
                    variant="primary"
                    size="sm"
                    icon={<Wand2 size={16} />}
                    onClick={() => handleGenerate(selectedClip.id)}
                  >
                    开始生成
                  </GlowButton>
                </div>
              )}

              {/* 视频信息覆盖层 */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[rgba(0,0,0,0.9)] to-transparent">
                <h3 className="font-semibold text-white">{selectedClip.name}</h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-[rgba(255,255,255,0.5)]">
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {selectedClip.duration}秒
                  </span>
                  <span className="flex items-center gap-1">
                    <Camera size={14} />
                    {selectedClip.params.cameraMovement}
                  </span>
                </div>
              </div>
            </GlassCard>

            {/* 参数控制面板 */}
            <div className="grid grid-cols-2 gap-6">
              {/* 运动强度 */}
              <GlassCard>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sliders size={18} className="text-[#0a84ff]" />
                    <h3 className="font-medium text-white">运动强度</h3>
                  </div>
                  <span className="text-sm text-[#0a84ff] font-medium">
                    {Math.round(motionStrength * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={motionStrength}
                  onChange={(e) => setMotionStrength(parseFloat(e.target.value))}
                  className="w-full h-2 bg-[rgba(255,255,255,0.1)] rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#0a84ff]
                    [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(10,132,255,0.5)]"
                />
                <div className="flex justify-between mt-2 text-xs text-[rgba(255,255,255,0.4)]">
                  <span>静态</span>
                  <span>动态</span>
                </div>
              </GlassCard>

              {/* 镜头运动 */}
              <GlassCard>
                <div className="flex items-center gap-2 mb-4">
                  <Camera size={18} className="text-[#bf5af2]" />
                  <h3 className="font-medium text-white">镜头运动</h3>
                </div>
                <div className="relative">
                  <select
                    value={cameraMovement}
                    onChange={(e) => setCameraMovement(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)]
                      text-white appearance-none cursor-pointer outline-none focus:border-[rgba(191,90,242,0.4)]"
                  >
                    {['固定', '推近', '拉远', '环绕', '跟随', '仰拍', '俯拍', '平移'].map((opt) => (
                      <option key={opt} value={opt} className="bg-[#1a1a24]">
                        {opt}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.4)] pointer-events-none" />
                </div>
              </GlassCard>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3">
              <GlowButton
                variant="secondary"
                size="md"
                icon={<RefreshCw size={16} />}
                onClick={() => handleGenerate(selectedClip.id)}
                disabled={selectedClip.status === 'generating'}
              >
                重新生成
              </GlowButton>
              <GlowButton
                variant="secondary"
                size="md"
                icon={<Download size={16} />}
                disabled={selectedClip.status !== 'completed'}
              >
                下载视频
              </GlowButton>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]
                flex items-center justify-center mx-auto mb-4">
                <Video size={40} className="text-[rgba(255,255,255,0.2)]" />
              </div>
              <p className="text-[rgba(255,255,255,0.5)]">选择一个视频片段查看详情</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
