import request from './request';

/**
 * 获取移动端仪表板统计信息
 * @returns {Promise} - 返回Promise对象
 */
export function getMobileDashboardStats() {
  return request({
    url: '/api/v1/mobile/dashboard/stats',
    method: 'get'
  });
}

/**
 * 获取最近的预约记录
 * @param {number} limit - 限制数量，默认5条
 * @returns {Promise} - 返回Promise对象
 */
export function getRecentBookings(limit = 5) {
  return request({
    url: '/api/v1/mobile/dashboard/recent-bookings',
    method: 'get',
    params: { limit }
  });
}

/**
 * 获取通知列表
 * @param {number} limit - 限制数量，默认10条
 * @returns {Promise} - 返回Promise对象
 */
export function getNotifications(limit = 10) {
  return request({
    url: '/api/v1/mobile/dashboard/notifications',
    method: 'get',
    params: { limit }
  });
}

/**
 * 获取快捷操作列表
 * @returns {Promise} - 返回Promise对象
 */
export function getQuickActions() {
  return request({
    url: '/api/v1/mobile/dashboard/quick-actions',
    method: 'get'
  });
}

/**
 * 获取天气信息
 * @param {string} city - 城市名称，默认为用户当前城市
 * @returns {Promise} - 返回Promise对象
 */
export function getWeatherInfo(city = null) {
  const params = city ? { city } : {};
  return request({
    url: '/api/v1/mobile/dashboard/weather',
    method: 'get',
    params
  });
}

/**
 * 获取公告列表
 * @param {number} limit - 限制数量，默认5条
 * @returns {Promise} - 返回Promise对象
 */
export function getAnnouncements(limit = 5) {
  return request({
    url: '/api/v1/mobile/dashboard/announcements',
    method: 'get',
    params: { limit }
  });
}

/**
 * 获取用户资料摘要
 * @returns {Promise} - 返回Promise对象
 */
export function getUserProfileSummary() {
  return request({
    url: '/api/v1/mobile/dashboard/user-profile',
    method: 'get'
  });
}

/**
 * 标记通知为已读
 * @param {string} notificationId - 通知ID
 * @returns {Promise} - 返回Promise对象
 */
export function markNotificationAsRead(notificationId) {
  return request({
    url: `/api/v1/mobile/dashboard/notifications/${notificationId}/read`,
    method: 'put'
  });
}

/**
 * 批量标记通知为已读
 * @param {Array} notificationIds - 通知ID数组
 * @returns {Promise} - 返回Promise对象
 */
export function markNotificationsAsRead(notificationIds) {
  return request({
    url: '/api/v1/mobile/dashboard/notifications/batch-read',
    method: 'put',
    data: { notificationIds }
  });
}

/**
 * 获取未读通知数量
 * @returns {Promise} - 返回Promise对象
 */
export function getUnreadNotificationCount() {
  return request({
    url: '/api/v1/mobile/dashboard/notifications/unread-count',
    method: 'get'
  });
}
