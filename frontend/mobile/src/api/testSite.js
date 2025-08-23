import request from './request';

/**
 * 获取测试场列表
 * @param {Object} params - 查询参数
 * @param {string} params.city - 城市
 * @param {string} params.district - 区域
 * @returns {Promise} - 返回Promise对象
 */
export function getTestSites(params = {}) {
  return request({
    url: '/bookings/test-sites',
    method: 'get',
    params
  });
}

/**
 * 根据ID获取测试场详情
 * @param {string} siteId - 测试场ID
 * @returns {Promise} - 返回Promise对象
 */
export function getTestSiteById(siteId) {
  return request({
    url: `/bookings/test-sites/${siteId}`,
    method: 'get'
  });
}

/**
 * 获取测试场可用时间段
 * @param {Object} params - 查询参数
 * @param {string} params.testSiteId - 测试场ID
 * @param {string} params.date - 日期 (YYYY-MM-DD)
 * @returns {Promise} - 返回Promise对象
 */
export function getAvailableTimeSlots(params) {
  return request({
    url: '/bookings/time-slots',
    method: 'get',
    params
  });
}

/**
 * 创建测试场预约
 * @param {Object} bookingData - 预约数据
 * @param {string} bookingData.vehicleId - 车辆ID
 * @param {string} bookingData.testSiteId - 测试场ID
 * @param {string} bookingData.bookingDate - 预约日期
 * @param {string} bookingData.timeSlot - 时间段
 * @param {string} bookingData.serviceType - 测试类型
 * @param {string} bookingData.notes - 备注
 * @returns {Promise} - 返回Promise对象
 */
export function createBooking(bookingData) {
  return request({
    url: '/bookings',
    method: 'post',
    data: bookingData
  });
}

/**
 * 获取预约列表
 * @param {Object} params - 查询参数
 * @param {string} params.status - 预约状态
 * @param {number} params.page - 页码
 * @param {number} params.size - 每页数量
 * @returns {Promise} - 返回Promise对象
 */
export function getBookings(params = {}) {
  return request({
    url: '/bookings',
    method: 'get',
    params
  });
}

/**
 * 根据ID获取预约详情
 * @param {string} bookingId - 预约ID
 * @returns {Promise} - 返回Promise对象
 */
export function getBookingById(bookingId) {
  return request({
    url: `/bookings/${bookingId}`,
    method: 'get'
  });
}

/**
 * 更新预约信息
 * @param {string} bookingId - 预约ID
 * @param {Object} bookingData - 预约数据
 * @returns {Promise} - 返回Promise对象
 */
export function updateBooking(bookingId, bookingData) {
  return request({
    url: `/bookings/${bookingId}`,
    method: 'put',
    data: bookingData
  });
}

/**
 * 取消预约
 * @param {string} bookingId - 预约ID
 * @param {Object} data - 取消原因
 * @param {string} data.reason - 取消原因
 * @returns {Promise} - 返回Promise对象
 */
export function cancelBooking(bookingId, data) {
  return request({
    url: `/bookings/${bookingId}/cancel`,
    method: 'put',
    data
  });
}

/**
 * 获取用户预约列表
 * @param {string} userId - 用户ID
 * @returns {Promise} - 返回Promise对象
 */
export function getUserBookings(userId) {
  return request({
    url: `/bookings/user/${userId}`,
    method: 'get'
  });
}

/**
 * 获取预约统计信息
 * @returns {Promise} - 返回Promise对象
 */
export function getBookingStats() {
  return request({
    url: '/bookings/stats',
    method: 'get'
  });
}