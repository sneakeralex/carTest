// 移除vant依赖，避免在Node.js环境中运行时的模块导入问题
import { 
  mockDashboardStats, 
  mockRecentBookings, 
  mockNotifications, 
  mockQuickActions,
  mockWeatherInfo
} from '../mock/dashboard.js';
import { delay, mockResponse, validateToken, MockApiError } from '../mock/utils.js';
import { artemisRequest } from './request.js';
import { getItem } from '../utils/storage.js';
import { DASHBOARD_API, BOOKING_API, NOTIFICATION_API, WEATHER_API, ALERT_API } from './config.js';

/**
 * 获取移动端仪表板统计信息
 * @returns {Promise} - 返回Promise对象
 */
export async function getMobileDashboardStats() {
  try {
    const res = await artemisRequest(DASHBOARD_API.MOBILE_STATS, { method: 'GET' });
    const result = res?.data;
    console.log('获取仪表板统计原始API响应:', JSON.stringify(result, null, 2));

    if (result.code !== '0' && result.code !== 200) {
      throw new Error(result.msg || '获取仪表板数据失败');
    }

    // Transform response to expected format
    const stats = result.data || result;
    const transformedStats = {
      totalVehicles: stats.totalVehicles || stats.vehicleCount || 0,
      activeBookings: stats.activeBookings || stats.bookingCount || 0,
      pendingApprovals: stats.pendingApprovals || stats.approvalCount || 0,
      totalEquipment: stats.totalEquipment || stats.equipmentCount || 0,
      maintenanceDue: stats.maintenanceDue || stats.maintenanceCount || 0,
      recentActivities: stats.recentActivities || [],
      alerts: stats.alerts || [],
      ...stats // Keep original fields
    };

    return {
      data: transformedStats,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('获取仪表板统计失败:', error);
    // Fallback to mock data
    try {
      validateToken();
      await delay(500);
      if (!mockDashboardStats) {
        throw new Error('仪表盘数据不存在');
      }
      return mockResponse(mockDashboardStats);
    } catch (mockError) {
      if (mockError instanceof MockApiError) {
        throw mockError;
      }
      throw new MockApiError(mockError.message || '获取仪表板数据失败');
    }
  }
}

/**
 * 获取最近的预约记录
 * @param {number} limit - 限制数量，默认5条
 * @returns {Promise} - 返回Promise对象
 */
export async function getRecentBookings(limit = 5) {
  try {
    // 直接调用API获取预约列表
    const res = await artemisRequest(`/artemis/api/v1/booking/list?pageNum=1&pageSize=${limit}`, { method: 'GET' });
    const result = res?.data;
    
    console.log('获取最近预约原始API响应:', JSON.stringify(result, null, 2));

    // Transform response to expected format based on actual API response
    const bookings = (result.data?.list || result.data?.content || result.data || []).map(booking => ({
      id: booking.id || booking.bookingId,
      bookingId: booking.id || booking.bookingId,
      // 场地相关字段 - 使用实际API字段
      testSiteName: booking.groundNm || booking.provingGroundNm || booking.groundName || booking.siteName || '测试场',
      groundName: booking.groundNm || booking.groundName,
      groundNm: booking.groundNm,
      provingGroundName: booking.provingGroundNm || booking.provingGroundName,
      provingGroundNm: booking.provingGroundNm,
      groundId: booking.groundId,
      provingGroundId: booking.provingGroundId,
      // 时间相关字段
      startTime: booking.startTime,
      endTime: booking.endTime,
      bookingDate: booking.bookingDate,
      // 需要组合日期和时间
      startDateTime: `${booking.bookingDate} ${booking.startTime}`,
      endDateTime: `${booking.bookingDate} ${booking.endTime}`,
      // 状态字段 - 处理数字状态
      status: booking.status,
      statusText: booking.status === '0' ? 'PENDING' : 
                booking.status === '1' ? 'CONFIRMED' : 
                booking.status === '2' ? 'COMPLETED' : 
                booking.status === '3' ? 'CANCELLED' : 'PENDING',
      // 用户相关
      userId: booking.userId,
      driverId: booking.driverId,
      driverName: booking.driverNm,
      driverPhone: booking.driverPhone,
      // 服务类型
      serviceType: booking.billingTypeName || '预约',
      billingType: booking.billingType,
      billingTypeName: booking.billingTypeName,
      // 测试相关
      testContent: booking.testContent,
      testTypeName: booking.testTypeName,
      testTypeId: booking.testTypeId,
      // 预约编号
      bookingNo: booking.bookingNo,
      experimentNo: booking.experimentNo,
      projectNo: booking.projectNo,
      taskNo: booking.taskNo,
      // 车辆相关
      vin: booking.vin,
      productionUnit: booking.productionUnit,
      entrustCompany: booking.entrustCompany,
      contractNo: booking.contractNo,
      // 时间字段
      createTime: booking.createTime,
      updateTime: booking.updateTime,
      createdAt: booking.createTime,
      updatedAt: booking.updateTime,
      // 其他字段
      remark: booking.remark,
      isExclusive: booking.isExclusive,
      auxiliaryVehicleCount: booking.auxiliaryVehicleCount,
      participantCount: booking.participantCount,
      // 保留原始数据
      ...booking
    }));

    return {
      data: bookings,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('获取最近预约失败:', error);
    // Fallback to mock data
    await delay(300);
    return mockResponse(mockRecentBookings.slice(0, limit));
  }
}

/**
 * 获取通知列表
 * @param {number} limit - 限制数量，默认10条
 * @returns {Promise} - 返回Promise对象
 */
export async function getNotifications(limit = 10) {
  try {
    const res = await artemisRequest(`/artemis/api/notification/v1/list?limit=${limit}`, { method: 'GET' });
    const result = res?.data;
    console.log('获取通知列表原始API响应:', JSON.stringify(result, null, 2));

    if (result.code !== '0' && result.code !== 200) {
      throw new Error(result.msg || '获取通知列表失败');
    }

    // Transform response to expected format
    const notifications = (result.data?.list || result.data || []).map(notification => ({
      id: notification.id || notification.notificationId,
      title: notification.title,
      content: notification.content || notification.message,
      type: notification.type,
      isRead: notification.isRead || false,
      createdAt: notification.createdAt || notification.createTime,
      priority: notification.priority || 'NORMAL'
    }));

    return {
      data: notifications,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('获取通知列表失败:', error);
    // Fallback to mock data
    try {
      validateToken();
      await delay(300);
      return mockResponse(mockNotifications.slice(0, limit));
    } catch (mockError) {
      if (mockError instanceof MockApiError) {
        throw mockError;
      }
      throw new MockApiError(mockError.message || '获取通知列表失败');
    }
  }
}

/**
 * 获取快捷操作列表
 * @returns {Promise} - 返回Promise对象
 */
export async function getQuickActions() {
  try {
    const res = await artemisRequest('/artemis/api/dashboard/v1/quick-actions', { method: 'GET' });
    const result = res?.data;
    console.log('获取快捷操作原始API响应:', JSON.stringify(result, null, 2));

    if (result.code !== '0' && result.code !== 200) {
      throw new Error(result.msg || '获取快捷操作失败');
    }

    // Return quick actions from API or transform if needed
    const quickActions = result.data || result || [];

    return {
      data: quickActions,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('获取快捷操作失败:', error);
    // Fallback to mock data
    try {
      validateToken();
      await delay(300);
      return mockResponse(mockQuickActions);
    } catch (mockError) {
      if (mockError instanceof MockApiError) {
        throw mockError;
      }
      throw new MockApiError(mockError.message || '获取快捷操作失败');
    }
  }
}

/**
 * 获取天气信息
 * @param {string} city - 城市名称，默认为用户当前城市
 * @returns {Promise} - 返回Promise对象
 */
export async function getWeatherInfo(city = null) {
  try {
    const queryParams = city ? `?city=${encodeURIComponent(city)}` : '';
    const res = await artemisRequest(`/artemis/api/weather/v1/current${queryParams}`, { method: 'GET', headers: { 'Content-Type': 'application/json', 'Accept': '*/*' } });
    const result = res?.data || res;

    console.log('获取天气信息原始API响应:', JSON.stringify(result, null, 2));

    if (result.code !== '0' && result.code !== 200) {
      throw new Error(result.msg || '获取天气信息失败');
    }

    // Transform response to expected format
    const weather = result.data || result;
    const transformedWeather = {
      city: weather.city || city || '未知城市',
      temperature: weather.temperature || weather.temp,
      weather: weather.weather || weather.condition,
      humidity: weather.humidity,
      windSpeed: weather.windSpeed,
      windDirection: weather.windDirection,
      forecast: weather.forecast || [],
      lastUpdate: weather.lastUpdate || weather.updateTime,
      ...weather // Keep original fields
    };

    return {
      data: transformedWeather,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('获取天气信息失败:', error);
    // Fallback to mock data
    await delay(300);
    return mockResponse({
      ...mockWeatherInfo,
      ...(city ? { city } : {})
    });
  }
}

/**
 * 获取公告列表
 * @param {number} limit - 限制数量，默认5条
 * @returns {Promise} - 返回Promise对象
 */
// export function getAnnouncements(limit = 5) {
//   return request({
//     url: '/dashboard/announcements',
//     method: 'get',
//     params: { limit }
//   });
// }

/**
 * 获取用户资料摘要
 * @returns {Promise} - 返回Promise对象
 */
export async function getUserProfileSummary() {
  try {
    validateToken();
    await delay(300);
    const user = getItem('user');
    if (!user || Object.keys(user).length === 0) {
      throw new Error('未登录');
    }
    return mockResponse(user);
  } catch (error) {
    if (error instanceof MockApiError) {
      throw error;
    }
    throw new MockApiError(error.message || '获取用户资料失败');
  }
}

/**
 * 标记通知为已读
 * @param {string} notificationId - 通知ID
 * @returns {Promise} - 返回Promise对象
 */
export async function markNotificationAsRead(notificationId) {
  try {
    validateToken();
    await delay(300);
    // 更新mock数据中的通知状态
    const notification = mockNotifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
    return mockResponse({ success: true });
  } catch (error) {
    if (error instanceof MockApiError) {
      throw error;
    }
    throw new MockApiError(error.message || '标记通知已读失败');
  }
}

/**
 * 批量标记通知为已读
 * @param {Array} notificationIds - 通知ID数组
 * @returns {Promise} - 返回Promise对象
 */
export async function markNotificationsAsRead(notificationIds) {
  try {
    validateToken();
    await delay(300);
    // 更新mock数据中的通知状态
    notificationIds.forEach(id => {
      const notification = mockNotifications.find(n => n.id === id);
      if (notification) {
        notification.read = true;
      }
    });
    return mockResponse({ success: true });
  } catch (error) {
    if (error instanceof MockApiError) {
      throw error;
    }
    throw new MockApiError(error.message || '批量标记通知已读失败');
  }
}

/**
 * 获取未读通知数量
 * @returns {Promise} - 返回Promise对象
 */
export async function getUnreadNotificationCount() {
  try {
    validateToken();
    await delay(300);
    // 统计未读通知数量
    const unreadCount = mockNotifications.filter(n => !n.read).length;
    return mockResponse({ count: unreadCount });
  } catch (error) {
    if (error instanceof MockApiError) {
      throw error;
    }
    throw new MockApiError(error.message || '获取未读通知数量失败');
  }
}

/**
 * 获取设备统计信息
 * @returns {Promise} - 返回Promise对象
 */
export async function getEquipmentStats() {
  try {
    const res = await artemisRequest('/artemis/api/v1/equipment/stats', { method: 'GET' });
    const result = res?.data;
    console.log('获取设备统计原始API响应:', JSON.stringify(result, null, 2));

    if (result.code !== '0' && result.code !== 200) {
      throw new Error(result.msg || '获取设备统计失败');
    }

    // Transform response to expected format
    const stats = result.data || result;
    const transformedStats = {
      total: stats.total || 0,
      available: stats.available || 0,
      inUse: stats.inUse || 0,
      maintenance: stats.maintenance || 0,
      ...stats // Keep original fields
    };

    return {
      data: transformedStats,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('获取设备统计失败:', error);
    // Fallback to mock data
    try {
      // 直接返回mock数据，避免在Node.js环境中使用localStorage
      await delay(500);
      return mockResponse({
        total: 150,
        available: 120,
        inUse: 25,
        maintenance: 5
      });
    } catch (mockError) {
      if (mockError instanceof MockApiError) {
        throw mockError;
      }
      throw new MockApiError(mockError.message || '获取设备统计失败');
    }
  }
}

/**
 * 获取测试任务统计信息
 * @returns {Promise} - 返回Promise对象
 */
export async function getTestTaskStats() {
  try {
    const res = await artemisRequest('/artemis/api/v1/test-task/stats', { method: 'GET' });
    const result = res?.data;
    console.log('获取测试任务统计原始API响应:', JSON.stringify(result, null, 2));

    if (result.code !== '0' && result.code !== 200) {
      throw new Error(result.msg || '获取测试任务统计失败');
    }

    // Transform response to expected format
    const stats = result.data || result;
    const transformedStats = {
      total: stats.total || 0,
      pending: stats.pending || 0,
      approved: stats.approved || 0,
      inProgress: stats.inProgress || 0,
      completed: stats.completed || 0,
      cancelled: stats.cancelled || 0,
      ...stats // Keep original fields
    };

    return {
      data: transformedStats,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('获取测试任务统计失败:', error);
    // Fallback to mock data
    try {
      validateToken();
      await delay(500);
      return mockResponse({
        total: 80,
        pending: 15,
        approved: 20,
        inProgress: 25,
        completed: 15,
        cancelled: 5
      });
    } catch (mockError) {
      if (mockError instanceof MockApiError) {
        throw mockError;
      }
      throw new MockApiError(mockError.message || '获取测试任务统计失败');
    }
  }
}

/**
 * 获取人员统计信息
 * @returns {Promise} - 返回Promise对象
 */
export async function getStaffStats() {
  try {
    const res = await artemisRequest('/artemis/api/v1/staff/stats', { method: 'GET' });
    const result = res?.data;
    console.log('获取人员统计原始API响应:', JSON.stringify(result, null, 2));

    if (result.code !== '0' && result.code !== 200) {
      throw new Error(result.msg || '获取人员统计失败');
    }

    // Transform response to expected format
    const stats = result.data || result;
    const transformedStats = {
      total: stats.total || 0,
      drivers: stats.drivers || 0,
      technicians: stats.technicians || 0,
      administrators: stats.administrators || 0,
      ...stats // Keep original fields
    };

    return {
      data: transformedStats,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('获取人员统计失败:', error);
    // Fallback to mock data
    try {
      validateToken();
      await delay(500);
      return mockResponse({
        total: 50,
        drivers: 25,
        technicians: 15,
        administrators: 10
      });
    } catch (mockError) {
      if (mockError instanceof MockApiError) {
        throw mockError;
      }
      throw new MockApiError(mockError.message || '获取人员统计失败');
    }
  }
}

/**
 * 获取预约统计信息
 * @returns {Promise} - 返回Promise对象
 */
export async function getBookingStats() {
  try {
    const res = await artemisRequest('/artemis/api/v1/booking/stats', { method: 'GET' });
    const result = res?.data;
    console.log('获取预约统计原始API响应:', JSON.stringify(result, null, 2));

    if (result.code !== '0' && result.code !== 200) {
      throw new Error(result.msg || '获取预约统计失败');
    }

    // Transform response to expected format
    const stats = result.data || result;
    const transformedStats = {
      total: stats.total || 0,
      pending: stats.pending || 0,
      confirmed: stats.confirmed || 0,
      completed: stats.completed || 0,
      cancelled: stats.cancelled || 0,
      ...stats // Keep original fields
    };

    return {
      data: transformedStats,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('获取预约统计失败:', error);
    // Fallback to mock data
    try {
      validateToken();
      await delay(500);
      return mockResponse({
        total: 200,
        pending: 30,
        confirmed: 120,
        completed: 40,
        cancelled: 10
      });
    } catch (mockError) {
      if (mockError instanceof MockApiError) {
        throw mockError;
      }
      throw new MockApiError(mockError.message || '获取预约统计失败');
    }
  }
}

/**
 * 获取告警统计信息
 * @returns {Promise} - 返回Promise对象
 */
export async function getAlertStats() {
  try {
    const res = await artemisRequest('/artemis/api/v1/alert/stats', { method: 'GET' });
    const result = res?.data;
    console.log('获取告警统计原始API响应:', JSON.stringify(result, null, 2));

    if (result.code !== '0' && result.code !== 200) {
      throw new Error(result.msg || '获取告警统计失败');
    }

    // Transform response to expected format
    const stats = result.data || result;
    const transformedStats = {
      total: stats.total || 0,
      active: stats.active || 0,
      handled: stats.handled || 0,
      critical: stats.critical || 0,
      warning: stats.warning || 0,
      info: stats.info || 0,
      ...stats // Keep original fields
    };

    return {
      data: transformedStats,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('获取告警统计失败:', error);
    // Fallback to mock data
    try {
      validateToken();
      await delay(500);
      return mockResponse({
        total: 50,
        active: 10,
        handled: 40,
        critical: 2,
        warning: 5,
        info: 3
      });
    } catch (mockError) {
      if (mockError instanceof MockApiError) {
        throw mockError;
      }
      throw new MockApiError(mockError.message || '获取告警统计失败');
    }
  }
}

/**
 * 获取系统整体统计信息
 * @returns {Promise} - 返回Promise对象
 */
export async function getSystemStats() {
  try {
    const res = await artemisRequest('/artemis/api/v1/system/stats', { method: 'GET' });
    const result = res?.data;
    console.log('获取系统统计原始API响应:', JSON.stringify(result, null, 2));

    if (result.code !== '0' && result.code !== 200) {
      throw new Error(result.msg || '获取系统统计失败');
    }

    // Transform response to expected format
    const stats = result.data || result;
    const transformedStats = {
      totalVehicles: stats.totalVehicles || 0,
      totalEquipment: stats.totalEquipment || 0,
      totalStaff: stats.totalStaff || 0,
      totalBookings: stats.totalBookings || 0,
      totalTestTasks: stats.totalTestTasks || 0,
      activeAlerts: stats.activeAlerts || 0,
      pendingApprovals: stats.pendingApprovals || 0,
      ...stats // Keep original fields
    };

    return {
      data: transformedStats,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('获取系统统计失败:', error);
    // Fallback to mock data
    try {
      validateToken();
      await delay(500);
      return mockResponse({
        totalVehicles: 100,
        totalEquipment: 150,
        totalStaff: 50,
        totalBookings: 200,
        totalTestTasks: 80,
        activeAlerts: 10,
        pendingApprovals: 15
      });
    } catch (mockError) {
      if (mockError instanceof MockApiError) {
        throw mockError;
      }
      throw new MockApiError(mockError.message || '获取系统统计失败');
    }
  }
}
