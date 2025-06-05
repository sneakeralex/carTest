import { defineStore } from 'pinia';
import { ref } from 'vue';
import { 
  getTestTasks, 
  getTestTaskById, 
  getTestRegistrations, 
  getTestRegistrationById, 
  createTestRegistration, 
  updateTestRegistration, 
  cancelTestRegistration,
  scheduleTest,
  completeTest,
  getUserTestRegistrations,
  getTaskRegistrations,
  getTestStats
} from '../api/testTask';

export const useTestTaskStore = defineStore('testTask', () => {
  // 状态
  const testTasks = ref([]);
  const currentTestTask = ref(null);
  const testRegistrations = ref([]);
  const currentTestRegistration = ref(null);
  const userTestRegistrations = ref([]);
  const testStats = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // 方法
  const fetchTestTasks = async (params = {}) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await getTestTasks(params);
      testTasks.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取测试任务列表失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchTestTaskById = async (taskId) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await getTestTaskById(taskId);
      currentTestTask.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取测试任务详情失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchTestRegistrations = async (params = {}) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await getTestRegistrations(params);
      testRegistrations.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取测试报名列表失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchTestRegistrationById = async (registrationId) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await getTestRegistrationById(registrationId);
      currentTestRegistration.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取测试报名详情失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const addTestRegistration = async (registrationData) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await createTestRegistration(registrationData);
      // 添加成功后刷新报名列表
      await fetchTestRegistrations();
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '创建测试报名失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const updateTestRegistrationById = async (registrationId, registrationData) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await updateTestRegistration(registrationId, registrationData);
      // 更新成功后刷新列表和当前报名
      if (currentTestRegistration.value && currentTestRegistration.value.registrationId === registrationId) {
        currentTestRegistration.value = response.data;
      }
      await fetchTestRegistrations();
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '更新测试报名失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const cancelTestRegistrationById = async (registrationId) => {
    loading.value = true;
    error.value = null;
    
    try {
      await cancelTestRegistration(registrationId);
      // 取消成功后刷新列表
      if (currentTestRegistration.value && currentTestRegistration.value.registrationId === registrationId) {
        currentTestRegistration.value.status = 'CANCELLED';
      }
      await fetchTestRegistrations();
      return true;
    } catch (err) {
      error.value = err.response?.data?.message || '取消测试报名失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const scheduleTestById = async (registrationId, scheduleData) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await scheduleTest(registrationId, scheduleData);
      // 安排成功后刷新当前报名
      if (currentTestRegistration.value && currentTestRegistration.value.registrationId === registrationId) {
        currentTestRegistration.value = response.data;
      }
      await fetchTestRegistrations();
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '安排测试时间失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const completeTestById = async (registrationId, resultData) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await completeTest(registrationId, resultData);
      // 完成成功后刷新当前报名
      if (currentTestRegistration.value && currentTestRegistration.value.registrationId === registrationId) {
        currentTestRegistration.value = response.data;
      }
      await fetchTestRegistrations();
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '完成测试失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchUserTestRegistrations = async (userId) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await getUserTestRegistrations(userId);
      userTestRegistrations.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取用户测试报名列表失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchTaskRegistrations = async (taskId) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await getTaskRegistrations(taskId);
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取任务报名列表失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchTestStats = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await getTestStats();
      testStats.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取测试统计失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  return {
    testTasks,
    currentTestTask,
    testRegistrations,
    currentTestRegistration,
    userTestRegistrations,
    testStats,
    loading,
    error,
    fetchTestTasks,
    fetchTestTaskById,
    fetchTestRegistrations,
    fetchTestRegistrationById,
    addTestRegistration,
    updateTestRegistrationById,
    cancelTestRegistrationById,
    scheduleTestById,
    completeTestById,
    fetchUserTestRegistrations,
    fetchTaskRegistrations,
    fetchTestStats
  };
});
