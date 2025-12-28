import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getSchedule, getWeather, createBooking } from '../api/schedule';

export const useScheduleStore = defineStore('schedule', () => {
  const loading = ref(false);
  const error = ref(null);
  const currentBooking = ref({
    taskId: null,
    vehicleId: null,
    testSiteId: null,
    date: null,
    timeSlot: null, // 'AM' or 'PM'
  });
  const scheduleData = ref({});
  const weatherData = ref({});
  
  // 获取场地排期
  const fetchSchedule = async (params) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await getSchedule(params);
      scheduleData.value = {
        ...scheduleData.value,
        [params.testSiteId]: response.data
      };
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取场地排期失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  // 获取天气信息
  const fetchWeather = async (params) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await getWeather(params);
      weatherData.value = {
        ...weatherData.value,
        [params.testSiteId]: response.data
      };
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取天气信息失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  // 创建预约
  const submitBooking = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await createBooking(currentBooking.value);
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '创建预约失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  // 更新当前预约信息
  const updateBookingInfo = (info) => {
    currentBooking.value = {
      ...currentBooking.value,
      ...info
    };
  };

  // 检查时段是否可用
  const isTimeSlotAvailable = (testSiteId, timeSlot) => {
    const siteSchedule = scheduleData.value[testSiteId];
    return siteSchedule && siteSchedule[timeSlot]?.available;
  };

  // 获取天气提示信息
  const getWeatherWarning = (testSiteId) => {
    const siteWeather = weatherData.value[testSiteId];
    return siteWeather?.warning || null;
  };

  return {
    loading,
    error,
    currentBooking,
    scheduleData,
    weatherData,
    fetchSchedule,
    fetchWeather,
    submitBooking,
    updateBookingInfo,
    isTimeSlotAvailable,
    getWeatherWarning,
  };
});
