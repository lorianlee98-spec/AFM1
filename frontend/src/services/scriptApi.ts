import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

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

// 检查token是否有效
const isTokenValid = () => {
  const token = localStorage.getItem('auth_token')
  if (!token) return false
  
  try {
    // 简单检查token格式
    const parts = token.split('.')
    if (parts.length !== 3) return false
    
    // 解码payload检查是否过期
    const payload = JSON.parse(atob(parts[1]))
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return false
    }
    return true
  } catch {
    return false
  }
}

// 本地存储操作
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

export const scriptApi = {
  // 获取所有剧本
  getScripts: async (): Promise<Script[]> => {
    // 如果token无效，直接使用本地存储
    if (!isTokenValid()) {
      return localStorageScripts.getScripts()
    }
    
    try {
      const response = await axios.get(`${API_BASE_URL}/scripts/`, {
        headers: getAuthHeaders(),
      })
      // 同步到本地存储
      localStorageScripts.saveScripts(response.data)
      return response.data
    } catch (err: any) {
      // 401错误时静默使用本地存储
      if (err.response?.status === 401) {
        return localStorageScripts.getScripts()
      }
      throw err
    }
  },

  // 获取单个剧本
  getScript: async (id: number): Promise<Script> => {
    if (!isTokenValid()) {
      const scripts = localStorageScripts.getScripts()
      const script = scripts.find(s => s.id === id)
      if (script) {
        script.content = localStorageScripts.getScriptContent(id)
        return script
      }
      throw new Error('Script not found')
    }
    
    const response = await axios.get(`${API_BASE_URL}/scripts/${id}`, {
      headers: getAuthHeaders(),
    })
    return response.data
  },

  // 创建剧本
  createScript: async (data: ScriptCreate): Promise<Script> => {
    if (!isTokenValid()) {
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
    }
    
    try {
      const response = await axios.post(`${API_BASE_URL}/scripts/`, data, {
        headers: getAuthHeaders(),
      })
      // 同步到本地存储
      const scripts = localStorageScripts.getScripts()
      scripts.unshift(response.data)
      localStorageScripts.saveScripts(scripts)
      return response.data
    } catch (err: any) {
      if (err.response?.status === 401) {
        // 降级到本地存储
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
      }
      throw err
    }
  },

  // 更新剧本
  updateScript: async (id: number, data: ScriptUpdate): Promise<Script> => {
    if (!isTokenValid()) {
      const scripts = localStorageScripts.getScripts()
      const index = scripts.findIndex(s => s.id === id)
      if (index === -1) throw new Error('Script not found')
      
      const updated = { ...scripts[index], ...data, updated_at: new Date().toISOString() }
      scripts[index] = updated
      localStorageScripts.saveScripts(scripts)
      return updated
    }
    
    try {
      const response = await axios.put(`${API_BASE_URL}/scripts/${id}`, data, {
        headers: getAuthHeaders(),
      })
      // 同步到本地存储
      const scripts = localStorageScripts.getScripts()
      const index = scripts.findIndex(s => s.id === id)
      if (index !== -1) {
        scripts[index] = response.data
        localStorageScripts.saveScripts(scripts)
      }
      return response.data
    } catch (err: any) {
      if (err.response?.status === 401) {
        const scripts = localStorageScripts.getScripts()
        const index = scripts.findIndex(s => s.id === id)
        if (index === -1) throw new Error('Script not found')
        
        const updated = { ...scripts[index], ...data, updated_at: new Date().toISOString() }
        scripts[index] = updated
        localStorageScripts.saveScripts(scripts)
        return updated
      }
      throw err
    }
  },

  // 删除剧本
  deleteScript: async (id: number): Promise<void> => {
    if (!isTokenValid()) {
      const scripts = localStorageScripts.getScripts()
      const filtered = scripts.filter(s => s.id !== id)
      localStorageScripts.saveScripts(filtered)
      localStorage.removeItem(`script_content_${id}`)
      return
    }
    
    try {
      await axios.delete(`${API_BASE_URL}/scripts/${id}`, {
        headers: getAuthHeaders(),
      })
      // 同步到本地存储
      const scripts = localStorageScripts.getScripts()
      const filtered = scripts.filter(s => s.id !== id)
      localStorageScripts.saveScripts(filtered)
      localStorage.removeItem(`script_content_${id}`)
    } catch (err: any) {
      if (err.response?.status === 401) {
        const scripts = localStorageScripts.getScripts()
        const filtered = scripts.filter(s => s.id !== id)
        localStorageScripts.saveScripts(filtered)
        localStorage.removeItem(`script_content_${id}`)
        return
      }
      throw err
    }
  },

  // 更新剧本内容
  updateScriptContent: async (id: number, content: string): Promise<void> => {
    // 总是保存到本地存储
    localStorageScripts.saveScriptContent(id, content)
    
    if (!isTokenValid()) {
      return
    }
    
    try {
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
    } catch (err: any) {
      // 401错误时静默处理，因为已经保存到本地
      if (err.response?.status !== 401) {
        throw err
      }
    }
  },
}
