import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  getTestSites,
  getTestSiteById,
  getAvailableTimeSlots
} from '../api/testSite';

export const useTestSiteStore = defineStore('testSite', () => {
  // 状态
  const testSites = ref([]);
  const currentTestSite = ref(null);
  const availableTimeSlots = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // 方法
  const fetchTestSites = async (params = {}) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await getTestSites(params);
      // Handle paginated response - extract content array
      testSites.value = response.data.content || response.data;
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

  const fetchTestSiteDetail = async (siteId) => {
    return await fetchTestSiteById(siteId);
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

  return {
    testSites,
    currentTestSite,
    availableTimeSlots,
    loading,
    error,
    fetchTestSites,
    fetchTestSiteById,
    fetchTestSiteDetail,
    fetchAvailableTimeSlots
  };
});