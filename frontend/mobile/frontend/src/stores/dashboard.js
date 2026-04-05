import { defineStore } from 'pinia';
import { ref } from 'vue';
import { 
  getRecentBookings, 
  getNotifications, 
  getQuickActions, 
  getWeatherInfo, 
  getMobileDashboardStats,
  getEquipmentStats,
  getTestTaskStats,
  getStaffStats,
  getBookingStats,
  getAlertStats,
  getSystemStats,
  // getAnnouncements, 
  getUserProfileSummary,
  markNotificationAsRead,
  markNotificationsAsRead,
  getUnreadNotificationCount
} from '../api/dashboard';
import { getBookings } from '../api/booking';
import { getTestTasks } from '../api/testTask';
import * as alertApi from '../api/alert';
import { getItem } from '../utils/storage.js';

export const useMobileDashboardStore = defineStore('mobileDashboard', () => {
  // 状态
  const dashboardStats = ref({
    appointments: { total: 0, pending: 0, confirmed: 0, completed: 0 },
    vehicles: { total: 0, active: 0, maintenance: 0 },
    testRegistrations: { total: 0, pending: 0, approved: 0, completed: 0 },
    pendingBookings: 0,
    testScore: 0,
    totalBookings: 0,
    completedTests: 0,
    activeAlerts: 0
  });
  const equipmentStats = ref({
    total: 0,
    available: 0,
    inUse: 0,
    maintenance: 0
  });
  const testTaskStats = ref({
    total: 0,
    pending: 0,
    approved: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0
  });
  const staffStats = ref({
    total: 0,
    drivers: 0,
    technicians: 0,
    administrators: 0
  });
  const bookingStats = ref({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0
  });
  const alertStats = ref({
    total: 0,
    active: 0,
    handled: 0,
    critical: 0,
    warning: 0,
    info: 0
  });
  const systemStats = ref({
    totalVehicles: 0,
    totalEquipment: 0,
    totalStaff: 0,
    totalBookings: 0,
    totalTestTasks: 0,
    activeAlerts: 0,
    pendingApprovals: 0
  });
  const recentBookings = ref([]);
  const notifications = ref([]);
  const quickActions = ref([]);
  const weatherInfo = ref(null);
  const announcements = ref([]);
  const alerts = ref([]);
  const userProfile = ref({});
  const unreadNotificationCount = ref(0);
  const loading = ref(false);
  const error = ref(null);

  // 方法
  const fetchDashboardStats = async () => {
    loading.value = true;
    error.value = null;

    // 检查登录状态
    const token = getItem('token');
    const user = getItem('user');
    
    if (!token || !user || Object.keys(user).length === 0) {
      error.value = '请先登录';
      throw new Error('请先登录');
    }
    
    try {
      const response = await getMobileDashboardStats();
      if (!response.data) {
        throw new Error('获取仪表板数据失败');
      }
      dashboardStats.value = response.data;
      return response.data;
    } catch (err) {
      console.error('获取仪表板数据失败:', err);
      error.value = err.message || '获取仪表板统计信息失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchRecentBookings = async (limit = 5) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await getRecentBookings(limit);
      recentBookings.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取最近预约记录失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchNotifications = async (limit = 10) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await getNotifications(limit);
      notifications.value = response.data;
      announcements.value = response.data; // 同时更新 announcements
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取通知列表失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchQuickActions = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await getQuickActions();
      quickActions.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取快捷操作失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchWeatherInfo = async (city = null) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await getWeatherInfo(city);
      weatherInfo.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取天气信息失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  // const fetchAnnouncements = async (limit = 5) => {
  //   loading.value = true;
  //   error.value = null;
    
  //   try {
  //     const response = await getAnnouncements(limit);
  //     announcements.value = response.data;
  //     return response.data;
  //   } catch (err) {
  //     error.value = err.response?.data?.message || '获取公告列表失败';
  //     throw error.value;
  //   } finally {
  //     loading.value = false;
  //   }
  // };

  const fetchUserProfile = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await getUserProfileSummary();
      userProfile.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取用户资料失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const markAsRead = async (notificationId) => {
    loading.value = true;
    error.value = null;
    
    try {
      await markNotificationAsRead(notificationId);
      // 标记成功后更新本地状态
      const notification = notifications.value.find(n => n.id === notificationId);
      if (notification) {
        notification.isRead = true;
      }
      // 更新未读数量
      await fetchUnreadCount();
      return true;
    } catch (err) {
      error.value = err.response?.data?.message || '标记通知已读失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const markAllAsRead = async (notificationIds) => {
    loading.value = true;
    error.value = null;
    
    try {
      await markNotificationsAsRead(notificationIds);
      // 批量标记成功后更新本地状态
      notifications.value.forEach(notification => {
        if (notificationIds.includes(notification.id)) {
          notification.isRead = true;
        }
      });
      // 更新未读数量
      await fetchUnreadCount();
      return true;
    } catch (err) {
      error.value = err.response?.data?.message || '批量标记通知已读失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await getUnreadNotificationCount();
      unreadNotificationCount.value = response.data.count;
      return response.data.count;
    } catch (err) {
      error.value = err.response?.data?.message || '获取未读通知数量失败';
      throw error.value;
    }
  };

  // 获取告警信息列表
  const fetchAlerts = async (params = {}) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await alertApi.getAlertList(params);
      const data = response?.data?.content || response?.data || [];
      alerts.value = data;
      
      // 更新告警统计
      dashboardStats.value.activeAlerts = data.filter(alert => alert.status === 'active').length;
      
      return data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取告警信息失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  // 获取告警详情
  const fetchAlertById = async (id) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await alertApi.getAlertById(id);
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取告警详情失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  // 处理告警
  const handleAlert = async (id, data) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await alertApi.handleAlert(id, data);
      
      // 更新本地告警状态
      const alertIndex = alerts.value.findIndex(alert => alert.id === id);
      if (alertIndex !== -1) {
        alerts.value[alertIndex] = { ...alerts.value[alertIndex], ...data };
      }
      
      // 更新告警统计
      dashboardStats.value.activeAlerts = alerts.value.filter(alert => alert.status === 'active').length;
      
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '处理告警失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  // 批量处理告警
  const batchHandleAlerts = async (ids, data) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await alertApi.batchHandleAlerts(ids, data);
      
      // 更新本地告警状态
      alerts.value.forEach(alert => {
        if (ids.includes(alert.id)) {
          Object.assign(alert, data);
        }
      });
      
      // 更新告警统计
      dashboardStats.value.activeAlerts = alerts.value.filter(alert => alert.status === 'active').length;
      
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '批量处理告警失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  // 组装统计数据
  const assembleDashboardStats = async () => {
    try {
      const stats = {
        appointments: { total: 0, pending: 0, confirmed: 0, completed: 0 },
        vehicles: { total: 0, active: 0, maintenance: 0 },
        testRegistrations: { total: 0, pending: 0, approved: 0, completed: 0 },
        pendingBookings: 0,
        testScore: 0,
        totalBookings: 0,
        completedTests: 0
      };

      // 获取预约数据
      try {
        const bookingsResponse = await getBookings({ pageNum: 1, pageSize: 1000 });
        const bookings = bookingsResponse || [];
        
        // 统计预约数据
        stats.totalBookings = bookings.length;
        stats.appointments.total = bookings.length;
        
        bookings.forEach(booking => {
          const status = booking.status?.toUpperCase();
          if (status === 'PENDING') {
            stats.appointments.pending++;
            stats.pendingBookings++;
          } else if (status === 'CONFIRMED') {
            stats.appointments.confirmed++;
          } else if (status === 'COMPLETED') {
            stats.appointments.completed++;
          }
        });
      } catch (err) {
        // 静默处理错误
        // console.error('获取预约统计数据失败:', err);
      }

      // 获取测试数据
      try {
        const testTasksResponse = await getTestTasks({ page: 0, size: 1000 });
        const testTasks = testTasksResponse?.data?.content || testTasksResponse?.data || [];
        
        // 统计测试数据
        stats.testRegistrations.total = testTasks.length;
        stats.completedTests = testTasks.filter(task => 
          task.status?.toUpperCase() === 'COMPLETED'
        ).length;
        
        testTasks.forEach(task => {
          const status = task.status?.toUpperCase();
          if (status === 'PENDING') {
            stats.testRegistrations.pending++;
          } else if (status === 'APPROVED') {
            stats.testRegistrations.approved++;
          } else if (status === 'COMPLETED') {
            stats.testRegistrations.completed++;
          }
        });

        // 计算平均测试分数
        const completedTasksWithScores = testTasks.filter(task => 
          task.status?.toUpperCase() === 'COMPLETED' && 
          task.score !== undefined && 
          task.score !== null
        );
        
        if (completedTasksWithScores.length > 0) {
          const totalScore = completedTasksWithScores.reduce((sum, task) => sum + (task.score || 0), 0);
          stats.testScore = Math.round(totalScore / completedTasksWithScores.length);
        }
      } catch (err) {
        // 静默处理错误
        // console.error('获取测试统计数据失败:', err);
      }

      dashboardStats.value = stats;
      return stats;
    } catch (err) {
      // 静默处理错误
      // console.error('组装统计数据失败:', err);
      return {
        appointments: { total: 0, pending: 0, confirmed: 0, completed: 0 },
        vehicles: { total: 0, active: 0, maintenance: 0 },
        testRegistrations: { total: 0, pending: 0, approved: 0, completed: 0 },
        pendingBookings: 0,
        testScore: 0,
        totalBookings: 0,
        completedTests: 0
      };
    }
  };

  // 获取设备统计
  const fetchEquipmentStats = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await getEquipmentStats();
      equipmentStats.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取设备统计失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  // 获取测试任务统计
  const fetchTestTaskStats = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await getTestTaskStats();
      testTaskStats.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取测试任务统计失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  // 获取人员统计
  const fetchStaffStats = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await getStaffStats();
      staffStats.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取人员统计失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  // 获取预约统计
  const fetchBookingStats = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await getBookingStats();
      bookingStats.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取预约统计失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  // 获取告警统计
  const fetchAlertStats = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await getAlertStats();
      alertStats.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取告警统计失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  // 获取系统统计
  const fetchSystemStats = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await getSystemStats();
      systemStats.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取系统统计失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  // 初始化仪表板数据
  const initializeDashboard = async () => {
    try {
      // 按重要性分组执行，避免一个失败影响所有数据
      // 第一组：核心数据
      try {
        await Promise.all([
          assembleDashboardStats(),
          fetchRecentBookings(5),
          fetchSystemStats()
        ]);
      } catch (err) {
        // 静默处理错误，让应用继续运行
        // console.error('核心数据加载失败:', err);
      }

      // 第二组：次要数据
      try {
        await Promise.all([
          fetchQuickActions(),
          fetchUserProfile(),
          fetchEquipmentStats(),
          fetchTestTaskStats(),
          fetchStaffStats(),
          fetchBookingStats(),
          fetchAlertStats()
        ]);
      } catch (err) {
        // 静默处理错误，让应用继续运行
        // console.error('用户数据加载失败:', err);
      }

      // 第三组：附加数据
      try {
        await Promise.all([
          fetchNotifications(10),
          fetchWeatherInfo(),
          fetchUnreadCount()
        ]);
      } catch (err) {
        // 静默处理错误，让应用继续运行
        // console.error('附加数据加载失败:', err);
      }

    } catch (err) {
      // 静默处理错误，让应用继续运行
      // error.value = err.message || '初始化仪表板数据失败';
      // throw error.value;
    }
  };

  return {
    dashboardStats,
    equipmentStats,
    testTaskStats,
    staffStats,
    bookingStats,
    alertStats,
    systemStats,
    recentBookings,
    notifications,
    quickActions,
    weatherInfo,
    announcements,
    alerts,
    userProfile,
    unreadNotificationCount,
    loading,
    error,
    fetchDashboardStats,
    fetchRecentBookings,
    fetchNotifications,
    fetchQuickActions,
    fetchWeatherInfo,
    // fetchAnnouncements,
    fetchUserProfile,
    markAsRead,
    markAllAsRead,
    fetchUnreadCount,
    fetchAlerts,
    fetchAlertById,
    handleAlert,
    batchHandleAlerts,
    fetchEquipmentStats,
    fetchTestTaskStats,
    fetchStaffStats,
    fetchBookingStats,
    fetchAlertStats,
    fetchSystemStats,
    initializeDashboard
  };
});
