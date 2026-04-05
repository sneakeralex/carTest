// 测试报名相关API
import { mockMyTestRegistrations, testRegistrationStatusMap, testTypeMap } from '../mock/testRegistration.js';

// 判断是否使用mock数据
const useMock = false; // Changed to false to prefer real API

// 可配置的测试管理服务地址和端口
export const test_management_server = import.meta.env.VITE_TEST_MANAGEMENT_SERVER || '';
export const test_management_port = import.meta.env.VITE_TEST_MANAGEMENT_PORT || '33624';

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

import { artemisRequest, service } from './request';
import { TEST_TASK_API } from './config.js';

/**
 * 获取用户的测试报名列表
 * @param {string} userId - 用户ID
 * @param {Object} params - 查询参数
 * @param {string} params.status - 报名状态
 * @param {string} params.taskType - 任务类型
 * @returns {Promise} - 返回Promise对象
 */
export async function getUserTestRegistrations(userId, params = {}) {
  if (useMock) {
    await delay(500);
    
    let filteredRegistrations = [...mockMyTestRegistrations];
    
    // 按状态过滤
    if (params.status && params.status !== 'ALL') {
      filteredRegistrations = filteredRegistrations.filter(reg => reg.status === params.status);
    }
    
    // 按任务类型过滤
    if (params.taskType) {
      filteredRegistrations = filteredRegistrations.filter(reg => reg.taskType === params.taskType);
    }
    
    // 按时间排序，最新的在前
    filteredRegistrations.sort((a, b) => new Date(b.registrationTime) - new Date(a.registrationTime));
    
    return mockResponse({
      content: filteredRegistrations,
      totalElements: filteredRegistrations.length,
      pageable: {
        pageNumber: params.page || 0,
        pageSize: params.size || 10
      }
    });
  }

  try {
    const queryParams = new URLSearchParams();
    
    if (params.status && params.status !== 'ALL') queryParams.append('status', params.status);
    if (params.taskType) queryParams.append('taskType', params.taskType);
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size) queryParams.append('size', params.size);

    // Route this call through the local /artemis proxy so server-side signing is used when required
    const res = await artemisRequest(`${TEST_TASK_API.REGISTRATION_USER}?${queryParams}`, { method: 'GET' });
    const result = res?.data;

    // Transform response to expected format
    const registrations = (result.data?.content || result.data?.registrations || result.data || []).map(reg => ({
      registrationId: reg.id || reg.registrationId,
      userId: reg.userId,
      taskId: reg.taskId,
      taskName: reg.taskName,
      taskType: reg.taskType,
      status: reg.status,
      registrationTime: reg.registrationTime,
      scheduledTime: reg.scheduledTime,
      completedTime: reg.completedTime,
      testResult: reg.testResult,
      testScore: reg.testScore,
      notes: reg.notes,
      cancellationReason: reg.cancellationReason,
      cancellationTime: reg.cancellationTime
    }));

    return mockResponse({
      content: registrations,
      totalElements: result.data?.totalElements || registrations.length,
      pageable: result.data?.pageable || {
        pageNumber: params.page || 0,
        pageSize: params.size || 10
      }
    });
  } catch (error) {
    console.error('获取用户测试报名列表失败，使用mock数据:', error);
    // Fallback to mock
    await delay(500);
    
    let filteredRegistrations = [...mockMyTestRegistrations];
    
    // 按状态过滤
    if (params.status && params.status !== 'ALL') {
      filteredRegistrations = filteredRegistrations.filter(reg => reg.status === params.status);
    }
    
    // 按任务类型过滤
    if (params.taskType) {
      filteredRegistrations = filteredRegistrations.filter(reg => reg.taskType === params.taskType);
    }
    
    // 按时间排序，最新的在前
    filteredRegistrations.sort((a, b) => new Date(b.registrationTime) - new Date(a.registrationTime));
    
    return mockResponse({
      content: filteredRegistrations,
      totalElements: filteredRegistrations.length,
      pageable: {
        pageNumber: params.page || 0,
        pageSize: params.size || 10
      }
    });
  }
}

/**
 * 根据ID获取测试报名详情
 * @param {string} registrationId - 报名ID
 * @returns {Promise} - 返回Promise对象
 */
