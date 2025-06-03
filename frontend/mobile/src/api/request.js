import axios from 'axios';
import { showNotify } from 'vant';
import router from '../router';

// 创建axios实例
const service = axios.create({
  baseURL: '/api', // API的基础URL
  timeout: 15000 // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 从localStorage获取token
    const token = localStorage.getItem('token');
    
    // 如果有token，添加到请求头
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  error => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    // 如果响应成功，直接返回数据
    return response;
  },
  error => {
    const { response } = error;
    
    if (response) {
      // 根据响应状态码处理错误
      switch (response.status) {
        case 400:
          showNotify({ type: 'danger', message: '请求参数错误' });
          break;
        case 401:
          // 未授权，清除token并跳转到登录页
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/login');
          showNotify({ type: 'danger', message: '登录已过期，请重新登录' });
          break;
        case 403:
          showNotify({ type: 'danger', message: '没有权限访问该资源' });
          break;
        case 404:
          showNotify({ type: 'danger', message: '请求的资源不存在' });
          break;
        case 500:
          showNotify({ type: 'danger', message: '服务器内部错误' });
          break;
        default:
          showNotify({ type: 'danger', message: `请求失败: ${response.status}` });
      }
    } else {
      // 网络错误或请求被取消
      showNotify({ type: 'danger', message: '网络错误，请检查您的网络连接' });
    }
    
    return Promise.reject(error);
  }
);

export default service;