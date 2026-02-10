/**
 * 成片输出页面 - Final Export
 * 简化时间线视图，导出到剪映
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Download,
  Film,
  Music,
  Play,
} from 'lucide-react'
import { GlassCard, GlowButton, StatusBadge } from '../components/ui'
import { mockExportProject } from '../data/mock'

export default function Export() {
  const [project, setProject] = useState(mockExportProject)
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [quality, setQuality] = useState('1080p')
  const [format, setFormat] = useState('jproj')

  const handleExport = () => {
    setIsExporting(true)
    setExportProgress(0)

    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsExporting(false)
          setProject(prev => ({ ...prev, status: 'completed' }))
          return 100
        }
        return prev + 5
      })
    }, 200)
  }

  const totalDuration = project.clips.reduce((acc, clip) => acc + clip.duration, 0)

  return (
    <div className="h-full flex flex-col">
      {/* 顶部信息 */}
      <div className="px-6 py-4 border-b border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">{project.name}</h1>
            <p className="text-sm text-[rgba(255,255,255,0.5)] mt-1">
              {project.clips.length} 个片段 · {Math.floor(totalDuration / 60)}:{String(totalDuration % 60).padStart(2, '0')} 总时长
            </p>
          </div>
          <StatusBadge
            status={project.status === 'ready' ? 'idle' : project.status === 'exporting' ? 'generating' : 'completed'}
            text={project.status === 'ready' ? '准备就绪' : project.status === 'exporting' ? '导出中' : '已完成'}
          />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* 左侧时间线 */}
        <div className="w-2/3 p-6 overflow-y-auto">
          {/* 视频轨道 */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Film size={18} className="text-[#0a84ff]" />
              <h3 className="font-medium text-white">视频轨道</h3>
            </div>
            <GlassCard className="relative overflow-hidden" padding="sm">
              {/* 时间刻度 */}
              <div className="flex gap-1 mb-2 px-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="flex-1 text-xs text-[rgba(255,255,255,0.3)]">
                    {i * 2}s
                  </div>
                ))}
              </div>

              {/* 片段 */}
              <div className="flex gap-1 h-16">
                {project.clips.map((clip, index) => (
                  <motion.div
                    key={clip.id}
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative rounded-lg overflow-hidden cursor-pointer group"
                    style={{
                      flex: clip.duration,
                      background: `linear-gradient(135deg, rgba(10, 132, 255, ${0.2 + index * 0.1}) 0%, rgba(191, 90, 242, ${0.2 + index * 0.1}) 100%)`,
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs text-white font-medium truncate px-2">
                        {clip.name}
                      </span>
                    </div>
                    {/* 悬停效果 */}
                    <div className="absolute inset-0 bg-[rgba(255,255,255,0.1)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* 音频轨道 */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Music size={18} className="text-[#bf5af2]" />
              <h3 className="font-medium text-white">音频轨道</h3>
            </div>
            <GlassCard className="relative overflow-hidden" padding="sm">
              <div className="flex gap-1 h-12">
                {project.audioTracks.map((track, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex-1 rounded-lg bg-[rgba(191,90,242,0.15)] border border-[rgba(191,90,242,0.3)]
                      flex items-center justify-center"
                  >
                    <span className="text-xs text-[#bf5af2] font-medium">{track}</span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* 预览播放器 */}
          <GlassCard className="aspect-video relative overflow-hidden" padding="none" glow="blue">
            <div className="w-full h-full bg-gradient-to-br from-[#1a1a24] to-[#0a0a0f]
              flex items-center justify-center">
              <Film size={64} className="text-[rgba(255,255,255,0.1)]" />
            </div>
            {/* 播放控制 */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[rgba(0,0,0,0.9)] to-transparent">
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full bg-[#0a84ff] flex items-center justify-center text-white"
                >
                  <Play size={18} className="ml-0.5" />
                </motion.button>
                <div className="flex-1 h-1 bg-[rgba(255,255,255,0.2)] rounded-full">
                  <div className="w-1/3 h-full bg-[#0a84ff] rounded-full" />
                </div>
                <span className="text-sm text-[rgba(255,255,255,0.5)]">0:05 / 0:15</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* 右侧导出设置 */}
        <div className="w-1/3 border-l border-[rgba(255,255,255,0.06)] p-6 overflow-y-auto">
          <h2 className="text-lg font-bold text-white mb-6">导出设置</h2>

          {/* 导出格式 */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-[rgba(255,255,255,0.7)] mb-3">导出格式</h3>
            <div className="space-y-2">
              {[
                { key: 'jproj', label: '剪映项目 (.jproj)', desc: '导入剪映继续编辑' },
                { key: 'mp4', label: '视频文件 (.mp4)', desc: '直接播放或分享' },
              ].map(({ key, label, desc }) => (
                <button
                  key={key}
                  onClick={() => setFormat(key)}
                  className={`w-full p-3 rounded-xl text-left transition-all ${
                    format === key
                      ? 'bg-[rgba(10,132,255,0.15)] border border-[rgba(10,132,255,0.3)]'
                      : 'bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.1)]'
                  }`}
                >
                  <div className="font-medium text-white">{label}</div>
                  <div className="text-xs text-[rgba(255,255,255,0.4)]">{desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 视频质量 */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-[rgba(255,255,255,0.7)] mb-3">视频质量</h3>
            <div className="grid grid-cols-3 gap-2">
              {['720p', '1080p', '4K'].map((q) => (
                <button
                  key={q}
                  onClick={() => setQuality(q)}
                  className={`p-3 rounded-xl text-center transition-all ${
                    quality === q
                      ? 'bg-[rgba(10,132,255,0.15)] border border-[rgba(10,132,255,0.3)] text-[#0a84ff]'
                      : 'bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.6)] hover:border-[rgba(255,255,255,0.1)]'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* 导出信息 */}
          <GlassCard className="mb-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[rgba(255,255,255,0.5)]">视频片段</span>
                <span className="text-white">{project.clips.length} 个</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[rgba(255,255,255,0.5)]">音频轨道</span>
                <span className="text-white">{project.audioTracks.length} 个</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[rgba(255,255,255,0.5)]">总时长</span>
                <span className="text-white">{Math.floor(totalDuration / 60)}:{String(totalDuration % 60).padStart(2, '0')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[rgba(255,255,255,0.5)]">预计大小</span>
                <span className="text-white">~{Math.round(totalDuration * 2)} MB</span>
              </div>
            </div>
          </GlassCard>

          {/* 导出按钮 */}
          <GlowButton
            variant="glow"
            size="lg"
            icon={isExporting ? undefined : <Download size={20} />}
            onClick={handleExport}
            loading={isExporting}
            fullWidth
          >
            {isExporting ? `导出中 ${exportProgress}%` : format === 'jproj' ? '导出到剪映' : '导出视频'}
          </GlowButton>

          {/* 导出进度 */}
          {isExporting && (
            <div className="mt-4">
              <div className="h-2 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#0a84ff] to-[#bf5af2]"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* 剪映提示 */}
          {format === 'jproj' && !isExporting && (
            <p className="mt-4 text-xs text-[rgba(255,255,255,0.4)] text-center">
              导出后可在剪映中继续编辑、添加特效和字幕
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
