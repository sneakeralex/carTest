import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  getMaintenanceRecords,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  cancelMaintenance
} from '../api/maintenance.js';

export const useMaintenanceStore = defineStore('maintenance', () => {
  // 状态
  const maintenanceRecords = ref([]);
  const currentMaintenance = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // 获取维护记录列表
  const fetchMaintenanceRecords = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      console.log('🏪 Store: 开始调用维护记录API...');
      const response = await getMaintenanceRecords();
      console.log('✅ Store: API调用成功，处理响应数据...');
      
      // 确保返回的数据是数组
      let records;
      if (Array.isArray(response.data)) {
        records = response.data;
      } else if (response.data?.records) {
        records = response.data.records;
      } else if (response.data?.data) {
        records = response.data.data;
      } else {
        records = [];
      }
      
      console.log('✅ Store: 最终处理的records数量:', records.length);
      
      maintenanceRecords.value = records;
      return records;
    } catch (err) {
      error.value = err.response?.data?.message || '获取维护记录失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  // 获取维护详情
  const fetchMaintenanceById = async (id) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await getMaintenanceById(id);
      currentMaintenance.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取维护详情失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  // 获取维护详情的别名方法 (为了兼容性)
  const fetchMaintenanceDetail = fetchMaintenanceById;

  // 创建维护记录
  const createMaintenanceRecord = async (maintenanceData) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await createMaintenance(maintenanceData);
      await fetchMaintenanceRecords(); // 刷新列表
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '创建维护记录失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  // 更新维护记录
  const updateMaintenanceRecord = async (id, maintenanceData) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await updateMaintenance(id, maintenanceData);
      if (currentMaintenance.value?.id === id) {
        currentMaintenance.value = response.data;
      }
      await fetchMaintenanceRecords(); // 刷新列表
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '更新维护记录失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  // 取消维护记录
  const cancelMaintenanceRecord = async (id) => {
    loading.value = true;
    error.value = null;
    
    try {
      await cancelMaintenance(id);
      if (currentMaintenance.value?.id === id) {
        currentMaintenance.value.status = 'CANCELLED';
      }
      await fetchMaintenanceRecords(); // 刷新列表
      return true;
    } catch (err) {
      error.value = err.response?.data?.message || '取消维护记录失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  return {
    // 状态
    maintenanceRecords,
    currentMaintenance,
    loading,
    error,

    // 方法
    fetchMaintenanceRecords,
    fetchMaintenanceById,
    fetchMaintenanceDetail,
    createMaintenanceRecord,
    updateMaintenanceRecord,
    cancelMaintenanceRecord
  };
});
