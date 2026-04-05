import { mockUsers, mockAuth, DEFAULT_CREDENTIALS } from '../mock/auth.js';
import CryptoJS from 'crypto-js';
import { artemisRequest } from './request';
import { getStaffList } from './staff.js';
import { getItem } from '../utils/storage.js';
import { AUTH_API } from './config.js';

// 模拟API响应延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟API响应格式
const mockResponse = (data) => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {}
});

// 从localStorage恢复mockAuth状态
const storedUser = getItem('user', {});
const storedToken = getItem('token', '');
if (Object.keys(storedUser).length > 0) {
  try {
    mockAuth.currentUser = storedUser;
    mockAuth.token = storedToken;
  } catch (error) {
    console.error('恢复用户状态失败:', error);
  }
}

// Helper functions for encryption
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function encryptPassword(password, salt) {
  const plainPasswordHash = CryptoJS.SHA256(password + salt).toString();
  const secretKey = CryptoJS.SHA256(salt).toString().substring(0, 16);
  const iv = CryptoJS.SHA256(secretKey).toString().substring(0, 16);
  const encrypted = CryptoJS.AES.encrypt(plainPasswordHash, secretKey, { iv: iv }).toString();
  return encrypted;
}

/**
 * 修改密码
 * @param {Object} passwordData - 密码数据
 * @returns {Promise} - 返回Promise对象
 */
export async function changePassword(passwordData) {
  try {
    // Generate salt and encrypt passwords
    const salt = generateUUID();
    const encryptedOldPassword = encryptPassword(passwordData.oldPassword, salt);
    const encryptedNewPassword = encryptPassword(passwordData.newPassword, salt);

    const changeData = {
      oldPassword: encryptedOldPassword,
      newPassword: encryptedNewPassword,
      salt: salt
    };

    const res = await artemisRequest(AUTH_API.CHANGE_PASSWORD, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(changeData)
    });
    const result = res?.data;
    if (result.code !== 200 && result.code !== '0') {
      throw new Error(result.msg || '修改密码失败');
    }

    return {
      data: { success: true },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('修改密码失败:', error);
    // Fallback to mock implementation
    await delay(800);
    if (!mockAuth.currentUser) {
      throw new Error('未登录');
    }
    
    // Validate old password
    if (passwordData.oldPassword !== DEFAULT_CREDENTIALS.password) {
      throw new Error('旧密码错误');
    }
    
    // In actual application, should update password
    return mockResponse({ success: true });
  }
}

/**
 * 用户登录
 * @param {string} phoneNumber - 手机号
 * @param {string} password - 密码
 * @param {string} verificationCode - 验证码
 * @returns {Promise} - 返回Promise对象
 */
