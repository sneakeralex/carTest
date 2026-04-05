import { defineStore } from 'pinia';
import { ref } from 'vue';
import { login as loginApi, register as registerApi, getUserInfo as getUserInfoApi, sendVerificationCode as sendVerificationCodeApi, loginWithVerificationCode as loginWithVerificationCodeApi, verifyVerificationCode as verifyVerificationCodeApi } from '../api/auth.js';
import { getItem, setItem, removeItem } from '../utils/storage.js';
import router from '../router/index.js';

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const token = ref(getItem('token', ''));
  const user = ref(getItem('user', {}));
  const loading = ref(false);
  const error = ref(null);

  // 初始化用户状态
  try {
    const storedUser = getItem('user', {});
    if (Object.keys(storedUser).length > 0) {
      user.value = storedUser;
    }
  } catch (error) {
    console.error('初始化用户状态失败:', error);
  }

  // 计算属性
  const isAuthenticated = () => !!token.value;

  // 统一错误映射：把各种错误转换成友好 Error 对象
  const mapError = (raw) => {
    if (!raw) return new Error('发生未知错误');

    // If a plain string was thrown, wrap it
    let message = (typeof raw === 'string') ? raw : (raw.message || '发生未知错误');

    // Inspect common shapes (axios/fetch)
    if (raw.response && raw.response.data) {
      // axios style
      const d = raw.response.data;
      message = d.msg || d.message || message;
    } else if (raw.data) {
      // sometimes API result object
      message = raw.data.msg || raw.data.message || message;
    }

    // Map noisy/internal messages to user-friendly messages
    const known = {
      '密码错误，默认密码为手机号后四位': '您输入的密码不正确，请输入手机号后四位作为默认密码',
      '该手机号未注册，请联系管理员': '该手机号尚未注册，请联系管理员或前往注册',
      '手机号已存在，请勿重复注册': '该手机号已被注册，请直接登录或使用忘记密码',
      '未登录': '未登录或会话已过期，请重新登录'
    };
    if (known[message]) message = known[message];

    // Map HTTP status codes if available
    const status = raw.response?.status || raw.status || raw.code;
    // Treat 401 as credential error in UI to surface '用户名或密码错误，请再试'
    if (status === 401) message = '用户名或密码错误，请再试';
    if (status === 403) message = '无权限执行此操作';
    if (status === 404) message = '请求的资源未找到';
    if (status === 500) message = '服务器内部错误，请稍后重试';

    const err = new Error(message);
    // preserve original metadata for debugging
    try { if (raw.code) err.code = raw.code; } catch(e){}
    try { if (raw.response) err._response = raw.response; } catch(e){}
    return err;
  };

  // 方法
  const login = async (username, password, verificationCode) => {
    loading.value = true;
    error.value = null;
    
    try {
      // 验证验证码
      if (verificationCode) {
        // 调用验证码验证API
        console.log('验证验证码:', verificationCode);
        await verifyVerificationCodeApi(username, verificationCode);
        console.log('验证码验证成功');
      }
      
      const response = await loginApi(username, password, verificationCode);
      // 支持后端返回 { message, user }（token 可选）
      const responseData = response?.data || response;
      const upstreamUser = responseData?.user || responseData?.data?.user;
      const upstreamToken = responseData?.token || response?.data?.token || '';
      if (!upstreamUser) {
        throw new Error('登录接口返回数据格式不正确');
      }

      // Map upstream fields to store's expected shape
      const mappedUser = {
        userId: upstreamUser.userId || upstreamUser.id || upstreamUser.userId,
        username: upstreamUser.username || upstreamUser.staffName || upstreamUser.name || upstreamUser.displayName,
        name: upstreamUser.staffName || upstreamUser.name || upstreamUser.displayName || upstreamUser.username,
        phone: upstreamUser.phone,
        email: upstreamUser.email,
        avatar: upstreamUser.avatar,
        role: upstreamUser.role || (upstreamUser.phone === '13651895278' ? 'ADMIN' : 'USER'),
        department: upstreamUser.department,
        // keep original payload
        ...upstreamUser
      };

      // 保存token（如果有）和用户信息
      user.value = mappedUser;
      // If backend did not return a token, generate a local session token so
      // the router's auth guard recognizes the user as authenticated.
      const sessionToken = upstreamToken || token.value || ('local-session-' + Date.now());
      token.value = sessionToken;
      
      // 存储到localStorage
      setItem('token', token.value);
      setItem('user', user.value);
      
      await router.push('/');
      return response;
    } catch (err) {
      console.error('登录失败:', err);
      const friendly = mapError(err);
      error.value = friendly.message || '登录失败，请检查用户名和密码';
      throw friendly;
    } finally {
      loading.value = false;
    }
  };

  const register = async (userData) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await registerApi(userData);
      // Return a standardized success object with a friendly message for the UI
      const out = (response && typeof response === 'object')
        ? { ...response, message: '注册成功后，请联系管理员开通权限' }
        : { data: response, message: '注册成功后，请联系管理员开通权限' };
      return out;
    } catch (err) {
      const friendly = mapError(err);
      error.value = friendly.message || '注册失败，请稍后再试';
      throw friendly;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    // 清除token和用户信息
    token.value = '';
    user.value = null;
    
    // 清除localStorage
    removeItem('token');
    removeItem('user');
    
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
      setUserInfo(user.value);
      return user.value;
    } catch (err) {
      const friendly = mapError(err);
      error.value = friendly.message || '获取用户信息失败';
      // 如果是未登录错误，清除状态并跳转到登录页
      if (friendly.message && friendly.message.includes('未登录')) {
        logout();
      }
      throw friendly;
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

  // 发送验证码
  const sendVerificationCode = async (phoneNumber) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await sendVerificationCodeApi(phoneNumber);
      return response;
    } catch (err) {
      console.error('发送验证码失败:', err);
      const friendly = mapError(err);
      error.value = friendly.message || '发送验证码失败';
      throw friendly;
    } finally {
      loading.value = false;
    }
  };

  // 验证码登录
  const loginWithVerificationCode = async (phoneNumber, verificationCode) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await loginWithVerificationCodeApi(phoneNumber, verificationCode);
      // 支持后端返回 { message, user }（token 可选）
      const responseData = response?.data || response;
      const upstreamUser = responseData?.user || responseData?.data?.user;
      const upstreamToken = responseData?.token || response?.data?.token || '';
      if (!upstreamUser) {
        throw new Error('登录接口返回数据格式不正确');
      }

      // Map upstream fields to store's expected shape
      const mappedUser = {
        userId: upstreamUser.userId || upstreamUser.id || upstreamUser.userId,
        username: upstreamUser.username || upstreamUser.staffName || upstreamUser.name || upstreamUser.displayName,
        name: upstreamUser.staffName || upstreamUser.name || upstreamUser.displayName || upstreamUser.username,
        phone: upstreamUser.phone,
        email: upstreamUser.email,
        avatar: upstreamUser.avatar,
        role: upstreamUser.role || (upstreamUser.phone === '13651895278' ? 'ADMIN' : 'USER'),
        department: upstreamUser.department,
        // keep original payload
        ...upstreamUser
      };

      // 保存token（如果有）和用户信息
      user.value = mappedUser;
      // If backend did not return a token, generate a local session token so
      // the router's auth guard recognizes the user as authenticated.
      const sessionToken = upstreamToken || token.value || ('local-session-' + Date.now());
      token.value = sessionToken;
      
      // 存储到localStorage
      setItem('token', token.value);
      setItem('user', user.value);
      
      await router.push('/');
      return response;
    } catch (err) {
      console.error('登录失败:', err);
      const friendly = mapError(err);
      error.value = friendly.message || '登录失败，请检查验证码';
      throw friendly;
    } finally {
      loading.value = false;
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
    getUserInfo,
    sendVerificationCode,
    loginWithVerificationCode
  };
});