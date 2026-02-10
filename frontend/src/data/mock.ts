/**
 * Mock Data - 用于UI展示和测试的模拟数据
 */

// ==================== 分镜数据 ====================

export interface StoryboardShot {
  id: string
  shotNumber: string
  description: string
  prompt: string
  imageUrl?: string
  status: 'pending' | 'generating' | 'completed' | 'error'
  duration: number
  cameraMovement?: string
}

export interface StoryboardScene {
  id: string
  sceneNumber: number
  title: string
  shots: StoryboardShot[]
}

export const mockStoryboards: StoryboardScene[] = [
  {
    id: 'scene-1',
    sceneNumber: 1,
    title: '开场 - 城市夜景',
    shots: [
      {
        id: 'shot-1a',
        shotNumber: '1A',
        description: '航拍城市全景，霓虹灯光闪烁',
        prompt: 'Aerial view of cyberpunk city at night, neon lights, rain, cinematic, 8k',
        status: 'completed',
        duration: 5,
        cameraMovement: '推近',
      },
      {
        id: 'shot-1b',
        shotNumber: '1B',
        description: '主角站在天台，背对镜头',
        prompt: 'Protagonist standing on rooftop, back to camera, cyberpunk city background, moody lighting',
        status: 'completed',
        duration: 3,
        cameraMovement: '环绕',
      },
      {
        id: 'shot-1c',
        shotNumber: '1C',
        description: '特写：主角的眼神坚定',
        prompt: 'Close-up of protagonist face, determined expression, neon reflection in eyes, cinematic',
        status: 'generating',
        duration: 2,
        cameraMovement: '固定',
      },
    ],
  },
  {
    id: 'scene-2',
    sceneNumber: 2,
    title: '追逐戏',
    shots: [
      {
        id: 'shot-2a',
        shotNumber: '2A',
        description: '巷子里快速奔跑的脚步',
        prompt: 'Running feet in dark alley, wet ground reflection, motion blur, action shot',
        status: 'completed',
        duration: 2,
        cameraMovement: '跟随',
      },
      {
        id: 'shot-2b',
        shotNumber: '2B',
        description: '翻越围墙',
        prompt: 'Parkour over wall, night scene, dynamic angle, athletic movement',
        status: 'pending',
        duration: 3,
        cameraMovement: '仰拍',
      },
    ],
  },
  {
    id: 'scene-3',
    sceneNumber: 3,
    title: '对话场景',
    shots: [
      {
        id: 'shot-3a',
        shotNumber: '3A',
        description: '两人对坐，气氛紧张',
        prompt: 'Two characters sitting across table, tense atmosphere, dim lighting, dramatic shadows',
        status: 'pending',
        duration: 8,
        cameraMovement: '正反打',
      },
    ],
  },
]

// ==================== 角色数据 ====================

export interface Character {
  id: string
  name: string
  description: string
  avatar?: string
  tags: string[]
  consistencySettings: {
    outfit: string
    hairstyle: string
    facialFeatures: string
    colorPalette: string
  }
}

export const mockCharacters: Character[] = [
  {
    id: 'char-1',
    name: '林墨',
    description: '主角，年轻的网络安全专家，性格冷静内敛',
    tags: ['主角', '赛博朋克', '黑客'],
    consistencySettings: {
      outfit: '黑色战术外套，发光线条装饰',
      hairstyle: '短发，深色',
      facialFeatures: '锐利眼神，坚毅面容',
      colorPalette: '深蓝、黑色、霓虹蓝',
    },
  },
  {
    id: 'char-2',
    name: '艾琳',
    description: '神秘的女特工，身手敏捷，来历不明',
    tags: ['女特工', '动作', '神秘'],
    consistencySettings: {
      outfit: '紧身战斗服，红色装饰',
      hairstyle: '长发马尾，红色挑染',
      facialFeatures: '冷艳面容，锐利眼神',
      colorPalette: '红色、黑色、银色',
    },
  },
  {
    id: 'char-3',
    name: '老陈',
    description: '资深黑客导师，林墨的引路人',
    tags: ['导师', '黑客', '智慧'],
    consistencySettings: {
      outfit: '休闲夹克，眼镜',
      hairstyle: '灰白短发',
      facialFeatures: '慈祥面容，智慧眼神',
      colorPalette: '灰色、棕色、暖色',
    },
  },
]

// ==================== 音频数据 ====================

export interface VoiceOption {
  id: string
  name: string
  gender: 'male' | 'female'
  style: string
  description: string
  previewUrl?: string
}

export interface AudioTrack {
  id: string
  name: string
  type: 'tts' | 'music' | 'sfx'
  status: 'idle' | 'generating' | 'completed' | 'error' | 'pending'
  duration?: number
  url?: string
}

