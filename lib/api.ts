import { Event, CreateEventData } from '@/db/model/vo/Event';
import { Perspective, CreatePerspectiveData } from '@/db/model/vo/Perspective';

// 模拟网络延迟 - 保留以提供更好的用户体验
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API请求的基础URL
const API_BASE_URL = '/api';

// 处理API请求的通用函数
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers || {});
  
  // 确保设置正确的Content-Type
  if (!headers.has('Content-Type') && options.method !== 'GET') {
    headers.set('Content-Type', 'application/json');
  }
  
  // 添加认证信息（如果需要）
  // 注意：NextAuth.js会自动处理会话cookie，这里不需要手动添加Authorization头
  
  try {
    await delay(300); // 保留一些延迟以提供更好的用户体验
    
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include' // 包含cookies
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `请求失败: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('API请求错误:', error);
    throw error;
  }
}

export const api = {

  // 创建新事件
  async createEvent(data: CreateEventData): Promise<{ id: string }> {
    try {
      const url = `${API_BASE_URL}/events`;
      // 确保保留所有字段，包括可能存在的geom字段
      return fetchWithAuth(url, {
        method: 'POST',
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error('创建事件失败:', error);
      throw new Error('创建事件失败');
    }
  },

  // 添加视角
  async addPerspective(eventId: string, data: CreatePerspectiveData): Promise<{ id: string }> {
    try {
      const url = `${API_BASE_URL}/events/${eventId}`;
      return fetchWithAuth(url, {
        method: 'POST',
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error('添加视角失败:', error);
      throw new Error('添加视角失败');
    }
  }
};
