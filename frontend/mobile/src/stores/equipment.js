import { defineStore } from 'pinia';
import { ref } from 'vue';
import * as equipmentApi from '../api/equipment.js';

export const useEquipmentStore = defineStore('equipment', () => {
  // 状态
  const equipments = ref([]);
  const currentEquipment = ref(null);
  const applications = ref([]);
  const currentApplication = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const pagination = ref({
    page: 1,
    pageSize: 20,
    total: 0
  });

  // 获取设备列表
  const fetchEquipments = async (params = {}) => {
    loading.value = true;
    error.value = null;
    
    try {
      const queryParams = {
        page: params.page || pagination.value.page,
        size: params.pageSize || pagination.value.pageSize,
        equipmentType: params.type,
        status: params.status,
        keyword: params.keyword
      };

      const response = await equipmentApi.getEquipments(queryParams);
      
      let data;
      let records;
      
      if (Array.isArray(response)) {
        records = response;
        data = { records, total: records.length };
      } else if (Array.isArray(response.data)) {
        records = response.data;
        data = { records, total: records.length };
      } else {
        records = response?.data?.records || response?.data?.data || response?.data?.content || [];
        const total = response?.data?.total || response?.data?.totalElements || records.length;
        data = { records, total };
      }

      // 更新分页信息
      pagination.value = {
        page: params.page || pagination.value.page,
        pageSize: params.pageSize || pagination.value.pageSize,
        total: data.total
      };

      equipments.value = data.records;
      return data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取设备列表失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  // 获取设备详情
  const fetchEquipmentById = async (id) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await equipmentApi.getEquipmentById(id);
      currentEquipment.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取设备详情失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  // 获取设备申请记录列表
  const fetchApplications = async (params = {}) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await equipmentApi.getEquipmentApplications(params);
      let data;
      if (Array.isArray(response)) {
        data = response;
      } else if (Array.isArray(response.data)) {
        data = response.data;
      } else {
        data = response?.data?.records || response?.data?.data || [];
      }
      
      // 确保状态字段格式正确
      data = data.map(item => ({
        ...item,
        status: typeof item.status === 'object' ? item.status.value : item.status
      }));
      
      applications.value = data;
      return data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取设备申请记录失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  // 获取设备申请详情
  const fetchApplicationById = async (id) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await equipmentApi.getEquipmentApplicationById(id);
      currentApplication.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取设备申请详情失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  // 提交设备申请
  const applyEquipment = async (data) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await equipmentApi.applyEquipment(data);
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '提交设备申请失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  // 更新申请状态
  const updateApplicationStatus = async (id, data) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await equipmentApi.updateApplicationStatus(id, data);
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '更新申请状态失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  // 审批设备申请
  const approveEquipmentRequest = async (requestId, approved, comments, approverId) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await equipmentApi.approveEquipmentRequest(requestId, {
        approved,
        comments,
        approverId
      });
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '审批设备申请失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  // 取消设备申请
  const cancelEquipmentRequest = async (requestId, reason) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await equipmentApi.cancelEquipmentRequest(requestId, {
        reason
      });
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '取消设备申请失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  // 获取可租用设备列表
  const fetchRentableEquipments = async (params = {}) => {
    loading.value = true;
    error.value = null;
    
    try {
      const queryParams = {
        pageNum: params.page || pagination.value.page,
        pageSize: params.pageSize || pagination.value.pageSize,
        deviceNo: params.deviceNo,
        deviceName: params.deviceName
      };

      const response = await equipmentApi.getRentableEquipmentList(queryParams);
      
      let data;
      let records;
      
      if (Array.isArray(response)) {
        records = response;
        data = { records, total: records.length };
      } else if (Array.isArray(response.data)) {
        records = response.data;
        data = { records, total: records.length };
      } else {
        records = response?.data?.records || response?.data?.data || response?.data?.content || [];
        const total = response?.data?.total || response?.data?.totalElements || records.length;
        data = { records, total };
      }

      // 更新分页信息
      pagination.value = {
        page: params.page || pagination.value.page,
        pageSize: params.pageSize || pagination.value.pageSize,
        total: data.total
      };

      equipments.value = data.records;
      return data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取可租用设备列表失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  return {
    // 状态
    equipments,
    currentEquipment,
    applications,
    currentApplication,
    loading,
    error,
    pagination,

    // 方法
    fetchEquipments,
    fetchEquipmentById,
    fetchApplications,
    fetchApplicationById,
    applyEquipment,
    updateApplicationStatus,
    approveEquipmentRequest,
    cancelEquipmentRequest,
    fetchRentableEquipments
  };
});
