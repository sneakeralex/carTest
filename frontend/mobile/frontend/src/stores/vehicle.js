import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  getMobileVehicles,
  getMobileVehicleById,
  getVehicleBrands,
  getVehicleModels,
  getVehicleTypes
} from '../api/vehicle';

export const useMobileVehicleStore = defineStore('mobileVehicle', () => {
  // 状态
  const vehicles = ref([]);
  const currentVehicle = ref(null);
  const vehicleBrands = ref([]);
  const vehicleModels = ref([]);
  const vehicleTypes = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // 方法
  const fetchVehicles = async (params = {}) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await getMobileVehicles(params);
      vehicles.value = response.data.content;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取车辆列表失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchVehicleById = async (vehicleId) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await getMobileVehicleById(vehicleId);
      currentVehicle.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取车辆详情失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchVehicleBrands = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await getVehicleBrands();
      vehicleBrands.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取车辆品牌失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchVehicleModels = async (brandId = null) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await getVehicleModels(brandId);
      vehicleModels.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取车辆型号失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchVehicleTypes = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await getVehicleTypes();
      vehicleTypes.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取车辆类型失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  return {
    vehicles,
    currentVehicle,
    vehicleBrands,
    vehicleModels,
    vehicleTypes,
    loading,
    error,
    fetchVehicles,
    fetchVehicleById,
    fetchVehicleBrands,
    fetchVehicleModels,
    fetchVehicleTypes
  };
});

// Export alias for compatibility
export const useVehicleStore = useMobileVehicleStore;