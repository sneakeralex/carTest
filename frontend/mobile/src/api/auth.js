import { mockUsers, mockAuth, DEFAULT_CREDENTIALS } from '../mock/auth.js';
import CryptoJS from 'crypto-js';

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
const storedUser = typeof localStorage !== 'undefined' ? localStorage.getItem('user') : null;
if (storedUser) {
  try {
    mockAuth.currentUser = JSON.parse(storedUser);
    mockAuth.token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
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

    const response = await fetch('/api/artemis/api/manage/auth/v2/manage/userService/changePassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(changeData)
    });

    const result = await response.json();
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
 * @returns {Promise} - 返回Promise对象
 */
export async function login(phoneNumber, password) {
  // 验证手机号格式
  if (!/^1[3-9]\d{9}$/.test(phoneNumber)) {
    throw new Error('请输入正确的手机号');
  }

  // 验证密码规则：默认密码为手机号后四位
  const expectedPassword = phoneNumber.slice(-4);
  if (password !== expectedPassword) {
    throw new Error('密码错误，默认密码为手机号后四位');
  }

  try {
    // 调用staff API验证手机号是否存在
    const { getStaffList } = await import('../api/staff.js');
    const staffResponse = await getStaffList();
    const staffList = staffResponse.data || [];

    // 查找匹配的员工
    const matchedStaff = staffList.find(staff => staff.phone === phoneNumber);

    if (!matchedStaff) {
      throw new Error('该手机号未注册，请联系管理员');
    }

    // 登录成功，返回用户信息
    const userInfo = {
      userId: matchedStaff.userId || matchedStaff.id,
      username: matchedStaff.name,
      phone: matchedStaff.phone,
      department: matchedStaff.department,
      position: matchedStaff.position,
      type: matchedStaff.type,
      ...matchedStaff // 保留其他字段
    };

    const token = 'staff-jwt-token-' + Date.now() + '-' + matchedStaff.userId;

    return mockResponse({
      token: token,
      user: userInfo
    });

  } catch (error) {
    console.error('登录失败:', error);
    throw error;
  }
}

/**
 * 用户注册
 * @param {Object} userData - 用户数据
 * @returns {Promise} - 返回Promise对象
 */
export async function register(userData) {
  const salt = generateUUID();
  const password = userData.password || 'Abc123++';
  const encryptedPassword = encryptPassword(password, salt);
  
  const userObject = {
    username: userData.username,
    groupId: 'd1',
    groupAuth: '0',
    remark: '备注',
    expireTime: '2024-12-15T00:00:05.000+08:00',
    password: encryptedPassword,
    salt: salt,
    extendMap: {
      id: generateUUID(),
      principalId: generateUUID(),
      principalType: 'USER',
      extFieldKey: 'department',
      extFieldValue: 'huodong',
      tenantIndexCode: '111'
    }
  };
  
  const response = await fetch('/api/artemis/api/manage/auth/v2/manage/userService/saveTripartiteUsers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify([userObject])
  });
  
  const result = await response.json();
  if (result.code !== '0') {
    throw new Error(result.msg || '注册失败');
  }
  return result;
}

/**
 * 获取当前用户信息
 * @param {string} token - 访问token（可选）
 * @returns {Promise} - 返回Promise对象
 */
export async function getUserInfo(token = null) {
  try {
    // Try to get user info from real API
    const headers = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('/api/artemis/api/manage/auth/v2/manage/userService/getUserInfo', {
      method: 'GET',
      headers
    });

    const result = await response.json();
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
      updatedAt: result.data?.updateTime
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
export async function getAccessToken(userCode = 'admin', service = 'https://cartest.douwifi.cn', language = 'zh_CN') {
  try {
    const response = await fetch(`/v1/tgt/login?userCode=${encodeURIComponent(userCode)}&service=${encodeURIComponent(service)}&language=${encodeURIComponent(language)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
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

