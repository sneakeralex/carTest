import { defineStore } from 'pinia';
import { ref } from 'vue';
import { login as loginApi, register as registerApi } from '../api/auth';
import router from '../router';

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const token = ref(localStorage.getItem('token') || '');
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));
  const loading = ref(false);
  const error = ref(null);

  // 计算属性
  const isAuthenticated = () => !!token.value;

  // 方法
  const login = async (username, password) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await loginApi(username, password);
      console.log(response);

      if (!response.data.success) {
        throw new Error()
      }

      // 验证返回结果
      if (!response || !response.data || !response.data.code || !response.data.data.phone) {
        throw new Error('登录接口返回数据格式不正确');
      }
      
      // 保存token和用户信息
      // TODO add token
      // token.value = response.data.token;
      user.value = response.data.data;
      token.value = response.data.data.phone;
      
      // 存储到localStorage
      localStorage.setItem('token', token.value);
      localStorage.setItem('user', JSON.stringify(user.value));
      
      // 登录成功后跳转到首页
      await router.push('/');
      
      return response;
    } catch (err) {
      console.log(err);
      error.value = err.response?.data?.message || '登录失败，请检查用户名和密码';
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
      error.value = err.response?.data?.message || '注册失败，请稍后再试';
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

  return {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout
  };
});