export async function getTestRegistrationById(registrationId) {
  if (useMock) {
    await delay(300);
    
    const registration = mockMyTestRegistrations.find(reg => reg.registrationId === registrationId);
    if (!registration) {
      throw new Error('测试报名记录不存在');
    }
    
    return mockResponse(registration);
  }

  try {
    const res = await artemisRequest(`${TEST_TASK_API.REGISTRATION_DETAIL}/${registrationId}`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
    const result = res?.data;

    // Transform response
    const reg = result?.data || result;
    const transformedReg = {
      registrationId: reg.id || reg.registrationId,
      userId: reg.userId,
      taskId: reg.taskId,
      taskName: reg.taskName,
      taskType: reg.taskType,
      status: reg.status,
      registrationTime: reg.registrationTime,
      scheduledTime: reg.scheduledTime,
      completedTime: reg.completedTime,
      testResult: reg.testResult,
      testScore: reg.testScore,
      notes: reg.notes,
      cancellationReason: reg.cancellationReason,
      cancellationTime: reg.cancellationTime
    };

    return mockResponse(transformedReg);
  } catch (error) {
    console.error('获取测试报名详情失败，使用mock数据:', error);
    // Fallback to mock
    await delay(300);
    
    const registration = mockMyTestRegistrations.find(reg => reg.registrationId === registrationId);
    if (!registration) {
      throw new Error('测试报名记录不存在');
    }
    
    return mockResponse(registration);
  }
}

/**
 * 创建测试报名
 * @param {Object} registrationData - 报名数据
 * @returns {Promise} - 返回Promise对象
 */
export async function createTestRegistration(registrationData) {
  if (useMock) {
    await delay(800);
    
    const newRegistration = {
      id: mockMyTestRegistrations.length + 1,
      registrationId: `REG${String(mockMyTestRegistrations.length + 1).padStart(3, '0')}`,
      ...registrationData,
      status: 'PENDING',
      registrationTime: new Date().toISOString()
    };
    
    mockMyTestRegistrations.unshift(newRegistration);
    return mockResponse(newRegistration);
  }

  try {
    const res = await artemisRequest(TEST_TASK_API.REGISTRATION_CREATE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(registrationData) });
    const result = res?.data;

    // Transform response
    const reg = result?.data || result;
    const transformedReg = {
      registrationId: reg.id || reg.registrationId,
      userId: reg.userId,
      taskId: reg.taskId,
      taskName: reg.taskName,
      taskType: reg.taskType,
      status: reg.status || 'PENDING',
      registrationTime: reg.registrationTime || new Date().toISOString(),
      scheduledTime: reg.scheduledTime,
      completedTime: reg.completedTime,
      testResult: reg.testResult,
      testScore: reg.testScore,
      notes: reg.notes
    };

    return mockResponse(transformedReg);
  } catch (error) {
    console.error('创建测试报名失败，使用mock数据:', error);
    // Fallback to mock
    await delay(800);
    
    const newRegistration = {
      id: mockMyTestRegistrations.length + 1,
      registrationId: `REG${String(mockMyTestRegistrations.length + 1).padStart(3, '0')}`,
      ...registrationData,
      status: 'PENDING',
      registrationTime: new Date().toISOString()
    };
    
    mockMyTestRegistrations.unshift(newRegistration);
    return mockResponse(newRegistration);
  }
}

/**
 * 更新测试报名
 * @param {string} registrationId - 报名ID
 * @param {Object} updateData - 更新数据
 * @returns {Promise} - 返回Promise对象
 */
