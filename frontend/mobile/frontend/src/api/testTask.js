import { mockTestTasks, mockTestRegistrations, mockTestStats } from '../mock/testTask.js';
import { artemisRequest } from './request.js';
import { TEST_TASK_API } from './config.js';

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

/**
 * 获取测试任务列表
 * @param {Object} params - 查询参数
 * @param {string} params.taskType - 任务类型
 * @param {string} params.difficulty - 难度等级
 * @param {number} params.page - 页码
 * @param {number} params.size - 每页数量
 * @returns {Promise} - 返回Promise对象
 */
export async function getTestTasks(params = {}) {
  try {
    const queryParams = new URLSearchParams();
    if (params.taskType) queryParams.append('taskType', params.taskType);
    if (params.difficulty) queryParams.append('difficulty', params.difficulty);
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size) queryParams.append('size', params.size);

    const res = await artemisRequest(`${TEST_TASK_API.LIST}?${queryParams}`, { method: 'GET' });

    const result = res?.data;

    console.log('获取测试任务列表原始API响应:', JSON.stringify(result, null, 2));

    // Transform response to expected format
    const tasks = (result.data?.list || result.data?.content || result.data || []).map(task => ({
      taskId: task.taskId || task.id,
      title: task.title || task.name,
      description: task.description,
      taskType: task.taskType,
      difficulty: task.difficulty,
      duration: task.duration,
      maxParticipants: task.maxParticipants,
      currentParticipants: task.currentParticipants,
      status: task.status,
      startDate: task.startDate,
      endDate: task.endDate,
      createdAt: task.createdAt || task.createTime,
      updatedAt: task.updatedAt || task.updateTime
    }));

    return {
      data: {
        content: tasks,
        pageable: {
          pageNumber: result.data?.pageNo || result.data?.pageable?.pageNumber || params.page || 0,
          pageSize: result.data?.pageSize || result.data?.pageable?.pageSize || params.size || 10,
          total: result.data?.total || result.data?.pageable?.total || tasks.length
        }
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    // 静默处理错误，直接返回mock数据
    // console.error('获取测试任务列表失败:', error);
    await delay(500);
    return mockResponse(mockTestTasks);
  }
}

/**
 * 根据ID获取测试任务详情
 * @param {string} taskId - 任务ID
 * @returns {Promise} - 返回Promise对象
 */
export async function getTestTaskById(taskId) {
  try {
    const res = await artemisRequest(`${TEST_TASK_API.DETAIL}/${taskId}`, { method: 'GET' });

    const result = res?.data;

    console.log('获取测试任务详情原始API响应:', JSON.stringify(result, null, 2));

    // Transform response to expected format
    const task = result.data || result;
    const transformedTask = {
      taskId: task.taskId || task.id,
      title: task.title || task.name,
      description: task.description,
      taskType: task.taskType,
      difficulty: task.difficulty,
      duration: task.duration,
      maxParticipants: task.maxParticipants,
      currentParticipants: task.currentParticipants,
      status: task.status,
      startDate: task.startDate,
      endDate: task.endDate,
      createdAt: task.createdAt || task.createTime,
      updatedAt: task.updatedAt || task.updateTime,
      // Keep original fields for compatibility
      ...task
    };

    return {
      data: transformedTask,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('获取测试任务详情失败:', error);
    // Fallback to mock data
    await delay(300);
    const task = mockTestTasks.content.find(t => t.taskId === taskId);
    if (!task) {
      throw new Error('测试任务不存在');
    }
    return mockResponse(task);
  }
}

/**
 * 获取测试报名列表
 * @param {Object} params - 查询参数
 * @param {string} params.status - 报名状态
 * @param {number} params.page - 页码
 * @param {number} params.size - 每页数量
 * @returns {Promise} - 返回Promise对象
 */
export async function getTestRegistrations(params = {}) {
  try {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size) queryParams.append('size', params.size);

    const res = await artemisRequest(`${TEST_TASK_API.REGISTRATION_LIST}?${queryParams}`, { method: 'GET' });

    const result = res?.data;

    console.log('获取测试报名列表原始API响应:', JSON.stringify(result, null, 2));

    // Transform response to expected format
    const registrations = (result.data?.list || result.data?.content || result.data || []).map(reg => ({
      registrationId: reg.registrationId || reg.id,
      taskId: reg.taskId,
      taskTitle: reg.taskTitle || reg.taskName,
      userId: reg.userId,
      userName: reg.userName,
      status: reg.status,
      testDate: reg.testDate,
      result: reg.result,
      notes: reg.notes,
      createdAt: reg.createdAt || reg.createTime,
      updatedAt: reg.updatedAt || reg.updateTime
    }));

    return {
      data: {
        content: registrations,
        pageable: {
          pageNumber: result.data?.pageNo || result.data?.pageable?.pageNumber || params.page || 0,
          pageSize: result.data?.pageSize || result.data?.pageable?.pageSize || params.size || 10,
          total: result.data?.total || result.data?.pageable?.total || registrations.length
        }
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('获取测试报名列表失败:', error);
    // Fallback to mock data
    await delay(500);
    return mockResponse(mockTestRegistrations);
  }
}

/**
 * 根据ID获取测试报名详情
 * @param {string} registrationId - 报名ID
 * @returns {Promise} - 返回Promise对象
 */
export async function getTestRegistrationById(registrationId) {
  try {
    const res = await artemisRequest(`${TEST_TASK_API.REGISTRATION_DETAIL}/${registrationId}`, { method: 'GET' });

    const result = res?.data;

    console.log('获取测试报名详情原始API响应:', JSON.stringify(result, null, 2));

    // Transform response to expected format
    const reg = result.data || result;
    const transformedRegistration = {
      registrationId: reg.registrationId || reg.id,
      taskId: reg.taskId,
      taskTitle: reg.taskTitle || reg.taskName,
      userId: reg.userId,
      userName: reg.userName,
      status: reg.status,
      testDate: reg.testDate,
      result: reg.result,
      notes: reg.notes,
      createdAt: reg.createdAt || reg.createTime,
      updatedAt: reg.updatedAt || reg.updateTime,
      // Keep original fields for compatibility
      ...reg
    };

    return {
      data: transformedRegistration,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('获取测试报名详情失败:', error);
    // Fallback to mock data
    await delay(300);
    const registration = mockTestRegistrations.find(r => r.registrationId === registrationId);
    if (!registration) {
      throw new Error('测试报名不存在');
    }
    return mockResponse(registration);
  }
}

/**
 * 创建测试报名
 * @param {Object} registrationData - 报名数据
 * @param {string} registrationData.taskId - 任务ID
 * @param {string} registrationData.userId - 用户ID
 * @param {string} registrationData.notes - 备注
 * @returns {Promise} - 返回Promise对象
 */
export async function createTestRegistration(registrationData) {
  try {
    const res = await artemisRequest(TEST_TASK_API.REGISTRATION_CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registrationData)
    });

    const result = res?.data;

    console.log('创建测试报名原始API响应:', JSON.stringify(result, null, 2));

    // Transform response to expected format
    const reg = result.data || result;
    const transformedRegistration = {
      registrationId: reg.registrationId || reg.id,
      taskId: reg.taskId,
      taskTitle: reg.taskTitle || reg.taskName,
      userId: reg.userId,
      userName: reg.userName,
      status: reg.status || 'PENDING',
      testDate: reg.testDate,
      result: reg.result,
      notes: reg.notes,
      createdAt: reg.createdAt || reg.createTime || new Date().toISOString(),
      updatedAt: reg.updatedAt || reg.updateTime || new Date().toISOString(),
      // Keep original fields for compatibility
      ...reg
    };

    return {
      data: transformedRegistration,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('创建测试报名失败:', error);
    // Fallback to mock data
    await delay(800);
    const newRegistration = {
      registrationId: String(mockTestRegistrations.length + 1),
      ...registrationData,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockTestRegistrations.push(newRegistration);
    return mockResponse(newRegistration);
  }
}

/**
 * 更新测试报名
 * @param {string} registrationId - 报名ID
 * @param {Object} registrationData - 报名数据
 * @returns {Promise} - 返回Promise对象
 */
export async function updateTestRegistration(registrationId, registrationData) {
  try {
    const res = await artemisRequest(`${TEST_TASK_API.REGISTRATION_UPDATE}/${registrationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registrationData)
    });

    const result = res?.data;

    console.log('更新测试报名原始API响应:', JSON.stringify(result, null, 2));

    // Transform response to expected format
    const reg = result.data || result;
    const transformedRegistration = {
      registrationId: reg.registrationId || reg.id,
      taskId: reg.taskId,
      taskTitle: reg.taskTitle || reg.taskName,
      userId: reg.userId,
      userName: reg.userName,
      status: reg.status,
      testDate: reg.testDate,
      result: reg.result,
      notes: reg.notes,
      createdAt: reg.createdAt || reg.createTime,
      updatedAt: reg.updatedAt || reg.updateTime || new Date().toISOString(),
      // Keep original fields for compatibility
      ...reg
    };

    return {
      data: transformedRegistration,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('更新测试报名失败:', error);
    // Fallback to mock data
    await delay(500);
    const index = mockTestRegistrations.findIndex(r => r.registrationId === registrationId);
    if (index === -1) {
      throw new Error('测试报名不存在');
    }
    mockTestRegistrations[index] = {
      ...mockTestRegistrations[index],
      ...registrationData,
      updatedAt: new Date().toISOString()
    };
    return mockResponse(mockTestRegistrations[index]);
  }
}

/**
 * 取消测试报名
 * @param {string} registrationId - 报名ID
 * @returns {Promise} - 返回Promise对象
 */
export async function cancelTestRegistration(registrationId) {
  try {
    const res = await artemisRequest(`${TEST_TASK_API.REGISTRATION_DETAIL}/${registrationId}/cancel`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const result = res?.data;

    console.log('取消测试报名原始API响应:', JSON.stringify(result, null, 2));

    return {
      data: { success: true },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('取消测试报名失败:', error);
    // Fallback to mock data
    await delay(500);
    const index = mockTestRegistrations.findIndex(r => r.registrationId === registrationId);
    if (index === -1) {
      throw new Error('测试报名不存在');
    }
    mockTestRegistrations[index].status = 'CANCELLED';
    mockTestRegistrations[index].updatedAt = new Date().toISOString();
    return mockResponse({ success: true });
  }
}

/**
 * 安排测试时间
 * @param {string} registrationId - 报名ID
 * @param {Object} scheduleData - 安排数据
 * @param {string} scheduleData.scheduledDate - 安排的测试时间
 * @returns {Promise} - 返回Promise对象
 */
export async function scheduleTest(registrationId, scheduleData) {
  try {
    const res = await artemisRequest(`${TEST_TASK_API.REGISTRATION_DETAIL}/${registrationId}/schedule`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(scheduleData)
    });

    const result = res?.data;

    console.log('安排测试时间原始API响应:', JSON.stringify(result, null, 2));

    // Transform response to expected format
    const reg = result.data || result;
    const transformedRegistration = {
      registrationId: reg.registrationId || reg.id,
      taskId: reg.taskId,
      taskTitle: reg.taskTitle || reg.taskName,
      userId: reg.userId,
      userName: reg.userName,
      status: reg.status || 'SCHEDULED',
      testDate: reg.testDate || scheduleData.testDate,
      result: reg.result,
      notes: reg.notes,
      createdAt: reg.createdAt || reg.createTime,
      updatedAt: reg.updatedAt || reg.updateTime || new Date().toISOString(),
      // Keep original fields for compatibility
      ...reg
    };

    return {
      data: transformedRegistration,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('安排测试时间失败:', error);
    // Fallback to mock data
    await delay(500);
    const registration = mockTestRegistrations.find(r => r.registrationId === registrationId);
    if (!registration) {
      throw new Error('测试报名不存在');
    }
    registration.testDate = scheduleData.testDate;
    registration.status = 'SCHEDULED';
    registration.updatedAt = new Date().toISOString();
    return mockResponse(registration);
  }
}

/**
 * 完成测试
 * @param {string} registrationId - 报名ID
 * @param {Object} resultData - 测试结果数据
 * @param {number} resultData.score - 得分
 * @param {string} resultData.result - 结果 (PASS/FAIL)
 * @param {string} resultData.notes - 备注
 * @returns {Promise} - 返回Promise对象
 */
export async function completeTest(registrationId, resultData) {
  try {
    const res = await artemisRequest(`${TEST_TASK_API.REGISTRATION_DETAIL}/${registrationId}/complete`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(resultData)
    });

    const result = res?.data;

    console.log('完成测试原始API响应:', JSON.stringify(result, null, 2));

    // Transform response to expected format
    const reg = result.data || result;
    const transformedRegistration = {
      registrationId: reg.registrationId || reg.id,
      taskId: reg.taskId,
      taskTitle: reg.taskTitle || reg.taskName,
      userId: reg.userId,
      userName: reg.userName,
      status: reg.status || 'COMPLETED',
      testDate: reg.testDate,
      result: reg.result || resultData.result,
      notes: reg.notes,
      createdAt: reg.createdAt || reg.createTime,
      updatedAt: reg.updatedAt || reg.updateTime || new Date().toISOString(),
      // Keep original fields for compatibility
      ...reg
    };

    return {
      data: transformedRegistration,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('完成测试失败:', error);
    // Fallback to mock data
    await delay(500);
    const registration = mockTestRegistrations.find(r => r.registrationId === registrationId);
    if (!registration) {
      throw new Error('测试报名不存在');
    }
    registration.status = 'COMPLETED';
    registration.result = resultData.result;
    registration.updatedAt = new Date().toISOString();
    return mockResponse(registration);
  }
}

/**
 * 获取用户测试报名列表
 * @param {string} userId - 用户ID
 * @returns {Promise} - 返回Promise对象
 */
export async function getUserTestRegistrations(userId) {
  try {
    const res = await artemisRequest(`${TEST_TASK_API.REGISTRATION_USER}/${userId}`, { method: 'GET' });

    const result = res?.data;

    console.log('获取用户测试报名列表原始API响应:', JSON.stringify(result, null, 2));

    // Transform response to expected format
    const registrations = (result.data?.list || result.data?.content || result.data || []).map(reg => ({
      registrationId: reg.registrationId || reg.id,
      taskId: reg.taskId,
      taskTitle: reg.taskTitle || reg.taskName,
      userId: reg.userId,
      userName: reg.userName,
      status: reg.status,
      testDate: reg.testDate,
      result: reg.result,
      notes: reg.notes,
      createdAt: reg.createdAt || reg.createTime,
      updatedAt: reg.updatedAt || reg.updateTime
    }));

    return {
      data: registrations,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('获取用户测试报名列表失败:', error);
    // Fallback to mock data
    await delay(500);
    const userRegistrations = mockTestRegistrations.filter(r => r.userId === userId);
    return mockResponse(userRegistrations);
  }
}

/**
 * 获取任务的报名列表
 * @param {string} taskId - 任务ID
 * @returns {Promise} - 返回Promise对象
 */
export async function getTaskRegistrations(taskId) {
  try {
    const res = await artemisRequest(`${TEST_TASK_API.REGISTRATION_TASK}/${taskId}`, { method: 'GET' });

    const result = res?.data;

    console.log('获取任务报名列表原始API响应:', JSON.stringify(result, null, 2));

    // Transform response to expected format
    const registrations = (result.data?.list || result.data?.content || result.data || []).map(reg => ({
      registrationId: reg.registrationId || reg.id,
      taskId: reg.taskId,
      taskTitle: reg.taskTitle || reg.taskName,
      userId: reg.userId,
      userName: reg.userName,
      status: reg.status,
      testDate: reg.testDate,
      result: reg.result,
      notes: reg.notes,
      createdAt: reg.createdAt || reg.createTime,
      updatedAt: reg.updatedAt || reg.updateTime
    }));

    return {
      data: registrations,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('获取任务报名列表失败:', error);
    // Fallback to mock data
    await delay(500);
    const taskRegistrations = mockTestRegistrations.filter(r => r.taskId === taskId);
    return mockResponse(taskRegistrations);
  }
}

/**
 * 获取测试统计信息
 * @returns {Promise} - 返回Promise对象
 */
export async function getTestStats() {
  try {
    const res = await artemisRequest(TEST_TASK_API.STATS, { method: 'GET' });

    const result = res?.data;

    console.log('获取测试统计信息原始API响应:', JSON.stringify(result, null, 2));

    // Transform response to expected format
    const stats = result.data || result;
    const transformedStats = {
      totalTasks: stats.totalTasks || 0,
      totalRegistrations: stats.totalRegistrations || 0,
      completedTests: stats.completedTests || 0,
      pendingTests: stats.pendingTests || 0,
      passRate: stats.passRate || 0,
      // Keep original fields for compatibility
      ...stats
    };

    return {
      data: transformedStats,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    // 静默处理错误，直接返回mock数据
    // console.error('获取测试统计信息失败:', error);
    await delay(300);
    return mockResponse(mockTestStats);
  }
}

/**
 * 创建测试任务
 * @param {Object} taskData - 任务数据
 * @returns {Promise} - 返回Promise对象
 */
export async function createTestTask(taskData) {
  try {
    const res = await artemisRequest(TEST_TASK_API.CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskData)
    });

    const result = res?.data;

    console.log('创建测试任务原始API响应:', JSON.stringify(result, null, 2));

    // Transform response to expected format
    const task = result.data || result;
    const transformedTask = {
      taskId: task.taskId || task.id,
      title: task.title || task.name,
      description: task.description,
      taskType: task.taskType,
      difficulty: task.difficulty,
      duration: task.duration,
      maxParticipants: task.maxParticipants,
      currentParticipants: task.currentParticipants || 0,
      status: task.status || 'PENDING',
      startDate: task.startDate,
      endDate: task.endDate,
      createdAt: task.createdAt || task.createTime || new Date().toISOString(),
      updatedAt: task.updatedAt || task.updateTime || new Date().toISOString(),
      // Keep original fields for compatibility
      ...task
    };

    return {
      data: transformedTask,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('创建测试任务失败:', error);
    // Fallback to mock data
    await delay(800);
    const newTask = {
      taskId: String(mockTestTasks.content.length + 1),
      ...taskData,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockTestTasks.content.push(newTask);
    return mockResponse(newTask);
  }
}

/**
 * 获取试验任务列表
 * @param {Object} params - 查询参数
 * @param {string} params.testType - 测试类型
 * @param {string} params.status - 状态
 * @param {number} params.page - 页码
 * @param {number} params.size - 每页数量
 * @returns {Promise} - 返回Promise对象
 */
export async function getExperimentTasks(params = {}) {
  try {
    const queryParams = new URLSearchParams();
    if (params.testType) queryParams.append('testType', params.testType);
    if (params.status) queryParams.append('status', params.status);
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size) queryParams.append('size', params.size);

    const res = await artemisRequest(`${TEST_TASK_API.EXPERIMENT_TASK_LIST}?${queryParams}`, { method: 'GET' });

    const result = res?.data;

    console.log('获取试验任务列表原始API响应:', JSON.stringify(result, null, 2));

    // Transform response to expected format
    const tasks = (result.data?.list || result.data?.content || result.data || []).map(task => ({
      taskId: task.taskId || task.id,
      taskName: task.taskName || task.name,
      description: task.description,
      testType: task.testType,
      experimentType: task.experimentType,
      department: task.department,
      difficulty: task.difficulty,
      startDate: task.startDate,
      endDate: task.endDate,
      estimatedDuration: task.estimatedDuration,
      testSite: task.testSite,
      fee: task.fee,
      status: task.status,
      createdAt: task.createdAt || task.createTime,
      updatedAt: task.updatedAt || task.updateTime,
      // Keep original fields for compatibility
      ...task
    }));

    return {
      data: {
        content: tasks,
        pageable: {
          pageNumber: result.data?.pageNo || result.data?.pageable?.pageNumber || params.page || 0,
          pageSize: result.data?.pageSize || result.data?.pageable?.pageSize || params.size || 10,
          total: result.data?.total || result.data?.pageable?.total || tasks.length
        }
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('获取试验任务列表失败:', error);
    // Fallback to mock data
    await delay(500);
    return mockResponse(mockTestTasks);
  }
}

/**
 * 根据ID获取试验任务详情
 * @param {string} taskId - 任务ID
 * @returns {Promise} - 返回Promise对象
 */
export async function getExperimentTaskById(taskId) {
  try {
    const res = await artemisRequest(`${TEST_TASK_API.EXPERIMENT_TASK_DETAIL}/${taskId}`, { method: 'GET' });

    const result = res?.data;

    console.log('获取试验任务详情原始API响应:', JSON.stringify(result, null, 2));

    // Transform response to expected format
    const task = result.data || result;
    const transformedTask = {
      taskId: task.taskId || task.id,
      taskName: task.taskName || task.name,
      description: task.description,
      testType: task.testType,
      experimentType: task.experimentType,
      department: task.department,
      difficulty: task.difficulty,
      startDate: task.startDate,
      endDate: task.endDate,
      estimatedDuration: task.estimatedDuration,
      testSite: task.testSite,
      fee: task.fee,
      status: task.status,
      contractInfo: task.contractInfo,
      vehicles: task.vehicles,
      equipment: task.equipment,
      requirements: task.requirements,
      notes: task.notes,
      createdAt: task.createdAt || task.createTime,
      updatedAt: task.updatedAt || task.updateTime,
      // Keep original fields for compatibility
      ...task
    };

    return {
      data: transformedTask,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('获取试验任务详情失败:', error);
    // Fallback to mock data
    await delay(300);
    const task = mockTestTasks.content.find(t => t.taskId === taskId);
    if (!task) {
      throw new Error('试验任务不存在');
    }
    return mockResponse(task);
  }
}

/**
 * 创建试验任务
 * @param {Object} taskData - 任务数据
 * @returns {Promise} - 返回Promise对象
 */
export async function createExperimentTask(taskData) {
  try {
    const res = await artemisRequest(TEST_TASK_API.EXPERIMENT_TASK_CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskData)
    });

    const result = res?.data;

    console.log('创建试验任务原始API响应:', JSON.stringify(result, null, 2));

    // Transform response to expected format
    const task = result.data || result;
    const transformedTask = {
      taskId: task.taskId || task.id,
      taskName: task.taskName || task.name,
      description: task.description,
      testType: task.testType,
      experimentType: task.experimentType,
      department: task.department,
      difficulty: task.difficulty,
      startDate: task.startDate,
      endDate: task.endDate,
      estimatedDuration: task.estimatedDuration,
      testSite: task.testSite,
      fee: task.fee,
      status: task.status || 'DRAFT',
      createdAt: task.createdAt || task.createTime || new Date().toISOString(),
      updatedAt: task.updatedAt || task.updateTime || new Date().toISOString(),
      // Keep original fields for compatibility
      ...task
    };

    return {
      data: transformedTask,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('创建试验任务失败:', error);
    // Fallback to mock data
    await delay(800);
    const newTask = {
      taskId: String(mockTestTasks.content.length + 1),
      ...taskData,
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockTestTasks.content.push(newTask);
    return mockResponse(newTask);
  }
}

/**
 * 更新试验任务
 * @param {string} taskId - 任务ID
 * @param {Object} taskData - 任务数据
 * @returns {Promise} - 返回Promise对象
 */
export async function updateExperimentTask(taskId, taskData) {
  try {
    const res = await artemisRequest(`${TEST_TASK_API.EXPERIMENT_TASK_UPDATE}/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskData)
    });

    const result = res?.data;

    console.log('更新试验任务原始API响应:', JSON.stringify(result, null, 2));

    // Transform response to expected format
    const task = result.data || result;
    const transformedTask = {
      taskId: task.taskId || task.id,
      taskName: task.taskName || task.name,
      description: task.description,
      testType: task.testType,
      experimentType: task.experimentType,
      department: task.department,
      difficulty: task.difficulty,
      startDate: task.startDate,
      endDate: task.endDate,
      estimatedDuration: task.estimatedDuration,
      testSite: task.testSite,
      fee: task.fee,
      status: task.status,
      updatedAt: task.updatedAt || task.updateTime || new Date().toISOString(),
      // Keep original fields for compatibility
      ...task
    };

    return {
      data: transformedTask,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('更新试验任务失败:', error);
    // Fallback to mock data
    await delay(500);
    const task = mockTestTasks.content.find(t => t.taskId === taskId);
    if (!task) {
      throw new Error('试验任务不存在');
    }
    Object.assign(task, taskData, { updatedAt: new Date().toISOString() });
    return mockResponse(task);
  }
}

/**
 * 删除试验任务
 * @param {string} taskId - 任务ID
 * @returns {Promise} - 返回Promise对象
 */
export async function deleteExperimentTask(taskId) {
  try {
    const res = await artemisRequest(`${TEST_TASK_API.EXPERIMENT_TASK_DELETE}/${taskId}`, {
      method: 'DELETE'
    });

    const result = res?.data;

    console.log('删除试验任务原始API响应:', JSON.stringify(result, null, 2));

    return {
      data: { success: true },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('删除试验任务失败:', error);
    // Fallback to mock data
    await delay(500);
    const index = mockTestTasks.content.findIndex(t => t.taskId === taskId);
    if (index === -1) {
      throw new Error('试验任务不存在');
    }
    mockTestTasks.content.splice(index, 1);
    return mockResponse({ success: true });
  }
}

/**
 * 提交试验任务审核
 * @param {string} taskId - 任务ID
 * @returns {Promise} - 返回Promise对象
 */
export async function submitExperimentTaskForApproval(taskId) {
  try {
    const res = await artemisRequest(`${TEST_TASK_API.EXPERIMENT_TASK_SUBMIT}/${taskId}/submit`, {
      method: 'PUT'
    });

    const result = res?.data;

    console.log('提交试验任务审核原始API响应:', JSON.stringify(result, null, 2));

    return {
      data: { success: true },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('提交试验任务审核失败:', error);
    throw error;
  }
}

/**
 * 审核试验任务
 * @param {string} taskId - 任务ID
 * @param {Object} approvalData - 审核数据
 * @param {string} approvalData.status - 审核状态 (APPROVED/REJECTED)
 * @param {string} [approvalData.remark] - 审核备注
 * @returns {Promise} - 返回Promise对象
 */
export async function approveExperimentTask(taskId, approvalData) {
  try {
    const res = await artemisRequest(`${TEST_TASK_API.EXPERIMENT_TASK_APPROVE}/${taskId}/approve`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(approvalData)
    });

    const result = res?.data;

    console.log('审核试验任务原始API响应:', JSON.stringify(result, null, 2));

    return {
      data: { success: true },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('审核试验任务失败:', error);
    throw error;
  }
}

/**
 * 开始试验任务
 * @param {string} taskId - 任务ID
 * @returns {Promise} - 返回Promise对象
 */
export async function startExperimentTask(taskId) {
  try {
    const res = await artemisRequest(`${TEST_TASK_API.EXPERIMENT_TASK_START}/${taskId}/start`, {
      method: 'PUT'
    });

    const result = res?.data;

    console.log('开始试验任务原始API响应:', JSON.stringify(result, null, 2));

    return {
      data: { success: true },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('开始试验任务失败:', error);
    throw error;
  }
}

/**
 * 完成试验任务
 * @param {string} taskId - 任务ID
 * @param {Object} completionData - 完成数据
 * @param {string} completionData.result - 试验结果
 * @param {string} [completionData.remark] - 备注
 * @returns {Promise} - 返回Promise对象
 */
export async function completeExperimentTask(taskId, completionData) {
  try {
    const res = await artemisRequest(`${TEST_TASK_API.EXPERIMENT_TASK_COMPLETE}/${taskId}/complete`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(completionData)
    });

    const result = res?.data;

    console.log('完成试验任务原始API响应:', JSON.stringify(result, null, 2));

    return {
      data: { success: true },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('完成试验任务失败:', error);
    throw error;
  }
}

/**
 * 取消试验任务
 * @param {string} taskId - 任务ID
 * @param {string} [reason] - 取消原因
 * @returns {Promise} - 返回Promise对象
 */
export async function cancelExperimentTask(taskId, reason) {
  try {
    const res = await artemisRequest(`${TEST_TASK_API.EXPERIMENT_TASK_CANCEL}/${taskId}/cancel`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ reason })
    });

    const result = res?.data;

    console.log('取消试验任务原始API响应:', JSON.stringify(result, null, 2));

    return {
      data: { success: true },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('取消试验任务失败:', error);
    throw error;
  }
}
