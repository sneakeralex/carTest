/**
 * 获取用户信息
 * @returns {Object} - 用户信息对象，解析失败时返回空对象
 */
export const getUserInfo = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr || userStr === 'undefined') {
      return {};
    }
    return JSON.parse(userStr);
  } catch (error) {
    console.error('解析用户信息失败:', error);
    return {};
  }
};

/**
 * 保存用户信息到 localStorage
 * @param {Object} userInfo - 用户信息对象
 */
export const setUserInfo = (userInfo) => {
  try {
    localStorage.setItem('user', JSON.stringify(userInfo));
  } catch (error) {
    console.error('保存用户信息失败:', error);
  }
};

/**
 * 清除用户信息
 */
export const clearUserInfo = () => {
  try {
    localStorage.removeItem('user');
  } catch (error) {
    console.error('清除用户信息失败:', error);
  }
};

/**
 * 获取认证 token
 * @returns {string} - token，获取失败时返回空字符串
 */
export const getAuthToken = () => {
  try {
    return localStorage.getItem('token') || '';
  } catch (error) {
    console.error('获取 token 失败:', error);
    return '';
  }
};

/**
 * 设置认证 token
 * @param {string} token - 认证 token
 */
export const setAuthToken = (token) => {
  try {
    localStorage.setItem('token', token);
  } catch (error) {
    console.error('设置 token 失败:', error);
  }
};

/**
 * 清除认证 token
 */
export const clearAuthToken = () => {
  try {
    localStorage.removeItem('token');
  } catch (error) {
    console.error('清除 token 失败:', error);
  }
};

/**
 * 清除所有认证相关信息
 */
export const clearAuthData = () => {
  clearUserInfo();
  clearAuthToken();
};

/**
 * 检查用户是否已登录
 * @returns {boolean} - 是否已登录
 */
export const isLoggedIn = () => {
  const userInfo = getUserInfo();
  const token = getAuthToken();
  return !!(userInfo && userInfo.id && token);
};