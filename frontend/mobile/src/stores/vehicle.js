import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getVehicles, getVehicleById, addVehicle, updateVehicle, deleteVehicle } from '../api/vehicle';

export const useVehicleStore = defineStore('vehicle', () => {
  // 状态
  const vehicles = ref([]);
  const currentVehicle = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // 方法
  const fetchVehicles = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await getVehicles();
      vehicles.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取车辆列表失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchVehicleById = async (id) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await getVehicleById(id);
      currentVehicle.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取车辆详情失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const createVehicle = async (vehicleData) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await addVehicle(vehicleData);
      // 添加成功后刷新列表
      await fetchVehicles();
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '添加车辆失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const updateVehicleById = async (id, vehicleData) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await updateVehicle(id, vehicleData);
      // 更新成功后刷新列表和当前车辆
      if (currentVehicle.value && currentVehicle.value.id === id) {
        currentVehicle.value = response.data;
      }
      await fetchVehicles();
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '更新车辆信息失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const removeVehicle = async (id) => {
    loading.value = true;
    error.value = null;
    
    try {
      await deleteVehicle(id);
      // 删除成功后刷新列表
      vehicles.value = vehicles.value.filter(vehicle => vehicle.id !== id);
      if (currentVehicle.value && currentVehicle.value.id === id) {
        currentVehicle.value = null;
      }
      return true;
    } catch (err) {
      error.value = err.response?.data?.message || '删除车辆失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  return {
    vehicles,
    currentVehicle,
    loading,
    error,
    fetchVehicles,
    fetchVehicleById,
    createVehicle,
    updateVehicleById,
    removeVehicle
  };
});