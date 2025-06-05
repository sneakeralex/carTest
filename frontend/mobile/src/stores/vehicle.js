import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  getMobileVehicles,
  getMobileVehicleById,
  getUserVehicles,
  addUserVehicle,
  updateMobileVehicle,
  deleteMobileVehicle,
  uploadVehicleImages,
  getVehicleImages,
  getVehicleBrands,
  getVehicleModels
} from '../api/vehicle';

export const useMobileVehicleStore = defineStore('mobileVehicle', () => {
  // 状态
  const vehicles = ref([]);
  const currentVehicle = ref(null);
  const userVehicles = ref([]);
  const vehicleImages = ref([]);
  const vehicleBrands = ref([]);
  const vehicleModels = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // 方法
  const fetchVehicles = async (params = {}) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await getMobileVehicles(params);
      vehicles.value = response.data;
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

  const fetchUserVehicles = async (userId) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await getUserVehicles(userId);
      userVehicles.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取用户车辆列表失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const createUserVehicle = async (userId, vehicleData) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await addUserVehicle(userId, vehicleData);
      // 添加成功后刷新用户车辆列表
      await fetchUserVehicles(userId);
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '添加车辆失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const updateVehicleById = async (vehicleId, vehicleData) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await updateMobileVehicle(vehicleId, vehicleData);
      // 更新成功后刷新当前车辆
      if (currentVehicle.value && currentVehicle.value.vehicleId === vehicleId) {
        currentVehicle.value = response.data;
      }
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '更新车辆信息失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const removeVehicle = async (vehicleId) => {
    loading.value = true;
    error.value = null;

    try {
      await deleteMobileVehicle(vehicleId);
      // 删除成功后从列表中移除
      userVehicles.value = userVehicles.value.filter(vehicle => vehicle.vehicleId !== vehicleId);
      if (currentVehicle.value && currentVehicle.value.vehicleId === vehicleId) {
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

  const uploadImages = async (vehicleId, formData) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await uploadVehicleImages(vehicleId, formData);
      // 上传成功后刷新车辆图片
      await fetchVehicleImages(vehicleId);
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '上传车辆图片失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchVehicleImages = async (vehicleId) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await getVehicleImages(vehicleId);
      vehicleImages.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取车辆图片失败';
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

  return {
    vehicles,
    currentVehicle,
    userVehicles,
    vehicleImages,
    vehicleBrands,
    vehicleModels,
    loading,
    error,
    fetchVehicles,
    fetchVehicleById,
    fetchUserVehicles,
    createUserVehicle,
    updateVehicleById,
    removeVehicle,
    uploadImages,
    fetchVehicleImages,
    fetchVehicleBrands,
    fetchVehicleModels
  };
});