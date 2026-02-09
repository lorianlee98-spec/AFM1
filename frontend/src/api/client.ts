/**
 * API客户端
 * 封装axios，提供统一的API请求接口
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

// API基础URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

// 创建axios实例
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30秒超时
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 直接返回响应数据
    return response.data
  },
  (error) => {
    // 统一错误处理
    if (error.response) {
      // 服务器返回错误状态码
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          // 未授权，清除token并跳转到登录页
          localStorage.removeItem('auth_token')
          window.location.href = '/login'
          break
        case 403:
          console.error('没有权限访问该资源')
          break
        case 404:
          console.error('请求的资源不存在')
          break
        case 500:
          console.error('服务器内部错误')
          break
        default:
          console.error(`请求失败: ${data?.message || error.message}`)
      }
    } else if (error.request) {
      // 请求发送但没有收到响应
      console.error('网络错误，请检查网络连接')
    } else {
      // 请求配置出错
      console.error('请求配置错误:', error.message)
    }
    
    return Promise.reject(error)
  }
)

// API请求方法封装
export const api = {
  /**
   * GET请求
   */
  get: <T>(url: string, params?: object): Promise<T> => {
    return apiClient.get(url, { params })
  },

  /**
   * POST请求
   */
  post: <T>(url: string, data?: object): Promise<T> => {
    return apiClient.post(url, data)
  },

  /**
   * PUT请求
   */
  put: <T>(url: string, data?: object): Promise<T> => {
    return apiClient.put(url, data)
  },

  /**
   * DELETE请求
   */
  delete: <T>(url: string): Promise<T> => {
    return apiClient.delete(url)
  },
}

export default apiClient
