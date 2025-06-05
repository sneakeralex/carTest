import request from './request';

/**
 * 获取测试咨询预约列表
 * @param {Object} params - 查询参数
 * @param {string} params.status - 预约状态
 * @param {number} params.page - 页码
 * @param {number} params.size - 每页数量
 * @returns {Promise} - 返回Promise对象
 */
export function getTestConsultationAppointments(params = {}) {
  return request({
    url: '/api/appointments',
    method: 'get',
    params
  });
}

/**
 * 根据ID获取测试咨询预约详情
 * @param {string} appointmentNo - 预约编号
 * @returns {Promise} - 返回Promise对象
 */
export function getTestConsultationAppointmentById(appointmentNo) {
  return request({
    url: `/api/appointments/${appointmentNo}`,
    method: 'get'
  });
}

/**
 * 创建测试咨询预约
 * @param {Object} appointmentData - 预约数据
 * @param {string} appointmentData.serviceType - 服务类型 (测试咨询)
 * @param {string} appointmentData.appointmentDate - 预约时间
 * @param {string} appointmentData.description - 咨询内容描述
 * @param {string} appointmentData.phone - 联系电话
 * @returns {Promise} - 返回Promise对象
 */
export function createTestConsultationAppointment(appointmentData) {
  return request({
    url: '/api/appointments',
    method: 'post',
    data: appointmentData
  });
}

/**
 * 更新测试咨询预约信息
 * @param {string} appointmentNo - 预约编号
 * @param {Object} appointmentData - 预约数据
 * @returns {Promise} - 返回Promise对象
 */
export function updateTestConsultationAppointment(appointmentNo, appointmentData) {
  return request({
    url: `/api/appointments/${appointmentNo}`,
    method: 'put',
    data: appointmentData
  });
}

/**
 * 取消测试咨询预约
 * @param {string} appointmentNo - 预约编号
 * @returns {Promise} - 返回Promise对象
 */
export function cancelTestConsultationAppointment(appointmentNo) {
  return request({
    url: `/api/appointments/${appointmentNo}/cancel`,
    method: 'put'
  });
}

/**
 * 获取用户的测试咨询预约列表
 * @param {string} userId - 用户ID
 * @returns {Promise} - 返回Promise对象
 */
export function getUserTestConsultationAppointments(userId) {
  return request({
    url: `/api/appointments/user/${userId}`,
    method: 'get'
  });
}

/**
 * 审批测试咨询预约 (管理员)
 * @param {string} appointmentNo - 预约编号
 * @returns {Promise} - 返回Promise对象
 */
export function approveTestConsultationAppointment(appointmentNo) {
  return request({
    url: `/api/appointments/${appointmentNo}/approve`,
    method: 'put'
  });
}

/**
 * 完成测试咨询预约 (管理员)
 * @param {string} appointmentNo - 预约编号
 * @returns {Promise} - 返回Promise对象
 */
export function completeTestConsultationAppointment(appointmentNo) {
  return request({
    url: `/api/appointments/${appointmentNo}/complete`,
    method: 'put'
  });
}