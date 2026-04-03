import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  getBookings,
  createBooking,
  getBookingById,
  updateBooking,
  cancelBooking,
  getAvailableTimeSlots,
  approveBooking as approveBookingApi,
  rescheduleBooking as rescheduleBookingApi
} from '../api/booking';
import { getWeatherInfo } from '../api/weather';
import { getUserInfo } from '../utils/auth.js';

export const useBookingStore = defineStore('booking', () => {
  // 状态
  const bookings = ref([]);
  const currentBooking = ref(null);
  const availableTimeSlots = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // 方法
  const fetchBookings = async (params = {}) => {
    loading.value = true;
    error.value = null;

    try {
      // 获取当前用户信息并添加到参数中
      const userInfo = getUserInfo();
      const userId = userInfo?.userId || userInfo?.id;
      
      // 如果没有传入 userId 且能获取到当前用户ID，则自动添加
      if (!params.userId && userId) {
        params.userId = userId;
      }

      const bookingsData = await getBookings(params);
      
      // 确保 bookingsData 是数组
      let rawBookings = [];
      if (Array.isArray(bookingsData)) {
        rawBookings = bookingsData;
      } else if (bookingsData && Array.isArray(bookingsData.data)) {
        rawBookings = bookingsData.data;
      } else {
        console.warn('返回的数据格式不正确:', bookingsData);
        rawBookings = [];
      }

      // 按创建时间降序排序，最近的预约在前面
      rawBookings.sort((a, b) => {
        const timeA = a.createTime || a.createdAt || a.startTime || '';
        const timeB = b.createTime || b.createdAt || b.startTime || '';
        return new Date(timeB) - new Date(timeA);
      });

      bookings.value = rawBookings;
      return bookingsData;
    } catch (err) {
      console.error('fetchBookings 错误:', err);
      error.value = err.response?.data?.message || err.message || '获取预约列表失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchBookingById = async (id) => {
    loading.value = true;
    error.value = null;

    try {
      const bookingData = await getBookingById(id);
      currentBooking.value = bookingData;
      return bookingData;
    } catch (err) {
      error.value = err.response?.data?.message || err.message || '获取预约详情失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const addBooking = async (bookingData) => {
    loading.value = true;
    error.value = null;

    try {
      const booking = await createBooking(bookingData);
      await fetchBookings();
      return booking;
    } catch (err) {
      error.value = err.response?.data?.message || err.message || '创建预约失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const updateBookingById = async (id, bookingData) => {
    loading.value = true;
    error.value = null;

    try {
      const booking = await updateBooking(id, bookingData);
      if (currentBooking.value?.id === id) {
        currentBooking.value = booking;
      }
      await fetchBookings();
      return booking;
    } catch (err) {
      error.value = err.response?.data?.message || err.message || '更新预约失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const cancelBookingById = async (id) => {
    loading.value = true;
    error.value = null;

    try {
      await cancelBooking(id);
      if (currentBooking.value?.id === id) {
        currentBooking.value.status = 'CANCELLED';
      }
      await fetchBookings();
    } catch (err) {
      error.value = err.response?.data?.message || '取消预约失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchAvailableTimeSlots = async (date) => {
    loading.value = true;
    error.value = null;

    try {
      const slots = await getAvailableTimeSlots(date);
      availableTimeSlots.value = slots;
      return slots;
    } catch (err) {
      error.value = err.response?.data?.message || err.message || '获取可用时间段失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  // 获取天气信息
  const fetchWeatherInfo = async ({ siteId, date }) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await getWeatherInfo(siteId, date);
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取天气信息失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  // 审批预约
  const approveBooking = async (id, data) => {
    try {
      const response = await approveBookingApi(id, data);
      return response.data;
    } catch (error) {
      console.error('审批预约失败:', error);
      throw error.response?.data?.message || '审批预约失败';
    }
  };

  // 改期预约
  const rescheduleBooking = async (id, data) => {
    try {
      const response = await rescheduleBookingApi({ id, ...data });
      return response.data;
    } catch (error) {
      console.error('改期预约失败:', error);
      throw error.response?.data?.message || '改期预约失败';
    }
  };

  return {
    // 状态
    bookings,
    currentBooking,
    availableTimeSlots,
    loading,
    error,

    // 方法
    fetchBookings,
    fetchBookingById,
    addBooking,
    updateBookingById,
    cancelBookingById,
    fetchAvailableTimeSlots,
    fetchWeatherInfo,
    approveBooking,
    rescheduleBooking
  };
});