export const mockVoices: VoiceOption[] = [
  { id: 'voice-1', name: '深沉男声', gender: 'male', style: '沉稳', description: '适合旁白和解说' },
  { id: 'voice-2', name: '清亮女声', gender: 'female', style: '活泼', description: '适合年轻角色' },
  { id: 'voice-3', name: '磁性男声', gender: 'male', style: '磁性', description: '适合主角配音' },
  { id: 'voice-4', name: '温柔女声', gender: 'female', style: '温柔', description: '适合情感场景' },
  { id: 'voice-5', name: '老者声音', gender: 'male', style: '沧桑', description: '适合长者角色' },
  { id: 'voice-6', name: '少女声音', gender: 'female', style: '甜美', description: '适合可爱角色' },
]

export const mockAudioTracks: AudioTrack[] = [
  { id: 'audio-1', name: '开场旁白', type: 'tts', status: 'completed', duration: 45 },
  { id: 'audio-2', name: '追逐背景音乐', type: 'music', status: 'completed', duration: 120 },
  { id: 'audio-3', name: '雨声环境音', type: 'sfx', status: 'generating', duration: 60 },
  { id: 'audio-4', name: '对话配音 - 林墨', type: 'tts', status: 'pending' },
  { id: 'audio-5', name: '对话配音 - 艾琳', type: 'tts', status: 'pending' },
]

// ==================== 视频数据 ====================

export interface VideoClip {
  id: string
  name: string
  shotId: string
  status: 'idle' | 'queued' | 'generating' | 'completed' | 'error'
  progress: number
  thumbnail?: string
  duration: number
  params: {
    motionStrength: number
    cameraMovement: string
    style: string
  }
}

export const mockVideoClips: VideoClip[] = [
  {
    id: 'clip-1',
    name: 'Shot 1A - 城市全景',
    shotId: 'shot-1a',
    status: 'completed',
    progress: 100,
    duration: 5,
    params: {
      motionStrength: 0.7,
      cameraMovement: '推近',
      style: '赛博朋克',
    },
  },
  {
    id: 'clip-2',
    name: 'Shot 1B - 天台场景',
    shotId: 'shot-1b',
    status: 'completed',
    progress: 100,
    duration: 3,
    params: {
      motionStrength: 0.5,
      cameraMovement: '环绕',
      style: '赛博朋克',
    },
  },
  {
    id: 'clip-3',
    name: 'Shot 1C - 特写',
    shotId: 'shot-1c',
    status: 'generating',
    progress: 65,
    duration: 2,
    params: {
      motionStrength: 0.3,
      cameraMovement: '固定',
      style: '赛博朋克',
    },
  },
  {
    id: 'clip-4',
    name: 'Shot 2A - 奔跑',
    shotId: 'shot-2a',
    status: 'queued',
    progress: 0,
    duration: 2,
    params: {
      motionStrength: 0.8,
      cameraMovement: '跟随',
      style: '赛博朋克',
    },
  },
  {
    id: 'clip-5',
    name: 'Shot 2B - 翻越',
    shotId: 'shot-2b',
    status: 'idle',
    progress: 0,
    duration: 3,
    params: {
      motionStrength: 0.9,
      cameraMovement: '仰拍',
      style: '赛博朋克',
    },
  },
]

// ==================== 导出数据 ====================

export interface ExportProject {
  id: string
  name: string
  totalDuration: number
  clips: {
    id: string
    name: string
    duration: number
    thumbnail?: string
  }[]
  audioTracks: string[]
  status: 'draft' | 'ready' | 'exporting' | 'completed'
}

export const mockExportProject: ExportProject = {
  id: 'export-1',
  name: '赛博朋克短片',
  totalDuration: 180,
  status: 'ready',
  clips: [
    { id: 'c1', name: '开场 - 城市全景', duration: 5 },
    { id: 'c2', name: '主角登场', duration: 3 },
    { id: 'c3', name: '眼神特写', duration: 2 },
    { id: 'c4', name: '追逐开始', duration: 2 },
    { id: 'c5', name: '翻越围墙', duration: 3 },
  ],
  audioTracks: ['开场旁白', '追逐背景音乐', '雨声环境音'],
}

// ==================== 项目统计数据 ====================

export const mockProjectStats = {
  totalProjects: 12,
  completedScripts: 8,
  generatedStoryboards: 156,
  createdCharacters: 24,
  generatedVideos: 48,
  totalDuration: 3600,
}

// ==================== 最近活动 ====================

export interface Activity {
  id: string
  type: 'script' | 'storyboard' | 'character' | 'audio' | 'video' | 'export'
  action: string
  target: string
  timestamp: Date
}

export const mockActivities: Activity[] = [
  { id: 'act-1', type: 'script', action: '创建了剧本', target: '赛博朋克短片', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
  { id: 'act-2', type: 'storyboard', action: '生成了分镜', target: 'Scene 1 - 3个镜头', timestamp: new Date(Date.now() - 1000 * 60 * 30) },
  { id: 'act-3', type: 'character', action: '创建了角色', target: '林墨', timestamp: new Date(Date.now() - 1000 * 60 * 60) },
  { id: 'act-4', type: 'video', action: '视频生成完成', target: 'Shot 1A', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
  { id: 'act-5', type: 'audio', action: '生成了配音', target: '开场旁白', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3) },
]
