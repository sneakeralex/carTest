import request from './request';

/**
 * 用户登录
 * @param {string} username - 用户名
 * @param {string} password - 密码
 * @returns {Promise} - 返回Promise对象
 */
export function login(username, password) {
  return request({
    url: '/auth/login',
    method: 'post',
    data: {
      username,
      password
    }
  });
}

/**
 * 用户注册
 * @param {Object} userData - 用户数据
 * @param {string} userData.username - 用户名
 * @param {string} userData.password - 密码
 * @param {string} userData.name - 姓名
 * @param {string} userData.phone - 手机号
 * @param {string} userData.email - 邮箱
 * @returns {Promise} - 返回Promise对象
 */
export function register(userData) {
  return request({
    url: '/auth/register',
    method: 'post',
    data: userData
  });
}

/**
 * 获取当前用户信息
 * @returns {Promise} - 返回Promise对象
 */
export function getUserInfo() {
  return request({
    url: '/auth/user',
    method: 'get'
  });
}

/**
 * 修改用户信息
 * @param {Object} userData - 用户数据
 * @returns {Promise} - 返回Promise对象
 */
export function updateUserInfo(userData) {
  return request({
    url: '/auth/user',
    method: 'put',
    data: userData
  });
}

/**
 * 修改密码
 * @param {Object} passwordData - 密码数据
 * @param {string} passwordData.oldPassword - 旧密码
 * @param {string} passwordData.newPassword - 新密码
 * @returns {Promise} - 返回Promise对象
 */
export function changePassword(passwordData) {
  return request({
    url: '/auth/password',
    method: 'put',
    data: passwordData
  });
}