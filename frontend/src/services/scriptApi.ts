import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true'

export interface Script {
  id: number
  title: string
  description: string | null
  content: string | null
  genre: string | null
  target_audience: string | null
  duration: number
  status: string
  user_id: number
  created_at: string
  updated_at: string | null
}

export interface ScriptCreate {
  title: string
  description?: string
  content?: string
  genre?: string
  target_audience?: string
  duration?: number
  status?: string
}

export interface ScriptUpdate {
  title?: string
  description?: string
  content?: string
  genre?: string
  target_audience?: string
  duration?: number
  status?: string
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token')
  return {
    Authorization: `Bearer ${token}`,
  }
}

const localStorageScripts = {
  getScripts: (): Script[] => {
    const saved = localStorage.getItem('script_projects')
    return saved ? JSON.parse(saved) : []
  },
  
  saveScripts: (scripts: Script[]) => {
    localStorage.setItem('script_projects', JSON.stringify(scripts))
  },
  
  getScriptContent: (id: number): string => {
    return localStorage.getItem(`script_content_${id}`) || ''
  },
  
  saveScriptContent: (id: number, content: string) => {
    localStorage.setItem(`script_content_${id}`, content)
  }
}

const mockApi = {
  getScripts: (): Script[] => {
    return localStorageScripts.getScripts()
  },

  getScript: (id: number): Script => {
    const scripts = localStorageScripts.getScripts()
    const script = scripts.find(s => s.id === id)
    if (script) {
      script.content = localStorageScripts.getScriptContent(id)
      return script
    }
    throw new Error('Script not found')
  },

  createScript: (data: ScriptCreate): Script => {
    const scripts = localStorageScripts.getScripts()
    const newScript: Script = {
      id: Date.now(),
      title: data.title,
      description: data.description || null,
      content: data.content || null,
      genre: data.genre || null,
      target_audience: data.target_audience || null,
      duration: data.duration || 5,
      status: data.status || 'draft',
      user_id: 0,
      created_at: new Date().toISOString(),
      updated_at: null,
    }
    scripts.unshift(newScript)
    localStorageScripts.saveScripts(scripts)
    return newScript
  },

  updateScript: (id: number, data: ScriptUpdate): Script => {
    const scripts = localStorageScripts.getScripts()
    const index = scripts.findIndex(s => s.id === id)
    if (index === -1) throw new Error('Script not found')
    
    const updated = { ...scripts[index], ...data, updated_at: new Date().toISOString() }
    scripts[index] = updated
    localStorageScripts.saveScripts(scripts)
    return updated
  },

  deleteScript: (id: number): void => {
    const scripts = localStorageScripts.getScripts()
    const filtered = scripts.filter(s => s.id !== id)
    localStorageScripts.saveScripts(filtered)
    localStorage.removeItem(`script_content_${id}`)
  },

  updateScriptContent: (id: number, content: string): void => {
    localStorageScripts.saveScriptContent(id, content)
  },

  optimizePrompt: (prompt: string): string[] => {
    return [
      `${prompt}，包含详细的角色设定和情感冲突`,
      `${prompt}，突出视觉效果和画面感`,
      `${prompt}，加入意想不到的剧情转折`,
      `${prompt}，注重对话的自然流畅和个性化`,
      `${prompt}，营造特定的氛围和情绪基调`
    ]
  },

  optimizeContent: (content: string): {
    type: 'structure' | 'dialogue' | 'description' | 'character'
    title: string
    description: string
    suggestion: string
  }[] => {
    const suggestions = []
    
    if (!content.includes('=== 场景')) {
      suggestions.push({
        type: 'structure' as const,
        title: '剧本结构优化',
        description: '建议按照标准剧本结构组织内容',
        suggestion: `剧本\n\n类型：剧情\n目标时长：5分钟\n\n=== 场景1：开头 ===\n\n[画面描述]\n${content}\n\n=== 场景2：发展 ===\n\n[画面描述]\n...\n\n=== 场景3：高潮 ===\n\n[画面描述]\n...\n\n=== 场景4：结局 ===\n\n[画面描述]\n...\n\n=== 完 ===`
      })
    }
    
    if (!content.includes('：（')) {
      suggestions.push({
        type: 'dialogue' as const,
        title: '对话格式优化',
        description: '建议使用标准对话格式',
        suggestion: content.replace(/([^：]+)：([^\n]+)/g, '$1：（$2）')
      })
    }
    
    if (!content.includes('[画面描述]')) {
      suggestions.push({
        type: 'description' as const,
        title: '画面描述增强',
        description: '建议添加详细的画面描述',
        suggestion: content.replace(/=== 场景[^=]+===/g, '$&\n\n[画面描述]\n镜头推进，展示场景细节...')
      })
    }
    
    if (!content.includes('主角') || !content.includes('配角')) {
      suggestions.push({
        type: 'character' as const,
        title: '角色设定完善',
        description: '建议明确角色设定和关系',
        suggestion: content.replace(/角色A/g, '主角')
          .replace(/角色B/g, '配角')
          .replace(/=== 场景1：开头 ===/, '=== 场景1：开头 ===\n\n[角色设定]\n主角：主要人物，性格特点...\n配角：重要配角，与主角的关系...')
      })
    }
    
    return suggestions
  }
}

