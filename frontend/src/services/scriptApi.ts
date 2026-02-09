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

export const scriptApi = {
  // 获取所有剧本
  getScripts: async (): Promise<Script[]> => {
    const response = await axios.get(`${API_BASE_URL}/scripts/`, {
      headers: getAuthHeaders(),
    })
    return response.data
  },

  // 获取单个剧本
  getScript: async (id: number): Promise<Script> => {
    const response = await axios.get(`${API_BASE_URL}/scripts/${id}`, {
      headers: getAuthHeaders(),
    })
    return response.data
  },

  // 创建剧本
  createScript: async (data: ScriptCreate): Promise<Script> => {
    const response = await axios.post(`${API_BASE_URL}/scripts/`, data, {
      headers: getAuthHeaders(),
    })
    return response.data
  },

  // 更新剧本
  updateScript: async (id: number, data: ScriptUpdate): Promise<Script> => {
    const response = await axios.put(`${API_BASE_URL}/scripts/${id}`, data, {
      headers: getAuthHeaders(),
    })
    return response.data
  },

  // 删除剧本
  deleteScript: async (id: number): Promise<Script> => {
    const response = await axios.delete(`${API_BASE_URL}/scripts/${id}`, {
      headers: getAuthHeaders(),
    })
    return response.data
  },

  // 更新剧本内容
  updateScriptContent: async (id: number, content: string): Promise<Script> => {
    const response = await axios.patch(
      `${API_BASE_URL}/scripts/${id}/content`,
      { content },
      {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
      }
    )
    return response.data
  },
}
