/**
 * 音频生成页面 - Audio Studio
 * 分屏视图：上方TTS/配音，下方音乐
 */

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Mic,
  Music,
  Volume2,
  Play,
  Pause,
  Wand2,
  Download,
  Trash2,
  Clock,
  Type,
  Headphones,
  Waves,
} from 'lucide-react'
import { GlassCard, GlowButton, StatusBadge } from '../components/ui'
import { mockVoices, mockAudioTracks, VoiceOption, AudioTrack } from '../data/mock'

export default function Audio() {
  const [activeTab, setActiveTab] = useState<'tts' | 'music' | 'sfx'>('tts')
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption>(mockVoices[0])
  const [text, setText] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>(mockAudioTracks)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 模拟波形动画
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    const bars = 60
    const barWidth = canvas.width / bars

    const animate = () => {
      ctx.fillStyle = '#050505'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < bars; i++) {
        const height = isPlaying
          ? Math.random() * canvas.height * 0.8 + canvas.height * 0.1
          : canvas.height * 0.1

        const x = i * barWidth
        const y = (canvas.height - height) / 2

        // 渐变色
        const gradient = ctx.createLinearGradient(0, y, 0, y + height)
        gradient.addColorStop(0, 'rgba(10, 132, 255, 0)')
        gradient.addColorStop(0.5, 'rgba(10, 132, 255, 0.8)')
        gradient.addColorStop(1, 'rgba(191, 90, 242, 0)')

        ctx.fillStyle = gradient
        ctx.fillRect(x + 1, y, barWidth - 2, height)
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => cancelAnimationFrame(animationId)
  }, [isPlaying])

  const handleGenerate = () => {
    if (!text.trim()) return

    const newTrack: AudioTrack = {
      id: `audio-${Date.now()}`,
      name: `配音 - ${selectedVoice.name}`,
      type: 'tts',
      status: 'generating',
    }

    setAudioTracks([newTrack, ...audioTracks])

    setTimeout(() => {
      setAudioTracks(prev =>
        prev.map(t =>
          t.id === newTrack.id
            ? { ...t, status: 'completed', duration: Math.floor(text.length / 5) }
            : t
        )
      )
    }, 3000)

    setText('')
  }

  return (
    <div className="h-full flex flex-col">
      {/* 顶部标签切换 */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center gap-2 p-1 bg-[rgba(255,255,255,0.03)] rounded-xl">
          {[
            { key: 'tts', label: '语音合成', icon: Mic },
            { key: 'music', label: '背景音乐', icon: Music },
            { key: 'sfx', label: '音效', icon: Volume2 },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === key
                  ? 'bg-[rgba(10,132,255,0.2)] text-[#0a84ff]'
                  : 'text-[rgba(255,255,255,0.5)] hover:text-white'
              }`}
            >
              <Icon size={16} strokeWidth={1.5} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* 左侧控制面板 */}
        <div className="w-96 border-r border-[rgba(255,255,255,0.06)] p-6 overflow-y-auto">
          {activeTab === 'tts' && (
            <div className="space-y-6">
              {/* 声音选择 */}
              <div>
                <h3 className="text-sm font-medium text-[rgba(255,255,255,0.7)] mb-3 flex items-center gap-2">
                  <Headphones size={16} />
                  选择声音
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {mockVoices.map((voice) => (
                    <motion.button
                      key={voice.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedVoice(voice)}
                      className={`p-3 rounded-xl text-left transition-all ${
                        selectedVoice.id === voice.id
                          ? 'bg-[rgba(10,132,255,0.15)] border border-[rgba(10,132,255,0.3)]'
                          : 'bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.1)]'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2 h-2 rounded-full ${
                          voice.gender === 'male' ? 'bg-[#0a84ff]' : 'bg-[#ff375f]'
                        }`} />
                        <span className="font-medium text-white text-sm">{voice.name}</span>
                      </div>
                      <p className="text-xs text-[rgba(255,255,255,0.4)]">{voice.description}</p>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* 文本输入 */}
              <div>
                <h3 className="text-sm font-medium text-[rgba(255,255,255,0.7)] mb-3 flex items-center gap-2">
                  <Type size={16} />
                  输入文本
                </h3>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="输入要转换为语音的文本..."
                  className="w-full h-40 p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]
                    text-white placeholder-[rgba(255,255,255,0.3)] resize-none outline-none
                    focus:border-[rgba(10,132,255,0.4)] focus:bg-[rgba(10,132,255,0.05)] transition-all"
                />
                <p className="text-xs text-[rgba(255,255,255,0.4)] mt-2 text-right">
                  {text.length} 字符
                </p>
              </div>

              {/* 生成按钮 */}
              <GlowButton
                variant="glow"
                size="lg"
                icon={<Wand2 size={18} />}
                onClick={handleGenerate}
                disabled={!text.trim()}
                fullWidth
              >
                生成配音
              </GlowButton>
            </div>
          )}

          {activeTab === 'music' && (
            <div className="space-y-6">
              <GlassCard>
                <div className="text-center py-8">
                  <Music size={48} className="mx-auto mb-4 text-[rgba(255,255,255,0.2)]" />
                  <p className="text-[rgba(255,255,255,0.5)]">AI音乐生成功能即将上线</p>
                </div>
              </GlassCard>
            </div>
          )}

          {activeTab === 'sfx' && (
            <div className="space-y-6">
              <GlassCard>
                <div className="text-center py-8">
                  <Volume2 size={48} className="mx-auto mb-4 text-[rgba(255,255,255,0.2)]" />
                  <p className="text-[rgba(255,255,255,0.5)]">AI音效生成功能即将上线</p>
                </div>
              </GlassCard>
            </div>
          )}
        </div>

        {/* 右侧预览区 */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* 波形可视化 */}
          <GlassCard className="mb-6" glow="blue">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Waves size={18} className="text-[#0a84ff]" />
                音频预览
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[rgba(255,255,255,0.5)]">
                  {selectedVoice.name}
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 rounded-full bg-[#0a84ff] flex items-center justify-center text-white"
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                </motion.button>
              </div>
            </div>
            <canvas
              ref={canvasRef}
              width={600}
              height={120}
              className="w-full h-32 rounded-xl bg-[#050505]"
            />
          </GlassCard>

          {/* 音频轨道列表 */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">音频轨道</h3>
            <div className="space-y-3">
              {audioTracks.map((track, index) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <GlassCard className="flex items-center gap-4" padding="sm">
                    {/* 图标 */}
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      track.type === 'tts'
                        ? 'bg-[rgba(10,132,255,0.15)] text-[#0a84ff]'
                        : track.type === 'music'
                        ? 'bg-[rgba(191,90,242,0.15)] text-[#bf5af2]'
                        : 'bg-[rgba(48,209,88,0.15)] text-[#30d158]'
                    }`}>
                      {track.type === 'tts' ? <Mic size={18} /> : track.type === 'music' ? <Music size={18} /> : <Volume2 size={18} />}
                    </div>

                    {/* 信息 */}
                    <div className="flex-1">
                      <p className="font-medium text-white">{track.name}</p>
                      <div className="flex items-center gap-3 text-xs text-[rgba(255,255,255,0.4)]">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {track.duration ? `${track.duration}s` : '--'}
                        </span>
                        <span className="capitalize">{track.type}</span>
                      </div>
                    </div>

                    {/* 状态 */}
                    <StatusBadge
                      status={track.status === 'pending' ? 'idle' : track.status === 'generating' ? 'generating' : 'completed'}
                    />

                    {/* 操作 */}
                    <div className="flex items-center gap-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-lg text-[rgba(255,255,255,0.4)] hover:text-white hover:bg-[rgba(255,255,255,0.1)]"
                      >
                        <Download size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-lg text-[rgba(255,255,255,0.4)] hover:text-[#ff453a] hover:bg-[rgba(255,69,58,0.1)]"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