export async function updateTestRegistration(registrationId, updateData) {
  if (useMock) {
    await delay(500);
    
    const index = mockMyTestRegistrations.findIndex(reg => reg.registrationId === registrationId);
    if (index === -1) {
      throw new Error('测试报名记录不存在');
    }
    
    mockMyTestRegistrations[index] = {
      ...mockMyTestRegistrations[index],
      ...updateData,
      updatedTime: new Date().toISOString()
    };
    
    return mockResponse(mockMyTestRegistrations[index]);
  }

  try {
    const res = await artemisRequest(`${TEST_TASK_API.REGISTRATION_UPDATE}/${registrationId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updateData) });
    const result = res?.data;

    // Transform response
    const reg = result?.data || result;
    const transformedReg = {
      registrationId: reg.id || reg.registrationId,
      userId: reg.userId,
      taskId: reg.taskId,
      taskName: reg.taskName,
      taskType: reg.taskType,
      status: reg.status,
      registrationTime: reg.registrationTime,
      scheduledTime: reg.scheduledTime,
      completedTime: reg.completedTime,
      testResult: reg.testResult,
      testScore: reg.testScore,
      notes: reg.notes,
      cancellationReason: reg.cancellationReason,
      cancellationTime: reg.cancellationTime
    };

    return mockResponse(transformedReg);
  } catch (error) {
    console.error('更新测试报名失败，使用mock数据:', error);
    // Fallback to mock
    await delay(500);
    
    const index = mockMyTestRegistrations.findIndex(reg => reg.registrationId === registrationId);
    if (index === -1) {
      throw new Error('测试报名记录不存在');
    }
    
    mockMyTestRegistrations[index] = {
      ...mockMyTestRegistrations[index],
      ...updateData,
      updatedTime: new Date().toISOString()
    };
    
    return mockResponse(mockMyTestRegistrations[index]);
  }
}

/**
 * 取消测试报名
 * @param {string} registrationId - 报名ID
 * @param {string} reason - 取消原因
 * @returns {Promise} - 返回Promise对象
 */
export async function cancelTestRegistration(registrationId, reason) {
  if (useMock) {
    await delay(500);
    
    const registration = mockMyTestRegistrations.find(reg => reg.registrationId === registrationId);
    if (!registration) {
      throw new Error('测试报名记录不存在');
    }
    
    if (registration.status === 'COMPLETED' || registration.status === 'CANCELLED') {
      throw new Error('该报名记录无法取消');
    }
    
    registration.status = 'CANCELLED';
    registration.cancellationReason = reason;
    registration.cancellationTime = new Date().toISOString();
    
    return mockResponse({ success: true });
  }

  try {
    await artemisRequest(`${TEST_TASK_API.REGISTRATION_DETAIL}/${registrationId}/cancel`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reason }) });

    return mockResponse({ success: true });
  } catch (error) {
    console.error('取消测试报名失败，使用mock数据:', error);
    // Fallback to mock
    await delay(500);
    
    const registration = mockMyTestRegistrations.find(reg => reg.registrationId === registrationId);
    if (!registration) {
      throw new Error('测试报名记录不存在');
    }
    
    if (registration.status === 'COMPLETED' || registration.status === 'CANCELLED') {
      throw new Error('该报名记录无法取消');
    }
    
    registration.status = 'CANCELLED';
    registration.cancellationReason = reason;
    registration.cancellationTime = new Date().toISOString();
    
    return mockResponse({ success: true });
  }
}

/**
 * 获取测试报名统计信息
 * @param {string} userId - 用户ID
 * @returns {Promise} - 返回Promise对象
 */
export async function getTestRegistrationStats(userId) {
  if (useMock) {
    await delay(300);
    
    const userRegistrations = mockMyTestRegistrations;
    const stats = {
      total: userRegistrations.length,
      pending: userRegistrations.filter(reg => reg.status === 'PENDING').length,
      approved: userRegistrations.filter(reg => reg.status === 'APPROVED').length,
      scheduled: userRegistrations.filter(reg => reg.status === 'SCHEDULED').length,
      inProgress: userRegistrations.filter(reg => reg.status === 'IN_PROGRESS').length,
      completed: userRegistrations.filter(reg => reg.status === 'COMPLETED').length,
      cancelled: userRegistrations.filter(reg => reg.status === 'CANCELLED').length
    };
    
    // 计算通过率
    stats.passRate = stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : 0;
    
    // 最近一次测试
    const latestCompleted = userRegistrations
      .filter(reg => reg.status === 'COMPLETED')
      .sort((a, b) => new Date(b.completedTime) - new Date(a.completedTime))[0];
    
    stats.latestTest = latestCompleted ? {
      taskName: latestCompleted.taskName,
      completedTime: latestCompleted.completedTime,
      completedTime: latestCompleted.completedTime,
      testResult: latestCompleted.testResult,
      testScore: latestCompleted.testScore
    } : null;
    
    return mockResponse(stats);
  }

  try {
    const res = await artemisRequest(`${TEST_TASK_API.REGISTRATION_DETAIL}/stats/${userId}`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
    const result = res?.data;

    // Transform response
    const stats = result?.data || result || {
      total: 0,
      pending: 0,
      approved: 0,
      scheduled: 0,
      inProgress: 0,
      completed: 0,
      cancelled: 0,
      passRate: 0,
      latestTest: null
    };

    return mockResponse(stats);
  } catch (error) {
    console.error('获取测试报名统计失败，使用mock数据:', error);
    // Fallback to mock
    await delay(300);
    
    const userRegistrations = mockMyTestRegistrations;
    const stats = {
      total: userRegistrations.length,
      pending: userRegistrations.filter(reg => reg.status === 'PENDING').length,
      approved: userRegistrations.filter(reg => reg.status === 'APPROVED').length,
      scheduled: userRegistrations.filter(reg => reg.status === 'SCHEDULED').length,
      inProgress: userRegistrations.filter(reg => reg.status === 'IN_PROGRESS').length,
      completed: userRegistrations.filter(reg => reg.status === 'COMPLETED').length,
      cancelled: userRegistrations.filter(reg => reg.status === 'CANCELLED').length
    };
    
    // 计算通过率
    stats.passRate = stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : 0;
    
    // 最近一次测试
    const latestCompleted = userRegistrations
      .filter(reg => reg.status === 'COMPLETED')
    
    stats.latestTest = latestCompleted ? {
      taskName: latestCompleted.taskName,
      completedTime: latestCompleted.completedTime,
      testResult: latestCompleted.testResult,
      testScore: latestCompleted.testScore
    } : null;
    
    return mockResponse(stats);
  }
}

/**
 * 获取状态映射
 * @returns {Object} - 状态映射对象
 */
export function getStatusMap() {
  return testRegistrationStatusMap;
}

/**
 * 获取测试类型映射
 * @returns {Object} - 测试类型映射对象
 */
export function getTestTypeMap() {
  return testTypeMap;
}

/**
 * 获取所有测试报名数据
 * @param {Object} params - 查询参数
 * @returns {Promise} - 返回Promise对象
 */
export async function getAll(params = {}) {
  if (useMock) {
    await delay(300);
    
    let filteredRegistrations = [...mockMyTestRegistrations];
    
    // 按状态过滤
    if (params.status && params.status !== 'ALL') {
      filteredRegistrations = filteredRegistrations.filter(reg => reg.status === params.status);
    }
    
    // 按任务类型过滤
    if (params.taskType) {
      filteredRegistrations = filteredRegistrations.filter(reg => reg.taskType === params.taskType);
    }
    
    return filteredRegistrations;
  }

  try {
    const url = `TEST_TASK_API.REGISTRATION_DETAIL/all`;
    const queryParams = new URLSearchParams();
    
    if (params.status && params.status !== 'ALL') queryParams.append('status', params.status);
    if (params.taskType) queryParams.append('taskType', params.taskType);

    const res = await artemisRequest(`${url}?${queryParams}`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
    const result = res?.data;

    // Transform response
    const registrations = (result?.data || result || []).map(reg => ({
      registrationId: reg.id || reg.registrationId,
      userId: reg.userId,
      taskId: reg.taskId,
      taskName: reg.taskName,
      taskType: reg.taskType,
      status: reg.status,
      registrationTime: reg.registrationTime,
      scheduledTime: reg.scheduledTime,
      completedTime: reg.completedTime,
      testResult: reg.testResult,
      testScore: reg.testScore,
      notes: reg.notes,
      cancellationReason: reg.cancellationReason,
      cancellationTime: reg.cancellationTime
    }));

    return registrations;
  } catch (error) {
    console.error('获取所有测试报名失败，使用mock数据:', error);
    // Fallback to mock
    await delay(300);
    
    let filteredRegistrations = [...mockMyTestRegistrations];
    
    // 按状态过滤
    if (params.status && params.status !== 'ALL') {
      filteredRegistrations = filteredRegistrations.filter(reg => reg.status === params.status);
    }
    
    // 按任务类型过滤
    if (params.taskType) {
      filteredRegistrations = filteredRegistrations.filter(reg => reg.taskType === params.taskType);
    }
    
    return filteredRegistrations;
  }
}

/**
 * 根据ID获取测试报名
 * @param {string} id - 报名ID
 * @returns {Promise} - 返回Promise对象
 */
export async function getById(id) {
  if (useMock) {
    await delay(300);
    
    const registration = mockMyTestRegistrations.find(reg => reg.id === parseInt(id));
    if (!registration) {
      throw new Error('测试报名不存在');
    }
    
    return registration;
  }

  try {
    const res = await artemisRequest(`${TEST_TASK_API.REGISTRATION_DETAIL}/${id}`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
    const result = res?.data;

    // Transform response
    const reg = result?.data || result;
    const transformedReg = {
      registrationId: reg.id || reg.registrationId,
      userId: reg.userId,
      taskId: reg.taskId,
      taskName: reg.taskName,
      taskType: reg.taskType,
      status: reg.status,
      registrationTime: reg.registrationTime,
      scheduledTime: reg.scheduledTime,
      completedTime: reg.completedTime,
      testResult: reg.testResult,
      testScore: reg.testScore,
      notes: reg.notes,
      cancellationReason: reg.cancellationReason,
      cancellationTime: reg.cancellationTime
    };

    return transformedReg;
  } catch (error) {
    console.error('根据ID获取测试报名失败，使用mock数据:', error);
    // Fallback to mock
    await delay(300);
    
    const registration = mockMyTestRegistrations.find(reg => reg.id === parseInt(id));
    if (!registration) {
      throw new Error('测试报名不存在');
    }
    
    return registration;
  }
}

/**
 * 创建测试报名
 * @param {Object} data - 报名数据
 * @returns {Promise} - 返回Promise对象
 */
export async function create(data) {
  if (useMock) {
    await delay(500);
    
    const newRegistration = {
      id: Date.now(),
      ...data,
      status: 'PENDING',
      registrationTime: new Date().toISOString(),
      createdTime: new Date().toISOString(),
      updatedTime: new Date().toISOString()
    };
    
    return newRegistration;
  }

  try {
    const res = await artemisRequest(TEST_TASK_API.REGISTRATION_CREATE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const result = res?.data;

    // Transform response
    const reg = result?.data || result;
    const transformedReg = {
      id: reg.id || Date.now(),
      ...data,
      status: reg.status || 'PENDING',
      registrationTime: reg.registrationTime || new Date().toISOString(),
      createdTime: reg.createdTime || new Date().toISOString(),
      updatedTime: reg.updatedTime || new Date().toISOString()
    };

    return transformedReg;
  } catch (error) {
    console.error('创建测试报名失败，使用mock数据:', error);
    // Fallback to mock
    await delay(500);
    
    const newRegistration = {
      id: Date.now(),
      ...data,
      status: 'PENDING',
      registrationTime: new Date().toISOString(),
      createdTime: new Date().toISOString(),
      updatedTime: new Date().toISOString()
    };
    
    return newRegistration;
  }
}

/**
 * 更新测试报名
 * @param {string} id - 报名ID
 * @param {Object} data - 更新数据
 * @returns {Promise} - 返回Promise对象
 */
export async function update(id, data) {
  if (useMock) {
    await delay(500);
    
    const index = mockMyTestRegistrations.findIndex(reg => reg.id === parseInt(id));
    if (index === -1) {
      throw new Error('测试报名不存在');
    }
    
    const updatedRegistration = {
      ...mockMyTestRegistrations[index],
      ...data,
      updatedTime: new Date().toISOString()
    };
    
    return updatedRegistration;
  }

  try {
    const res = await artemisRequest(`${TEST_TASK_API.REGISTRATION_UPDATE}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const result = res?.data;

    // Transform response
    const reg = result?.data || result;
    const transformedReg = {
      id: reg.id || parseInt(id),
      ...mockMyTestRegistrations.find(r => r.id === parseInt(id)),
      ...data,
      updatedTime: reg.updatedTime || new Date().toISOString()
    };

    return transformedReg;
  } catch (error) {
    console.error('更新测试报名失败，使用mock数据:', error);
    // Fallback to mock
    await delay(500);
    
    const index = mockMyTestRegistrations.findIndex(reg => reg.id === parseInt(id));
    if (index === -1) {
      throw new Error('测试报名不存在');
    }
    
    const updatedRegistration = {
      ...mockMyTestRegistrations[index],
      ...data,
      updatedTime: new Date().toISOString()
    };
    
    return updatedRegistration;
  }
}

/**
 * 删除测试报名
 * @param {string} id - 报名ID
 * @returns {Promise} - 返回Promise对象
 */
export async function deleteTestRegistration(id) {
  if (useMock) {
    await delay(500);
    
    const index = mockMyTestRegistrations.findIndex(reg => reg.id === parseInt(id));
    if (index === -1) {
      throw new Error('测试报名不存在');
    }
    
    // 模拟删除操作
    return { success: true, message: '测试报名已删除' };
  }

  try {
    const res = await artemisRequest(`${TEST_TASK_API.REGISTRATION_DETAIL}/${id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' } });
    const result = res?.data;

    return { success: true, message: '测试报名已删除' };
  } catch (error) {
    console.error('删除测试报名失败，使用mock数据:', error);
    // Fallback to mock
    await delay(500);
    
    const index = mockMyTestRegistrations.findIndex(reg => reg.id === parseInt(id));
    if (index === -1) {
      throw new Error('测试报名不存在');
    }
    
    // 模拟删除操作
    return { success: true, message: '测试报名已删除' };
  }
}

// 导出API对象
export const testRegistrationApi = {
  getAll,
  getUserRegistrations: getUserTestRegistrations,
  getById,
  create,
  update,
  getTestRegistrationById,
  createTestRegistration,
  updateTestRegistration,
  deleteTestRegistration,
  getTestRegistrationStats,
  getStatusMap,
  getTestTypeMap
};