export async function login(phoneNumber, password, verificationCode) {
  // 验证手机号格式
  if (!/^1[3-9]\d{9}$/.test(phoneNumber)) {
    throw new Error('请输入正确的手机号');
  }

  const payload = { phone: phoneNumber, password };
  
  // 如果提供了验证码，添加到 payload 中
  if (verificationCode) {
    payload.verificationCode = verificationCode;
  }

  try {
    // Use artemisRequest to route through local proxy and include JSON content-type
    const res = await artemisRequest(AUTH_API.LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const body = res?.data || res;
    if (!body) throw new Error('空响应');
    if (body.error) throw new Error(body.error);
    // If upstream doesn't return a user, treat as credential error
    if (!body.user) throw new Error('用户名或密码错误，请再试');

    return { data: body, status: 200 };
  } catch (err) {
    // Map common upstream 404/Not Found or 401 Unauthorized to credential error so UI shows friendly message
    const status = err?.meta?.status || err?.status || null;
    const msg = (err && err.message) ? String(err.message) : '';

    if (status === 404 || status === 401 || /401|404|Unauthorized|Not Found|未找到|找不到|未授权/.test(msg)) {
      throw new Error('用户名或密码错误，请再试');
    }

    // For other errors, propagate a readable message
    throw new Error(msg || '登录失败，请重试');
  }
}

/**
 * 用户注册
 * @param {Object} userData - 用户数据
 * @returns {Promise} - 返回Promise对象
 */
export async function register(userData) {
  // Prepare payload for local staff-save API
  const payload = {
    enterpriseId: userData.enterpriseId || 33,
    staffName: userData.username || userData.staffName || '',
    gender: userData.gender || '0',
    phone: userData.phone || '',
    identityType: userData.identityType || '02',
    address: userData.address || '',
    department: userData.department || userData.extendMap?.department || '未指定',
    password: userData.password || 'Abc123++',
    remark: userData.remark || ''
  };

  // If this is an update operation and an id is provided, include it; for new registrations do not send id
  if (userData && (userData.id !== undefined && userData.id !== null && userData.id !== '')) {
    payload.id = userData.id;
  }

  try {
    // Route both duplicate-check and save through the client-side artemisRequest helper
    // so the actual AK/SK signing happens on the server-side proxy.
    const checkBody = { phone: payload.phone, pageSize: 10000, pageNum: 1 };
    const checkResp = await artemisRequest(AUTH_API.LIST, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(checkBody)
    });

    const checkResult = checkResp?.data || checkResp;
    if (!checkResult) throw new Error('检验手机号时收到空响应');
    const list = Array.isArray(checkResult.data) ? checkResult.data : (checkResult.data?.list || checkResult.list || []);
    if (Array.isArray(list) && list.some(s => (s.phone || '').toString() === (payload.phone || '').toString())) {
      throw new Error('手机号已存在，请勿重复注册');
    }

    const saveResp = await artemisRequest(AUTH_API.SAVE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': '*/*' },
      body: JSON.stringify(payload)
    });

    const result = saveResp?.data || saveResp;
    if (!result) throw new Error('空响应');
    if (result.code !== '0' && result.code !== 0) {
      throw new Error(result.msg || '注册失败');
    }

    return result;
  } catch (error) {
    // If this is a known duplicate phone error, rethrow so UI shows message
    console.error('注册到后端失败或校验失败:', error);
    if (error && error.message && error.message.includes('手机号已存在')) {
      throw error;
    }
    // For any other failure, do not return a success response. Propagate error to caller/UI.
    throw new Error(error?.message || '注册失败');
  }
}

/**
 * 获取当前用户信息
 * @param {string} token - 访问token（可选）
 * @returns {Promise} - 返回Promise对象
 */
export async function getUserInfo(token = null) {
  try {
    // 首先优先使用本地 storage 中保存的用户信息（避免对不存在的后端路径调用）
    const local = getItem('user', {});
    if (local && Object.keys(local).length > 0) {
      // 标准化返回格式
      const userInfo = {
        userId: local.userId || local.id,
        username: local.username || local.name || local.displayName,
        name: local.name || local.displayName || local.username,
        email: local.email,
        phone: local.phone,
        avatar: local.avatar,
        role: local.role || 'USER',
        department: local.department,
        status: local.status || 'ACTIVE',
        lastLogin: local.lastLogin,
        createdAt: local.createdAt,
        updatedAt: local.updatedAt,
        // keep original
        ...local
      };

      return {
        data: userInfo,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {}
      };
    }

    // 如果本地没有可用用户信息，再尝试调用后端（仅作为次选项）
    const headers = { 'Content-Type': 'application/json', 'Accept': '*/*' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await artemisRequest(AUTH_API.GET_USER_INFO, { method: 'GET', headers });
    const result = res?.data;
    if (result.code !== 200 && result.code !== '0') {
      throw new Error(result.msg || '获取用户信息失败');
    }

    // Transform API response to expected format
    const userInfo = {
      userId: result.data?.userId || result.data?.id,
      username: result.data?.username || result.data?.name,
      name: result.data?.name || result.data?.displayName,
      email: result.data?.email,
      phone: result.data?.phone,
      avatar: result.data?.avatar,
      role: result.data?.role || 'USER',
      department: result.data?.department,
      status: result.data?.status || 'ACTIVE',
      lastLogin: result.data?.lastLoginTime,
      createdAt: result.data?.createTime,
      updatedAt: result.data?.updateTime,
      ...result.data
    };

    return {
      data: userInfo,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('获取用户信息失败:', error);
    // Fallback to mock data if API fails
    await delay(300);
    if (!mockAuth.currentUser) {
      throw new Error('未登录');
    }
    return mockResponse(mockAuth.currentUser);
  }
}

/**
 * 修改用户信息
 * @param {Object} userData - 用户数据
 * @returns {Promise} - 返回Promise对象
 */
export async function updateUserInfo(userData) {
  await delay(500);
  if (!mockAuth.currentUser) {
    throw new Error('未登录');
  }
  
  const index = mockUsers.findIndex(u => u.userId === mockAuth.currentUser.userId);
  if (index === -1) {
    throw new Error('用户不存在');
  }
  
  mockUsers[index] = {
    ...mockUsers[index],
    ...userData,
    updatedAt: new Date().toISOString()
  };
  
  mockAuth.currentUser = mockUsers[index];
  return mockResponse(mockUsers[index]);
}

/**
 * 获取用户接口访问token
 * @param {string} userCode - 用户名
 * @param {string} service - 服务URL
 * @param {string} language - 语言
 * @returns {Promise} - 返回Promise对象，包含token
 */
export async function getAccessToken(userCode = 'admin', service = '', language = 'zh_CN') {
  try {
    const query = `userCode=${encodeURIComponent(userCode)}&service=${encodeURIComponent(service)}&language=${encodeURIComponent(language)}`;
    const res = await artemisRequest(`${AUTH_API.GET_ACCESS_TOKEN}?${query}`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
    const result = res?.data || res;

    if (result.code !== 200 && result.code !== '0') {
      throw new Error(result.msg || '获取token失败');
    }

    // 假设响应中包含token
    const token = result.token || result.tgt || result.ticket || result.data?.token || result.data?.tgt;
    if (!token) {
      throw new Error('响应中未找到token');
    }

    return {
      data: { token },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('获取token失败:', error);
    // Fallback to mock token
    await delay(300);
    return mockResponse({ token: 'mock-token-' + Date.now() });
  }
}

/**
 * 发送验证码
 * @param {string} phoneNumber - 手机号
 * @returns {Promise} - 返回Promise对象
 */
export async function sendVerificationCode(phoneNumber) {
  // 验证手机号格式
  if (!/^1[3-9]\d{9}$/.test(phoneNumber)) {
    throw new Error('请输入正确的手机号');
  }

  try {
    const res = await artemisRequest(AUTH_API.SEND_CODE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: phoneNumber })
    });

    const result = res?.data || res;
    if (result.code !== 200 && result.code !== '0') {
      throw new Error(result.msg || '发送验证码失败');
    }

    return {
      data: { success: true },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('发送验证码失败:', error);
    // Fallback to mock implementation
    await delay(500);
    console.log('模拟发送验证码到:', phoneNumber);
    console.log('模拟验证码:', '123456');
    return mockResponse({ success: true });
  }
}

/**
 * 验证验证码
 * @param {string} phoneNumber - 手机号
 * @param {string} verificationCode - 验证码
 * @returns {Promise} - 返回Promise对象
 */
export async function verifyVerificationCode(phoneNumber, verificationCode) {
  // 验证手机号格式
  if (!/^1[3-9]\d{9}$/.test(phoneNumber)) {
    throw new Error('请输入正确的手机号');
  }

  // 验证验证码格式
  if (!/^\d{6}$/.test(verificationCode)) {
    throw new Error('请输入6位数字验证码');
  }

  try {
    // 验证验证码
    const verifyRes = await artemisRequest(AUTH_API.VERIFY_CODE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: phoneNumber, code: verificationCode })
    });

    const verifyBody = verifyRes?.data || verifyRes;
    if (!verifyBody || verifyBody.code !== 0) {
      throw new Error(verifyBody?.message || '验证码验证失败');
    }

    return {
      data: { success: true },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (err) {
    // Map common upstream 404/Not Found or 401 Unauthorized to credential error so UI shows friendly message
    const status = err?.meta?.status || err?.status || null;
    const msg = (err && err.message) ? String(err.message) : '';

    if (status === 404 || status === 401 || /401|404|Unauthorized|Not Found|未找到|找不到|未授权/.test(msg)) {
      throw new Error('验证码错误，请再试');
    }

    // For other errors, propagate a readable message
    throw new Error(msg || '验证码验证失败');
  }
}

/**
 * 验证码登录
 * @param {string} phoneNumber - 手机号
 * @param {string} verificationCode - 验证码
 * @returns {Promise} - 返回Promise对象
 */
export async function loginWithVerificationCode(phoneNumber, verificationCode) {
  // 验证手机号格式
  if (!/^1[3-9]\d{9}$/.test(phoneNumber)) {
    throw new Error('请输入正确的手机号');
  }

  // 验证验证码格式
  if (!/^\d{6}$/.test(verificationCode)) {
    throw new Error('请输入6位数字验证码');
  }

  try {
    // 先验证验证码
    await verifyVerificationCode(phoneNumber, verificationCode);

    // 验证码验证成功后，调用登录接口
    const res = await artemisRequest(AUTH_API.LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: phoneNumber, verification_code: verificationCode })
    });

    const body = res?.data || res;
    if (!body) throw new Error('空响应');
    if (body.error) throw new Error(body.error);
    // If upstream doesn't return a user, treat as credential error
    if (!body.user) throw new Error('登录失败，请再试');

    return { data: body, status: 200 };
  } catch (err) {
    // Map common upstream 404/Not Found or 401 Unauthorized to credential error so UI shows friendly message
    const status = err?.meta?.status || err?.status || null;
    const msg = (err && err.message) ? String(err.message) : '';

    if (status === 404 || status === 401 || /401|404|Unauthorized|Not Found|未找到|找不到|未授权/.test(msg)) {
      throw new Error('验证码错误，请再试');
    }

    // For other errors, propagate a readable message
    throw new Error(msg || '登录失败，请重试');
  }
}

