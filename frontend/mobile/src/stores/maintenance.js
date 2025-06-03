import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getMaintenanceRecords, getMaintenanceById, createMaintenance, updateMaintenance, cancelMaintenance } from '../api/maintenance';

export const useMaintenanceStore = defineStore('maintenance', () => {
  // 状态
  const maintenanceRecords = ref([]);
  const currentMaintenance = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // 方法
  const fetchMaintenanceRecords = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await getMaintenanceRecords();
      maintenanceRecords.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取维修保养记录失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchMaintenanceById = async (id) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await getMaintenanceById(id);
      currentMaintenance.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取维修保养详情失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const addMaintenance = async (maintenanceData) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await createMaintenance(maintenanceData);
      // 添加成功后刷新列表
      await fetchMaintenanceRecords();
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '创建维修保养记录失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const updateMaintenanceById = async (id, maintenanceData) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await updateMaintenance(id, maintenanceData);
      // 更新成功后刷新列表和当前维修保养记录
      if (currentMaintenance.value && currentMaintenance.value.id === id) {
        currentMaintenance.value = response.data;
      }
      await fetchMaintenanceRecords();
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '更新维修保养记录失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const cancelMaintenanceById = async (id) => {
    loading.value = true;
    error.value = null;
    
    try {
      await cancelMaintenance(id);
      // 取消成功后刷新列表
      if (currentMaintenance.value && currentMaintenance.value.id === id) {
        currentMaintenance.value.status = 'CANCELLED';
      }
      await fetchMaintenanceRecords();
      return true;
    } catch (err) {
      error.value = err.response?.data?.message || '取消维修保养记录失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  return {
    maintenanceRecords,
    currentMaintenance,
    loading,
    error,
    fetchMaintenanceRecords,
    fetchMaintenanceById,
    addMaintenance,
    updateMaintenanceById,
    cancelMaintenanceById
  };
});