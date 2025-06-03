import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getAppointments, getAppointmentById, createAppointment, updateAppointment, cancelAppointment } from '../api/appointment';

export const useAppointmentStore = defineStore('appointment', () => {
  // 状态
  const appointments = ref([]);
  const currentAppointment = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // 方法
  const fetchAppointments = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await getAppointments();
      appointments.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取预约列表失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchAppointmentById = async (id) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await getAppointmentById(id);
      currentAppointment.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取预约详情失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const addAppointment = async (appointmentData) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await createAppointment(appointmentData);
      // 添加成功后刷新列表
      await fetchAppointments();
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '创建预约失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const updateAppointmentById = async (id, appointmentData) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await updateAppointment(id, appointmentData);
      // 更新成功后刷新列表和当前预约
      if (currentAppointment.value && currentAppointment.value.id === id) {
        currentAppointment.value = response.data;
      }
      await fetchAppointments();
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '更新预约信息失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const cancelAppointmentById = async (id) => {
    loading.value = true;
    error.value = null;
    
    try {
      await cancelAppointment(id);
      // 取消成功后刷新列表
      if (currentAppointment.value && currentAppointment.value.id === id) {
        currentAppointment.value.status = 'CANCELLED';
      }
      await fetchAppointments();
      return true;
    } catch (err) {
      error.value = err.response?.data?.message || '取消预约失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  return {
    appointments,
    currentAppointment,
    loading,
    error,
    fetchAppointments,
    fetchAppointmentById,
    addAppointment,
    updateAppointmentById,
    cancelAppointmentById
  };
});