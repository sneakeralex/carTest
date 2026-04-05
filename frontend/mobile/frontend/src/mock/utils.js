// 生成唯一ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// 导入存储工具
import { getItem } from '../utils/storage.js';

// 生成随机日期
export const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// 从数组中随机选择一个元素
export const randomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

// 模拟API响应延迟
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟API响应格式
export const mockResponse = (data) => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {}
});

// 验证token
export const validateToken = () => {
  // 检查是否在浏览器环境中
  if (typeof window !== 'undefined') {
    const token = getItem('token');
    if (!token || !token.startsWith('Bearer mock_token_')) {
      throw new Error('未授权访问');
    }
  }
  // 在Node.js环境中跳过验证
  return true;
};

// 通用的API错误
export class MockApiError extends Error {
  constructor(message, status = 401) {
    super(message);
    this.response = {
      status,
      data: { message }
    };
  }
}

// 解析查询参数
export const getQueryParams = (url) => {
  if (!url || !url.includes('?')) return {};
  
  const queryString = url.split('?')[1];
  const params = {};
  
  queryString.split('&').forEach(param => {
    const [key, value] = param.split('=');
    params[key] = decodeURIComponent(value);
  });
  
  return params;
};
