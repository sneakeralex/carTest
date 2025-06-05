import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  getTestSites,
  getTestSiteById,
  getAvailableTimeSlots,
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
  getUserBookings,
  getBookingStats
} from '../api/testSite';

export const useTestSiteStore = defineStore('testSite', () => {
  // 状态
  const testSites = ref([]);
  const currentTestSite = ref(null);
  const bookings = ref([]);
  const currentBooking = ref(null);
  const availableTimeSlots = ref([]);
  const bookingStats = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // 方法
  const fetchTestSites = async (params = {}) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await getTestSites(params);
      testSites.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取测试场列表失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchTestSiteById = async (siteId) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await getTestSiteById(siteId);
      currentTestSite.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取测试场详情失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchAvailableTimeSlots = async (params) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await getAvailableTimeSlots(params);
      availableTimeSlots.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取可用时间段失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const addBooking = async (bookingData) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await createBooking(bookingData);
      // 添加成功后刷新预约列表
      await fetchBookings();
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '创建预约失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchBookings = async (params = {}) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await getBookings(params);
      bookings.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取预约列表失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchBookingById = async (bookingId) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await getBookingById(bookingId);
      currentBooking.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取预约详情失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const updateBookingById = async (bookingId, bookingData) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await updateBooking(bookingId, bookingData);
      // 更新成功后刷新列表和当前预约
      if (currentBooking.value && currentBooking.value.bookingId === bookingId) {
        currentBooking.value = response.data;
      }
      await fetchBookings();
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '更新预约失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const cancelBookingById = async (bookingId, reason) => {
    loading.value = true;
    error.value = null;

    try {
      await cancelBooking(bookingId, { reason });
      // 取消成功后刷新列表
      if (currentBooking.value && currentBooking.value.bookingId === bookingId) {
        currentBooking.value.status = 'CANCELLED';
      }
      await fetchBookings();
      return true;
    } catch (err) {
      error.value = err.response?.data?.message || '取消预约失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchUserBookings = async (userId) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await getUserBookings(userId);
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取用户预约列表失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

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

  return {
    testSites,
    currentTestSite,
    bookings,
    currentBooking,
    availableTimeSlots,
    bookingStats,
    loading,
    error,
    fetchTestSites,
    fetchTestSiteById,
    fetchAvailableTimeSlots,
    addBooking,
    fetchBookings,
    fetchBookingById,
    updateBookingById,
    cancelBookingById,
    fetchUserBookings,
    fetchBookingStats
  };
});