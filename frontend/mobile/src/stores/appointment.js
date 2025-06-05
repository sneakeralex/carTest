import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  getTestConsultationAppointments,
  getTestConsultationAppointmentById,
  createTestConsultationAppointment,
  updateTestConsultationAppointment,
  cancelTestConsultationAppointment,
  getUserTestConsultationAppointments,
  approveTestConsultationAppointment,
  completeTestConsultationAppointment
} from '../api/appointment';

export const useTestConsultationAppointmentStore = defineStore('testConsultationAppointment', () => {
  // 状态
  const appointments = ref([]);
  const currentAppointment = ref(null);
  const userAppointments = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // 方法
  const fetchAppointments = async (params = {}) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await getTestConsultationAppointments(params);
      appointments.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取测试咨询预约列表失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchAppointmentById = async (appointmentNo) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await getTestConsultationAppointmentById(appointmentNo);
      currentAppointment.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取测试咨询预约详情失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const addAppointment = async (appointmentData) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await createTestConsultationAppointment(appointmentData);
      // 添加成功后刷新列表
      await fetchAppointments();
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '创建测试咨询预约失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const updateAppointmentById = async (appointmentNo, appointmentData) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await updateTestConsultationAppointment(appointmentNo, appointmentData);
      // 更新成功后刷新列表和当前预约
      if (currentAppointment.value && currentAppointment.value.appointmentNo === appointmentNo) {
        currentAppointment.value = response.data;
      }
      await fetchAppointments();
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '更新测试咨询预约失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const cancelAppointmentById = async (appointmentNo) => {
    loading.value = true;
    error.value = null;

    try {
      await cancelTestConsultationAppointment(appointmentNo);
      // 取消成功后刷新列表
      if (currentAppointment.value && currentAppointment.value.appointmentNo === appointmentNo) {
        currentAppointment.value.status = 'CANCELLED';
      }
      await fetchAppointments();
      return true;
    } catch (err) {
      error.value = err.response?.data?.message || '取消测试咨询预约失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchUserAppointments = async (userId) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await getUserTestConsultationAppointments(userId);
      userAppointments.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取用户测试咨询预约列表失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const approveAppointmentById = async (appointmentNo) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await approveTestConsultationAppointment(appointmentNo);
      // 审批成功后刷新当前预约
      if (currentAppointment.value && currentAppointment.value.appointmentNo === appointmentNo) {
        currentAppointment.value.status = 'APPROVED';
      }
      await fetchAppointments();
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '审批测试咨询预约失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const completeAppointmentById = async (appointmentNo) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await completeTestConsultationAppointment(appointmentNo);
      // 完成成功后刷新当前预约
      if (currentAppointment.value && currentAppointment.value.appointmentNo === appointmentNo) {
        currentAppointment.value.status = 'COMPLETED';
      }
      await fetchAppointments();
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '完成测试咨询预约失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  return {
    appointments,
    currentAppointment,
    userAppointments,
    loading,
    error,
    fetchAppointments,
    fetchAppointmentById,
    addAppointment,
    updateAppointmentById,
    cancelAppointmentById,
    fetchUserAppointments,
    approveAppointmentById,
    completeAppointmentById
  };
});