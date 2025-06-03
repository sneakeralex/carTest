import request from './request';

/**
 * 获取预约列表
 * @returns {Promise} - 返回Promise对象
 */
export function getAppointments() {
  return request({
    url: '/appointments',
    method: 'get'
  });
}

/**
 * 根据ID获取预约详情
 * @param {number|string} id - 预约ID
 * @returns {Promise} - 返回Promise对象
 */
export function getAppointmentById(id) {
  return request({
    url: `/appointments/${id}`,
    method: 'get'
  });
}

/**
 * 创建预约
 * @param {Object} appointmentData - 预约数据
 * @param {number|string} appointmentData.vehicleId - 车辆ID
 * @param {string} appointmentData.appointmentTime - 预约时间
 * @param {string} appointmentData.serviceType - 服务类型
 * @param {string} appointmentData.description - 描述
 * @returns {Promise} - 返回Promise对象
 */
export function createAppointment(appointmentData) {
  return request({
    url: '/appointments',
    method: 'post',
    data: appointmentData
  });
}

/**
 * 更新预约信息
 * @param {number|string} id - 预约ID
 * @param {Object} appointmentData - 预约数据
 * @returns {Promise} - 返回Promise对象
 */
export function updateAppointment(id, appointmentData) {
  return request({
    url: `/appointments/${id}`,
    method: 'put',
    data: appointmentData
  });
}

/**
 * 取消预约
 * @param {number|string} id - 预约ID
 * @returns {Promise} - 返回Promise对象
 */
export function cancelAppointment(id) {
  return request({
    url: `/appointments/${id}/cancel`,
    method: 'put'
  });
}

/**
 * 获取可用的预约时间段
 * @param {string} date - 日期，格式：YYYY-MM-DD
 * @returns {Promise} - 返回Promise对象
 */
export function getAvailableTimeSlots(date) {
  return request({
    url: '/appointments/available-slots',
    method: 'get',
    params: { date }
  });
}