import request from './request';

/**
 * 获取测试任务列表
 * @param {Object} params - 查询参数
 * @param {string} params.taskType - 任务类型
 * @param {string} params.difficulty - 难度等级
 * @param {number} params.page - 页码
 * @param {number} params.size - 每页数量
 * @returns {Promise} - 返回Promise对象
 */
export function getTestTasks(params = {}) {
  return request({
    url: '/api/v1/test-registration/tasks',
    method: 'get',
    params
  });
}

/**
 * 根据ID获取测试任务详情
 * @param {string} taskId - 任务ID
 * @returns {Promise} - 返回Promise对象
 */
export function getTestTaskById(taskId) {
  return request({
    url: `/api/v1/test-registration/tasks/${taskId}`,
    method: 'get'
  });
}

/**
 * 获取测试报名列表
 * @param {Object} params - 查询参数
 * @param {string} params.status - 报名状态
 * @param {number} params.page - 页码
 * @param {number} params.size - 每页数量
 * @returns {Promise} - 返回Promise对象
 */
export function getTestRegistrations(params = {}) {
  return request({
    url: '/api/v1/test-registration/registrations',
    method: 'get',
    params
  });
}

/**
 * 根据ID获取测试报名详情
 * @param {string} registrationId - 报名ID
 * @returns {Promise} - 返回Promise对象
 */
export function getTestRegistrationById(registrationId) {
  return request({
    url: `/api/v1/test-registration/registrations/${registrationId}`,
    method: 'get'
  });
}

/**
 * 创建测试报名
 * @param {Object} registrationData - 报名数据
 * @param {string} registrationData.taskId - 任务ID
 * @param {string} registrationData.userId - 用户ID
 * @param {string} registrationData.notes - 备注
 * @returns {Promise} - 返回Promise对象
 */
export function createTestRegistration(registrationData) {
  return request({
    url: '/api/v1/test-registration/registrations',
    method: 'post',
    data: registrationData
  });
}

/**
 * 更新测试报名
 * @param {string} registrationId - 报名ID
 * @param {Object} registrationData - 报名数据
 * @returns {Promise} - 返回Promise对象
 */
export function updateTestRegistration(registrationId, registrationData) {
  return request({
    url: `/api/v1/test-registration/registrations/${registrationId}`,
    method: 'put',
    data: registrationData
  });
}

/**
 * 取消测试报名
 * @param {string} registrationId - 报名ID
 * @returns {Promise} - 返回Promise对象
 */
export function cancelTestRegistration(registrationId) {
  return request({
    url: `/api/v1/test-registration/registrations/${registrationId}`,
    method: 'delete'
  });
}

/**
 * 安排测试时间
 * @param {string} registrationId - 报名ID
 * @param {Object} scheduleData - 安排数据
 * @param {string} scheduleData.scheduledDate - 安排的测试时间
 * @returns {Promise} - 返回Promise对象
 */
export function scheduleTest(registrationId, scheduleData) {
  return request({
    url: `/api/v1/test-registration/registrations/${registrationId}/schedule`,
    method: 'put',
    data: scheduleData
  });
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
export function completeTest(registrationId, resultData) {
  return request({
    url: `/api/v1/test-registration/registrations/${registrationId}/complete`,
    method: 'put',
    data: resultData
  });
}

/**
 * 获取用户测试报名列表
 * @param {string} userId - 用户ID
 * @returns {Promise} - 返回Promise对象
 */
export function getUserTestRegistrations(userId) {
  return request({
    url: `/api/v1/test-registration/user/${userId}/registrations`,
    method: 'get'
  });
}

/**
 * 获取任务的报名列表
 * @param {string} taskId - 任务ID
 * @returns {Promise} - 返回Promise对象
 */
export function getTaskRegistrations(taskId) {
  return request({
    url: `/api/v1/test-registration/task/${taskId}/registrations`,
    method: 'get'
  });
}

/**
 * 获取测试统计信息
 * @returns {Promise} - 返回Promise对象
 */
export function getTestStats() {
  return request({
    url: '/api/v1/test-registration/stats',
    method: 'get'
  });
}
