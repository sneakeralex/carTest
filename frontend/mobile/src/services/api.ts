import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // 开发环境API地址
  timeout: 10000, // 请求超时时间
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    if (response.status === 200) {
      return response.data;
    }
    return response;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未登录或token过期，清除token并跳转到登录页面
          localStorage.removeItem('token');
          // 可以通过路由导航到登录页面
          window.location.href = '/login';
          break;
        case 403:
          // 没有权限
          console.log('没有权限访问');
          break;
        case 404:
          // 请求不存在
          console.log('请求的资源不存在');
          break;
        case 500:
          // 服务器错误
          console.log('服务器错误');
          break;
        default:
          console.log(`未知错误${error.response.status}`);
      }
    } else {
      // 网络错误或请求被取消
      console.log('网络错误或请求被取消');
    }
    return Promise.reject(error);
  }
);

// API接口定义
export default {
  // 认证相关
  auth: {
    login: (data: { username: string; password: string }) => api.post('/auth/login', data),
    register: (data: { username: string; password: string; phone: string; email?: string }) =>
      api.post('/auth/register', data),
    getUserInfo: () => api.get('/auth/user-info'),
    updateUserInfo: (data: any) => api.put('/auth/user-info', data),
    changePassword: (data: { oldPassword: string; newPassword: string }) =>
      api.put('/auth/change-password', data),
  },

  // 车辆相关
  vehicle: {
    getVehicles: (params?: any) => api.get('/vehicles', { params }),
    getVehicleById: (id: number) => api.get(`/vehicles/${id}`),
    createVehicle: (data: any) => api.post('/vehicles', data),
    updateVehicle: (id: number, data: any) => api.put(`/vehicles/${id}`, data),
    deleteVehicle: (id: number) => api.delete(`/vehicles/${id}`),
  },

  // 预约相关
  appointment: {
    getAppointments: (params?: any) => api.get('/appointments', { params }),
    getAppointmentById: (id: number) => api.get(`/appointments/${id}`),
    createAppointment: (data: any) => api.post('/appointments', data),
    updateAppointment: (id: number, data: any) => api.put(`/appointments/${id}`, data),
    cancelAppointment: (id: number) => api.put(`/appointments/${id}/cancel`),
    submitFeedback: (id: number, data: { feedback: string }) =>
      api.put(`/appointments/${id}/feedback`, data),
  },

  // 维修保养相关
  maintenance: {
    getMaintenances: (params?: any) => api.get('/maintenances', { params }),
    getMaintenanceById: (id: number) => api.get(`/maintenances/${id}`),
    createMaintenance: (data: any) => api.post('/maintenances', data),
    updateMaintenance: (id: number, data: any) => api.put(`/maintenances/${id}`, data),
    cancelMaintenance: (id: number) => api.put(`/maintenances/${id}/cancel`),
  },
};