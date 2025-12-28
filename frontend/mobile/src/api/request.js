import axios from 'axios';
import { showNotify } from 'vant';
import router from '../router/index.js';
import * as equipmentMock from '../mock/equipment.js';
import * as maintenanceMock from '../mock/maintenance.js';

// 判断是否使用mock数据
const useMock = import.meta.env.MODE === 'development';

// mock处理函数集合
const mockHandlers = useMock ? {
  ...equipmentMock,
  ...maintenanceMock,
} : {};

// 创建axios实例
const service = axios.create({
  baseURL: '/api',
  timeout: 15000
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 如果是开发环境且有对应的mock处理函数，使用mock数据
    if (useMock) {
      const urlParts = config.url.replace('/api/', '').split('/');
      const baseResource = urlParts[0];
      const method = config.method.toLowerCase();
      let mockKey;
      
      // 处理不同的URL模式
      if (urlParts.length === 1) {
        // 列表请求，如 /api/equipments 或 /api/maintenances
        if (baseResource === 'maintenances') {
          mockKey = 'getMaintenances';
        } else {
          mockKey = `get${baseResource.charAt(0).toUpperCase()}${baseResource.slice(1)}s`;
        }
      } else if (urlParts.length === 2 && !isNaN(urlParts[1])) {
        // 详情请求，如 /api/equipments/1 或 /api/maintenances/1
        if (baseResource === 'maintenances') {
          mockKey = 'getMaintenanceById';
        } else {
          mockKey = `get${baseResource.slice(0, -1).charAt(0).toUpperCase()}${baseResource.slice(0, -1).slice(1)}ById`;
        }
      } else if (urlParts[1] === 'applications') {
        // 特殊处理设备申请相关请求
        mockKey = method === 'get' ? 'getEquipmentApplications' : 'applyEquipment';
      } else if (urlParts[2] === 'status') {
        // 特殊处理更新申请状态的请求
        mockKey = 'updateApplicationStatus';
      } else {
        // 其他情况，包括POST请求
        if (baseResource === 'maintenances') {
          if (method === 'post') {
            mockKey = 'createMaintenance';
          } else if (method === 'put') {
            mockKey = 'updateMaintenance';
          } else if (method === 'delete') {
            mockKey = 'deleteMaintenance';
          }
        } else {
          mockKey = `${method}${baseResource.charAt(0).toUpperCase()}${baseResource.slice(1)}`;
        }
      }

      if (mockHandlers[mockKey]) {
        return new Promise((resolve) => {
          setTimeout(() => {
            try {
              const result = mockHandlers[mockKey](config);
              
              // 如果mock函数已经返回了axios格式的响应，直接使用
              if (result && typeof result === 'object' && 'data' in result && 'status' in result) {
                resolve(result);
              } else {
                // 否则包装成axios格式
                resolve({
                  data: result,
                  status: 200,
                  statusText: 'OK',
                  headers: {},
                  config
                });
              }
            } catch (error) {
              resolve({
                data: { 
                  code: error.code || 500,
                  message: error.message || '请求失败'
                },
                status: error.code || 500,
                statusText: error.message || 'Error',
                headers: {},
                config
              });
            }
          }, 300);
        });
      }
    }
    
    // 从localStorage获取token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
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