const realApi = {
  getScripts: async (): Promise<Script[]> => {
    const response = await axios.get(`${API_BASE_URL}/scripts/`, {
      headers: getAuthHeaders(),
    })
    return response.data
  },

  getScript: async (id: number): Promise<Script> => {
    const response = await axios.get(`${API_BASE_URL}/scripts/${id}`, {
      headers: getAuthHeaders(),
    })
    return response.data
  },

  createScript: async (data: ScriptCreate): Promise<Script> => {
    const response = await axios.post(`${API_BASE_URL}/scripts/`, data, {
      headers: getAuthHeaders(),
    })
    return response.data
  },

  updateScript: async (id: number, data: ScriptUpdate): Promise<Script> => {
    const response = await axios.put(`${API_BASE_URL}/scripts/${id}`, data, {
      headers: getAuthHeaders(),
    })
    return response.data
  },

  deleteScript: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/scripts/${id}`, {
      headers: getAuthHeaders(),
    })
  },

  updateScriptContent: async (id: number, content: string): Promise<void> => {
    await axios.patch(
      `${API_BASE_URL}/scripts/${id}/content`,
      { content },
      {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
      }
    )
  },

  optimizePrompt: async (prompt: string): Promise<string[]> => {
    const response = await axios.post(`${API_BASE_URL}/scripts/optimize/prompt`, 
      { prompt },
      {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
      }
    )
    return response.data.suggestions
  },

  optimizeContent: async (content: string, scriptId?: number): Promise<{
    type: 'structure' | 'dialogue' | 'description' | 'character'
    title: string
    description: string
    suggestion: string
  }[]> => {
    const response = await axios.post(`${API_BASE_URL}/scripts/optimize/content`, 
      { content, script_id: scriptId },
      {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
      }
    )
    return response.data.suggestions
  }
}

export const scriptApi = {
  getScripts: async (): Promise<Script[]> => {
    if (USE_MOCK_API) {
      return mockApi.getScripts()
    }
    return realApi.getScripts()
  },

  getScript: async (id: number): Promise<Script> => {
    if (USE_MOCK_API) {
      return mockApi.getScript(id)
    }
    return realApi.getScript(id)
  },

  createScript: async (data: ScriptCreate): Promise<Script> => {
    if (USE_MOCK_API) {
      return mockApi.createScript(data)
    }
    return realApi.createScript(data)
  },

  updateScript: async (id: number, data: ScriptUpdate): Promise<Script> => {
    if (USE_MOCK_API) {
      return mockApi.updateScript(id, data)
    }
    return realApi.updateScript(id, data)
  },

  deleteScript: async (id: number): Promise<void> => {
    if (USE_MOCK_API) {
      return mockApi.deleteScript(id)
    }
    return realApi.deleteScript(id)
  },

  updateScriptContent: async (id: number, content: string): Promise<void> => {
    if (USE_MOCK_API) {
      return mockApi.updateScriptContent(id, content)
    }
    return realApi.updateScriptContent(id, content)
  },

  optimizePrompt: async (prompt: string): Promise<string[]> => {
    if (USE_MOCK_API) {
      return mockApi.optimizePrompt(prompt)
    }
    return realApi.optimizePrompt(prompt)
  },

  optimizeContent: async (content: string, scriptId?: number): Promise<{
    type: 'structure' | 'dialogue' | 'description' | 'character'
    title: string
    description: string
    suggestion: string
  }[]> => {
    if (USE_MOCK_API) {
      return mockApi.optimizeContent(content)
    }
    return realApi.optimizeContent(content, scriptId)
  },
}
