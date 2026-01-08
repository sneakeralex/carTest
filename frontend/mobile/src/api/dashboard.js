import { get } from 'vant/lib/utils/basic.js';
import { 
  mockDashboardStats, 
  mockRecentBookings, 
  mockNotifications, 
  mockQuickActions,
  mockWeatherInfo
} from '../mock/dashboard.js';
import { delay, mockResponse, validateToken, MockApiError } from '../mock/utils.js';
import { useBookingStore } from '../stores/booking';
import { artemisRequest } from './request';

const bookingStore = useBookingStore();
/**
 * 获取移动端仪表板统计信息
 * @returns {Promise} - 返回Promise对象
 */
export async function getMobileDashboardStats() {
  try {
    const res = await artemisRequest('/artemis/api/dashboard/v1/mobile/stats', { method: 'GET' });
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
    // 调用 booking.js 中的 getBookings 方法
    const bookingsData = await bookingStore.fetchBookings({   
      pageNum: 1,
      pageSize: limit
    });

    // Transform response to expected format based on actual API response
    const bookings = (bookingsData || []).map(booking => ({
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
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      throw new Error('未登录');
    }
    const user = JSON.parse(userStr);
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
