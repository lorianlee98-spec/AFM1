/**
 * 角色设计页面 - Character Lab
 * 角色画廊视图，支持一致性设置
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  User,
  Wand2,
  Edit3,
  Check,
  Palette,
  Shirt,
  Sparkles,
  Eye,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react'
import { GlassCard, GlowButton } from '../components/ui'
import { mockCharacters, Character } from '../data/mock'

export default function CharacterDesign() {
  const [characters] = useState<Character[]>(mockCharacters)
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const [consistencyEnabled, setConsistencyEnabled] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateAvatar = (_charId: string) => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <div className="h-full flex">
      {/* 左侧角色列表 */}
      <div className="w-80 border-r border-[rgba(255,255,255,0.06)] flex flex-col">
        <div className="p-4 border-b border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">角色列表</h2>
            <span className="text-sm text-[rgba(255,255,255,0.4)]">{characters.length} 个角色</span>
          </div>
          <GlowButton variant="secondary" size="sm" icon={<Plus size={16} />} fullWidth>
            添加角色
          </GlowButton>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {characters.map((char, index) => (
            <motion.button
              key={char.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedCharacter(char)}
              className={`w-full text-left p-3 rounded-xl transition-all ${
                selectedCharacter?.id === char.id
                  ? 'bg-[rgba(10,132,255,0.15)] border border-[rgba(10,132,255,0.3)]'
                  : 'hover:bg-[rgba(255,255,255,0.05)] border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1a1a24] to-[#0a0a0f] 
                  border border-[rgba(255,255,255,0.1)] flex items-center justify-center">
                  <User size={24} className="text-[rgba(255,255,255,0.3)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{char.name}</p>
                  <p className="text-xs text-[rgba(255,255,255,0.4)] truncate">{char.description}</p>
                </div>
              </div>
              <div className="flex gap-1 mt-2">
                {char.tags.slice(0, 2).map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 text-xs rounded-full bg-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.6)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.button>
          ))}

          {/* 添加角色卡片 */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full p-6 rounded-xl border-2 border-dashed border-[rgba(255,255,255,0.1)]
              flex flex-col items-center gap-3 text-[rgba(255,255,255,0.4)]
              hover:text-[#0a84ff] hover:border-[#0a84ff] transition-all"
          >
            <Plus size={32} />
            <span className="text-sm font-medium">创建新角色</span>
          </motion.button>
        </div>
      </div>

      {/* 右侧详情区 */}
      <div className="flex-1 overflow-y-auto">
        {selectedCharacter ? (
          <div className="p-6 space-y-6">
            {/* 头部信息 */}
            <div className="flex items-start gap-6">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#1a1a24] to-[#0a0a0f]
                  border border-[rgba(255,255,255,0.1)] flex items-center justify-center relative overflow-hidden"
              >
                <User size={48} className="text-[rgba(255,255,255,0.2)]" />
                <div className="absolute inset-0 bg-gradient-to-br from-[rgba(10,132,255,0.1)] to-[rgba(191,90,242,0.1)]" />
              </motion.div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-white">{selectedCharacter.name}</h1>
                  <div className="flex gap-2">
                    {selectedCharacter.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs rounded-lg bg-[rgba(191,90,242,0.15)] text-[#bf5af2] border border-[rgba(191,90,242,0.3)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-[rgba(255,255,255,0.6)] mb-4">{selectedCharacter.description}</p>

                <div className="flex gap-3">
                  <GlowButton
                    variant="glow"
                    size="sm"
                    icon={isGenerating ? undefined : <Wand2 size={16} />}
                    onClick={() => handleGenerateAvatar(selectedCharacter.id)}
                    loading={isGenerating}
                  >
                    {isGenerating ? '生成中...' : '生成形象'}
                  </GlowButton>
                  <GlowButton variant="secondary" size="sm" icon={<Edit3 size={16} />}>
                    编辑信息
                  </GlowButton>
                </div>
              </div>
            </div>

            {/* 一致性设置开关 */}
            <GlassCard glow="purple">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[rgba(191,90,242,0.15)] flex items-center justify-center">
                    <Check size={20} className="text-[#bf5af2]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">跨场景一致性</h3>
                    <p className="text-sm text-[rgba(255,255,255,0.5)]">确保角色在所有场景中保持一致的外观</p>
                  </div>
                </div>
                <motion.button
                  onClick={() => setConsistencyEnabled(!consistencyEnabled)}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  {consistencyEnabled ? (
                    <ToggleRight size={48} className="text-[#30d158]" />
                  ) : (
                    <ToggleLeft size={48} className="text-[rgba(255,255,255,0.3)]" />
                  )}
                </motion.button>
              </div>
            </GlassCard>

            {/* 一致性设置详情 */}
            <div className="grid grid-cols-2 gap-4">
              <GlassCard>
                <div className="flex items-center gap-3 mb-3">
                  <Shirt size={18} className="text-[#0a84ff]" />
                  <h3 className="font-medium text-white">服装</h3>
                </div>
                <p className="text-sm text-[rgba(255,255,255,0.6)]">{selectedCharacter.consistencySettings.outfit}</p>
              </GlassCard>

              <GlassCard>
                <div className="flex items-center gap-3 mb-3">
                  <Sparkles size={18} className="text-[#bf5af2]" />
                  <h3 className="font-medium text-white">发型</h3>
                </div>
                <p className="text-sm text-[rgba(255,255,255,0.6)]">{selectedCharacter.consistencySettings.hairstyle}</p>
              </GlassCard>

              <GlassCard>
                <div className="flex items-center gap-3 mb-3">
                  <Eye size={18} className="text-[#ff9f0a]" />
                  <h3 className="font-medium text-white">面部特征</h3>
                </div>
                <p className="text-sm text-[rgba(255,255,255,0.6)]">{selectedCharacter.consistencySettings.facialFeatures}</p>
              </GlassCard>

              <GlassCard>
                <div className="flex items-center gap-3 mb-3">
                  <Palette size={18} className="text-[#30d158]" />
                  <h3 className="font-medium text-white">配色方案</h3>
                </div>
                <p className="text-sm text-[rgba(255,255,255,0.6)]">{selectedCharacter.consistencySettings.colorPalette}</p>
              </GlassCard>
            </div>

            {/* 角色变体预览 */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">形象变体</h3>
              <div className="grid grid-cols-4 gap-4">
                {['正面', '侧面', '表情1', '表情2'].map((pose, i) => (
                  <motion.div
                    key={pose}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="aspect-square rounded-xl bg-gradient-to-br from-[#1a1a24] to-[#0a0a0f]
                      border border-[rgba(255,255,255,0.08)] flex flex-col items-center justify-center gap-2
                      hover:border-[rgba(255,255,255,0.15)] transition-colors cursor-pointer group"
                  >
                    <User size={32} className="text-[rgba(255,255,255,0.2)] group-hover:text-[rgba(255,255,255,0.4)] transition-colors" />
                    <span className="text-xs text-[rgba(255,255,255,0.4)]">{pose}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]
                flex items-center justify-center mx-auto mb-4">
                <User size={40} className="text-[rgba(255,255,255,0.2)]" />
              </div>
              <p className="text-[rgba(255,255,255,0.5)]">选择一个角色查看详情</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
