import { defineStore } from 'pinia';
import { ref } from 'vue';
import { login as loginApi, register as registerApi, getUserInfo as getUserInfoApi } from '../api/auth.js';
import router from '../router/index.js';

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const token = ref(localStorage.getItem('token') || '');
  const user = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // 初始化用户状态
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      user.value = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error('初始化用户状态失败:', error);
  }

  // 计算属性
  const isAuthenticated = () => !!token.value;

  // 方法
  const login = async (username, password) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await loginApi(username, password);
      // 适配新的API返回格式
      const responseData = response.data || response;
      if (!responseData?.token || !responseData?.user) {
        throw new Error('登录接口返回数据格式不正确');
      }
      
      // 保存token和用户信息
      user.value = responseData.user;
      token.value = responseData.token;
      
      // 存储到localStorage
      localStorage.setItem('token', token.value);
      localStorage.setItem('user', JSON.stringify(user.value));
      
      await router.push('/');
      return response;
    } catch (err) {
      console.error('登录失败:', err);
      error.value = err.message || '登录失败，请检查用户名和密码';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const register = async (userData) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await registerApi(userData);
      return response;
    } catch (err) {
      error.value = err.message || '注册失败，请稍后再试';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    // 清除token和用户信息
    token.value = '';
    user.value = null;
    
    // 清除localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // 跳转到登录页
    router.push('/login');
  };

  const getUserInfo = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await getUserInfoApi();
      if (!response?.data) {
        throw new Error('获取用户信息失败');
      }
      user.value = response.data;
      localStorage.setItem('user', JSON.stringify(user.value));
      return user.value;
    } catch (err) {
      error.value = err.message || '获取用户信息失败';
      // 如果是未登录错误，清除状态并跳转到登录页
      if (err.message === '未登录') {
        logout();
      }
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  // 获取当前用户
  const getCurrentUser = () => {
    return user.value;
  };

  // 检查是否是管理员
  const isAdmin = () => {
    return user.value?.role === 'ADMIN';
  };

  // 检查是否有特定权限
  const hasPermission = (permission) => {
    if (!user.value) return false;
    
    switch (permission) {
      case 'manage_staff':
        return user.value.role === 'ADMIN';
      default:
        return false;
    }
  };

  return {
    token,
    user,
    loading,
    getCurrentUser,
    isAdmin,
    hasPermission,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    getUserInfo
  };
});