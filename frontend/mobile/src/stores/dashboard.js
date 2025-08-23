import { defineStore } from 'pinia';
import { ref } from 'vue';
import { 
  getMobileDashboardStats, 
  getRecentBookings, 
  getNotifications, 
  getQuickActions, 
  getWeatherInfo, 
  // getAnnouncements, 
  getUserProfileSummary,
  markNotificationAsRead,
  markNotificationsAsRead,
  getUnreadNotificationCount
} from '../api/dashboard';

export const useMobileDashboardStore = defineStore('mobileDashboard', () => {
  // 状态
  const dashboardStats = ref(null);
  const recentBookings = ref([]);
  const notifications = ref([]);
  const quickActions = ref([]);
  const weatherInfo = ref(null);
  const announcements = ref([]);
  const userProfile = ref(null);
  const unreadNotificationCount = ref(0);
  const loading = ref(false);
  const error = ref(null);

  // 方法
  const fetchDashboardStats = async () => {
    loading.value = true;
    error.value = null;

    const userid = localStorage.getItem('user');
    
    try {
      const response = await getMobileDashboardStats(userid);
      dashboardStats.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取仪表板统计信息失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchRecentBookings = async (limit = 5) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await getRecentBookings(userid, limit);
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
      const response = await getQuickActions(userid);
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

  // 初始化仪表板数据
  const initializeDashboard = async () => {
    try {
      await Promise.all([
        fetchDashboardStats(),
        fetchRecentBookings(5),
        fetchNotifications(10),
        fetchQuickActions(),
        fetchWeatherInfo(),
        // fetchAnnouncements(5),
        fetchUserProfile(),
        fetchUnreadCount()
      ]);
    } catch (err) {
      error.value = '初始化仪表板数据失败';
      throw error.value;
    }
  };

  return {
    dashboardStats,
    recentBookings,
    notifications,
    quickActions,
    weatherInfo,
    announcements,
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
    initializeDashboard
  };
});
